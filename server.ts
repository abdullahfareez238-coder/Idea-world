import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, ThinkingLevel, Type, type Schema } from "@google/genai";
import {
  authenticateAccount,
  canConsumeGenerationQuota,
  FREE_DAILY_GENERATION_LIMIT,
  getGuestUsageToday,
  recordGenerationUsage,
  registerAccount,
  sanitizeAccount,
  setAccountMembershipPlanFromWebhook,
  verifySessionToken,
  type MembershipPlan,
  type StoredAccount,
} from "./server/membershipStore.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true);

// Preserve raw body for webhook signature verification while parsing JSON
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
    },
  })
);

// Block direct HTTP access to server source, env files, or runtime data folders in dev mode
app.use((req, res, next) => {
  const lowerPath = req.path.toLowerCase();
  if (
    lowerPath.startsWith("/server") ||
    lowerPath.startsWith("/.idea-world-data") ||
    lowerPath.startsWith("/.env") ||
    lowerPath.startsWith("/.git")
  ) {
    return res.status(404).end();
  }
  return next();
});

const PRIMARY_MODEL = "gemini-4-hydrogen";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function getBearerToken(req: express.Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return undefined;
  return header.slice(7).trim();
}

function getAuthenticatedAccount(req: express.Request): StoredAccount | null {
  return verifySessionToken(getBearerToken(req));
}

function getGuestKey(req: express.Request): string {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `ip:${ip}`;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function extractUpstreamError(error: unknown): {
  status: number;
  message: string;
  apiStatus?: string;
} {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const statusFromErr =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
      ? (error as { status: number }).status
      : undefined;

  let parsedMessage = rawMessage;
  let apiStatus: string | undefined;
  let parsedCode: number | undefined;
  try {
    const jsonStart = rawMessage.indexOf("{");
    if (jsonStart !== -1) {
      const parsed = JSON.parse(rawMessage.slice(jsonStart));
      if (parsed?.error) {
        parsedMessage = parsed.error.message || rawMessage;
        apiStatus = parsed.error.status;
        parsedCode = parsed.error.code;
      }
    }
  } catch {
    // Keep rawMessage
  }

  return {
    status: statusFromErr || parsedCode || 500,
    message: parsedMessage,
    apiStatus,
  };
}

function isTransientError(error: unknown): boolean {
  const { status, apiStatus, message } = extractUpstreamError(error);
  const lower = message.toLowerCase();
  return (
    status === 503 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    apiStatus === "UNAVAILABLE" ||
    apiStatus === "INTERNAL" ||
    lower.includes("high demand") ||
    lower.includes("overloaded") ||
    lower.includes("temporarily unavailable") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanJsonText(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  return trimmed;
}

async function generateStructuredJson<T>(params: {
  contents: string;
  systemInstruction: string;
  responseSchema: Schema;
}): Promise<{ data: T; modelUsed: string }> {
  const ai = getAiClient();
  const attemptSchedule = [
    PRIMARY_MODEL,
    FALLBACK_MODEL,
    PRIMARY_MODEL,
    FALLBACK_MODEL,
    PRIMARY_MODEL,
    FALLBACK_MODEL,
  ];
  let lastError: unknown;

  for (let i = 0; i < attemptSchedule.length; i++) {
    const model = attemptSchedule[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: "application/json",
          responseSchema: params.responseSchema,
          ...(model === PRIMARY_MODEL
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
            : {}),
        },
      });

      const text = cleanJsonText(response.text);
      if (!text) {
        throw new Error("EMPTY_MODEL_RESPONSE");
      }
      const parsed = JSON.parse(text) as T;
      return { data: parsed, modelUsed: model };
    } catch (err) {
      lastError = err;
      const { status, apiStatus, message } = extractUpstreamError(err);
      console.warn(`Gemini attempt ${i + 1}/${attemptSchedule.length} failed (${model}):`, {
        status,
        apiStatus,
        message,
      });

      if (status === 400 || status === 401 || status === 403 || status === 429) {
        throw err;
      }

      const canRetry =
        isTransientError(err) ||
        status === 404 ||
        apiStatus === "NOT_FOUND" ||
        (err instanceof Error && err.message === "EMPTY_MODEL_RESPONSE");

      if (canRetry && i < attemptSchedule.length - 1) {
        const jitter = Math.floor(Math.random() * 250);
        await sleep(350 * (i + 1) + jitter);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

function handleApiError(res: express.Response, error: unknown, language: string = "en") {
  const isAr = language === "ar";
  const rawMessage = error instanceof Error ? error.message : String(error);

  if (rawMessage === "MISSING_GEMINI_API_KEY") {
    return res.status(503).json({
      error: isAr
        ? "مفتاح Gemini API غير مُعد. يرجى إضافته في إعدادات الأسرار (Settings > Secrets)."
        : "GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets.",
      code: "MISSING_API_KEY",
    });
  }
  if (rawMessage === "EMPTY_MODEL_RESPONSE") {
    return res.status(502).json({
      error: isAr
        ? "أرجع نموذج الذكاء الاصطناعي استجابة فارغة. يرجى المحاولة مرة أخرى."
        : "The AI service returned an empty response. Please try generating again.",
      code: "EMPTY_RESPONSE",
    });
  }

  const { status, message, apiStatus } = extractUpstreamError(error);
  console.error("Server API Error:", { status, apiStatus, message });

  if (status === 403 || apiStatus === "PERMISSION_DENIED" || message.includes("API_KEY_INVALID")) {
    return res.status(403).json({
      error: isAr
        ? "تم رفض مفتاح Gemini API. يرجى التحقق من المفتاح في Settings > Secrets."
        : "Gemini API key was rejected. Please verify your key in Settings > Secrets.",
      code: "AUTH_ERROR",
    });
  }
  if (status === 400 || apiStatus === "INVALID_ARGUMENT") {
    return res.status(400).json({
      error: isAr
        ? `طلب غير صالح لنموذج الذكاء الاصطناعي: ${message}`
        : `Invalid generation request: ${message}`,
      code: "INVALID_REQUEST",
    });
  }
  if (status === 404 || apiStatus === "NOT_FOUND") {
    return res.status(404).json({
      error: isAr
        ? `نموذج الذكاء الاصطناعي المطلوب غير متاح حالياً (${message}).`
        : `Requested AI model is unavailable (${message}).`,
      code: "MODEL_NOT_FOUND",
    });
  }
  if (status === 429 || apiStatus === "RESOURCE_EXHAUSTED") {
    return res.status(429).json({
      error: isAr
        ? "تم تجاوز حد الطلبات المسموح به لخدمة Gemini API. يرجى الانتظار قليلاً ثم إعادة المحاولة."
        : "API quota or rate limit reached. Please wait a moment and try again.",
      code: "RATE_LIMIT",
    });
  }
  if (status === 503 || apiStatus === "UNAVAILABLE") {
    return res.status(503).json({
      error: isAr
        ? "تشهد خدمة Gemini AI ضغطاً مرتفعاً مؤقتاً حالياً. يرجى المحاولة مرة أخرى بعد لحظات."
        : "The Gemini AI service is temporarily experiencing high demand. Please try again in a few seconds.",
      code: "MODEL_UNAVAILABLE",
    });
  }

  return res.status(status >= 400 && status < 600 ? status : 500).json({
    error:
      message ||
      (isAr
        ? "تعذر توليد الاستجابة حالياً. يرجى المحاولة مرة أخرى."
        : "Unable to generate response right now. Please try again."),
    code: "UPSTREAM_ERROR",
  });
}

// ---------- Health & Membership Plans ----------
app.get("/api/health", (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    ok: true,
    hasApiKey: Boolean(apiKey && apiKey !== "MY_GEMINI_API_KEY"),
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    paymentProviderConfigured: Boolean(process.env.PAYMENT_PROVIDER_SECRET_KEY),
  });
});

app.get("/api/plans", (_req, res) => {
  res.json({
    plans: [
      {
        id: "FREE",
        dailyGenerationLimit: FREE_DAILY_GENERATION_LIMIT,
        deepBlueprintMode: false,
        aiStepBreakdown: false,
        customAiChallenges: false,
      },
      {
        id: "PRO",
        dailyGenerationLimit: null,
        deepBlueprintMode: true,
        aiStepBreakdown: true,
        customAiChallenges: true,
      },
    ],
  });
});

// ---------- Account Auth & Backend-Authoritative Membership ----------
app.get("/api/auth/me", (req, res) => {
  const account = getAuthenticatedAccount(req);
  if (!account) {
    const guest = getGuestUsageToday(getGuestKey(req));
    return res.json({
      authenticated: false,
      plan: "FREE",
      account: null,
      dailyGenerationsUsed: guest.used,
      dailyGenerationsLimit: guest.limit,
    });
  }
  const publicAccount = sanitizeAccount(account);
  return res.json({
    authenticated: true,
    plan: publicAccount.plan,
    account: publicAccount,
    dailyGenerationsUsed: publicAccount.dailyGenerationsUsed,
    dailyGenerationsLimit: publicAccount.dailyGenerationsLimit,
  });
});

app.post("/api/auth/register", (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  try {
    const { email = "", password = "", name = "" } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
      return res.status(400).json({
        error: isAr ? "بيانات التسجيل غير صالحة." : "Invalid registration payload.",
      });
    }
    const { account, token } = registerAccount({ email, password, name });
    return res.status(201).json({
      authenticated: true,
      token,
      account,
      plan: account.plan,
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "EMAIL_EXISTS") {
      return res.status(409).json({
        error: isAr
          ? "هذا البريد الإلكتروني مسجل مسبقاً."
          : "An account with this email already exists.",
        code,
      });
    }
    if (code === "INVALID_EMAIL") {
      return res.status(400).json({
        error: isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.",
        code,
      });
    }
    if (code === "INVALID_PASSWORD") {
      return res.status(400).json({
        error: isAr
          ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."
          : "Password must be between 8 and 128 characters.",
        code,
      });
    }
    if (code === "INVALID_NAME") {
      return res.status(400).json({
        error: isAr ? "يرجى إدخال الاسم الكامل." : "Please enter your display name.",
        code,
      });
    }
    return res.status(500).json({
      error: isAr ? "تعذر إنشاء الحساب." : "Unable to create account.",
    });
  }
});

app.post("/api/auth/login", (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  try {
    const { email = "", password = "" } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: isAr ? "بيانات الدخول غير صالحة." : "Invalid login payload.",
      });
    }
    const { account, token } = authenticateAccount({ email, password });
    return res.json({
      authenticated: true,
      token,
      account,
      plan: account.plan,
    });
  } catch {
    return res.status(401).json({
      error: isAr
        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        : "Invalid email or password.",
      code: "INVALID_CREDENTIALS",
    });
  }
});

// ---------- Payment-Ready Checkout & Webhook Skeleton (No Fake Payments / No Card Collection) ----------
app.post("/api/billing/create-checkout-session", (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  const account = getAuthenticatedAccount(req);

  if (!account) {
    return res.status(401).json({
      error: isAr
        ? "يرجى تسجيل الدخول أو إنشاء حساب مجاني أولاً قبل المتابعة إلى الترقية."
        : "Please sign in or create a FREE account first before starting checkout.",
      code: "AUTH_REQUIRED",
    });
  }

  if (account.plan === "PRO") {
    return res.status(200).json({
      alreadyPro: true,
      message: isAr ? "حسابك مفعّل بالفعل على خطة PRO." : "Your account is already on the PRO plan.",
    });
  }

  const providerSecret = process.env.PAYMENT_PROVIDER_SECRET_KEY;
  if (!providerSecret) {
    return res.status(501).json({
      configured: false,
      providerReady: true,
      supportedProviders: ["Stripe", "Paddle", "Moyasar"],
      code: "PAYMENT_PROVIDER_NOT_CONFIGURED",
      error: isAr
        ? "بوابة الدفع الإلكتروني غير مفعّلة بعد في البيئة الحالية. النظام جاهز للربط مع مزود دفع آمن عبر مفاتيح الخادم دون جمع بيانات البطاقات داخل التطبيق."
        : "Live payment checkout is not enabled in this environment yet. The backend is ready to connect to a hosted payment provider via server secrets without collecting card data.",
    });
  }

  // Future provider checkout session creation goes here using process.env.PAYMENT_PROVIDER_SECRET_KEY
  return res.status(501).json({
    configured: false,
    providerReady: true,
    code: "PROVIDER_ADAPTER_PENDING",
    error: isAr
      ? "يرجى إتمام ربط جلسة الدفع المستضافة لمزود الدفع المحدد."
      : "Complete hosted checkout adapter wiring for your selected payment provider.",
  });
});

app.post("/api/billing/webhook", (req, res) => {
  const webhookSecret = process.env.PAYMENT_PROVIDER_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(503).json({
      error: "Payment webhook secret is not configured.",
      code: "WEBHOOK_NOT_CONFIGURED",
    });
  }

  const signature = req.headers["x-webhook-signature"];
  const rawBody = (req as express.Request & { rawBody?: Buffer }).rawBody;
  if (typeof signature !== "string" || !rawBody) {
    return res.status(400).json({ error: "Missing webhook signature or body." });
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
  const sigBuf = Buffer.from(signature, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return res.status(401).json({ error: "Invalid webhook signature." });
  }

  const { eventType, accountId, plan, billingCustomerId } = req.body ?? {};
  if (
    eventType === "subscription.updated" &&
    typeof accountId === "string" &&
    (plan === "FREE" || plan === "PRO")
  ) {
    const updated = setAccountMembershipPlanFromWebhook(
      accountId,
      plan as MembershipPlan,
      typeof billingCustomerId === "string" ? billingCustomerId : undefined
    );
    if (!updated) {
      return res.status(404).json({ error: "Account not found." });
    }
    return res.json({ received: true, account: updated });
  }

  return res.json({ received: true });
});

// ---------- AI Endpoints (Server-Side Membership & Quota Enforced) ----------
app.post("/api/generate-ideas", async (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  try {
    const account = getAuthenticatedAccount(req);
    const guestKey = getGuestKey(req);

    const {
      tools = [],
      skills = [],
      budget = "$50",
      hoursPerWeek = 8,
      timeframe = "2 weeks",
      category = "Any",
      focusNote = "",
      deepMode = false,
    } = req.body ?? {};

    // Strict server-side PRO gate for Deep Blueprint Mode
    if (deepMode === true && account?.plan !== "PRO") {
      return res.status(403).json({
        error: isAr
          ? "وضع المخطط العميق متاح حصرياً لحسابات PRO. يمكنك الترقية من صفحة الترقية إلى PRO."
          : "Deep Blueprint Mode is restricted to PRO accounts. Visit Upgrade to PRO to unlock it.",
        code: "PRO_REQUIRED",
        requiredPlan: "PRO",
      });
    }

    // Strict server-side daily quota gate for FREE accounts / guests
    const quota = canConsumeGenerationQuota(account, guestKey);
    if (!quota.allowed) {
      return res.status(403).json({
        error: isAr
          ? `لقد وصلت إلى الحد اليومي المجاني (${FREE_DAILY_GENERATION_LIMIT} مرات توليد في اليوم). قم بالترقية إلى PRO للحصول على توليد غير محدود.`
          : `You have reached the FREE daily limit (${FREE_DAILY_GENERATION_LIMIT} generations/day). Upgrade to PRO for unlimited idea generations.`,
        code: "QUOTA_EXCEEDED",
        used: quota.used,
        limit: quota.limit,
        requiredPlan: "PRO",
      });
    }

    const targetLang = isAr ? "Arabic (natural modern standard Arabic)" : "English";
    const stepCount = deepMode === true && account?.plan === "PRO" ? 7 : 5;

    const prompt = [
      `Generate exactly 3 distinct, realistic, inspiring, and actionable project ideas tailored to the user's constraints.`,
      `Output MUST be written entirely in ${targetLang}.`,
      `User Constraints:`,
      `- Available Tools: ${Array.isArray(tools) && tools.length > 0 ? tools.join(", ") : "Standard computer and smartphone"}`,
      `- Skills: ${Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "General creativity and problem solving"}`,
      `- Budget: ${String(budget)}`,
      `- Free Time: ${Number(hoursPerWeek)} hours/week over ${String(timeframe)}`,
      `- Preferred Category: ${String(category)}`,
      focusNote ? `- Custom Focus / Interest: ${String(focusNote)}` : "",
      `Requirements for each idea:`,
      `- Realistic scope matching the budget and free time.`,
      `- Concrete, step-by-step execution plan with ${stepCount} sequential steps.`,
      `- Each step must have a clear title, specific deliverable/action description, and numeric estimatedHours.`,
      `- Materials/resources list and why it fits the user's constraints.`,
      deepMode === true && account?.plan === "PRO"
        ? `- Include detailed risk mitigation and launch validation in the final steps.`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { data, modelUsed } = await generateStructuredJson<{ ideas?: unknown[] }>({
      systemInstruction:
        "You are a senior creative product strategist and maker mentor for IDEA WORLD. Return strictly valid JSON matching the requested schema.",
      contents: prompt,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                summary: { type: Type.STRING },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                estimatedHours: { type: Type.INTEGER },
                fitReason: { type: Type.STRING },
                toolsRequired: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                materials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedHours: { type: Type.NUMBER },
                      deliverable: { type: Type.STRING },
                    },
                    required: ["title", "description", "estimatedHours", "deliverable"],
                  },
                },
              },
              required: [
                "title",
                "tagline",
                "summary",
                "category",
                "difficulty",
                "estimatedCost",
                "estimatedHours",
                "fitReason",
                "toolsRequired",
                "materials",
                "steps",
              ],
            },
          },
        },
        required: ["ideas"],
      },
    });

    const ideas = Array.isArray(data.ideas) ? data.ideas : [];
    if (ideas.length === 0) {
      return res.status(502).json({
        error: isAr
          ? "لم يُرجع الذكاء الاصطناعي أي أفكار. يرجى تعديل المدخلات وإعادة المحاولة."
          : "No ideas were returned by the AI model. Please refine your inputs and try again.",
        code: "EMPTY_IDEAS",
      });
    }

    const updatedAccount = recordGenerationUsage(account?.id ?? null, guestKey);
    const updatedQuota = canConsumeGenerationQuota(
      updatedAccount ? account : null,
      guestKey
    );

    return res.json({
      ideas,
      modelUsed,
      account: updatedAccount,
      dailyGenerationsUsed: updatedAccount ? updatedAccount.dailyGenerationsUsed : updatedQuota.used,
      dailyGenerationsLimit: updatedAccount
        ? updatedAccount.dailyGenerationsLimit
        : updatedQuota.limit,
    });
  } catch (error) {
    return handleApiError(res, error, language);
  }
});

app.post("/api/expand-step", async (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  try {
    const account = getAuthenticatedAccount(req);
    if (!account || account.plan !== "PRO") {
      return res.status(403).json({
        error: isAr
          ? "تفصيل الخطوات بالذكاء الاصطناعي ميزة مخصصة لحسابات PRO فقط."
          : "AI Step Breakdown is restricted to PRO accounts.",
        code: "PRO_REQUIRED",
        requiredPlan: "PRO",
      });
    }

    const { projectTitle, stepTitle, stepDescription } = req.body ?? {};
    if (!projectTitle || !stepTitle) {
      return res.status(400).json({ error: "Missing projectTitle or stepTitle" });
    }

    const targetLang = isAr ? "Arabic" : "English";
    const { data, modelUsed } = await generateStructuredJson<{
      subtasks: string[];
      practicalTip: string;
    }>({
      systemInstruction:
        "You are a practical project execution coach. Return strictly valid JSON matching the schema.",
      contents: `Break down the project step below into 3 concrete micro-actions and 1 practical tip in ${targetLang}.
Project: ${String(projectTitle)}
Step: ${String(stepTitle)}
Context: ${String(stepDescription ?? "")}`,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subtasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          practicalTip: { type: Type.STRING },
        },
        required: ["subtasks", "practicalTip"],
      },
    });

    return res.json({ ...data, modelUsed });
  } catch (error) {
    return handleApiError(res, error, language);
  }
});

app.post("/api/generate-challenge", async (req, res) => {
  const language = req.body?.language === "ar" ? "ar" : "en";
  const isAr = language === "ar";
  try {
    const account = getAuthenticatedAccount(req);
    if (!account || account.plan !== "PRO") {
      return res.status(403).json({
        error: isAr
          ? "توليد التحديات المخصصة بالذكاء الاصطناعي متاح حصرياً لحسابات PRO."
          : "Custom AI Challenge generation is restricted to PRO accounts.",
        code: "PRO_REQUIRED",
        requiredPlan: "PRO",
      });
    }

    const { tools = [], skills = [] } = req.body ?? {};
    const targetLang = isAr ? "Arabic" : "English";

    const { data, modelUsed } = await generateStructuredJson<{
      title: string;
      domain: string;
      durationMinutes: number;
      prompt: string;
      deliverable: string;
      hints: string[];
    }>({
      systemInstruction:
        "You design focused 30-90 minute creative maker challenges. Return strictly valid JSON matching the schema.",
      contents: `Create 1 focused creative daily challenge (completable in 30 to 90 minutes) tailored to these tools (${Array.isArray(tools) ? tools.join(", ") : "Any"}) and skills (${Array.isArray(skills) ? skills.join(", ") : "Any"}). Set domain to one of: design, build, research, launch. Write title, prompt, deliverable, and hints in ${targetLang}.`,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          domain: { type: Type.STRING },
          durationMinutes: { type: Type.INTEGER },
          prompt: { type: Type.STRING },
          deliverable: { type: Type.STRING },
          hints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "domain", "durationMinutes", "prompt", "deliverable", "hints"],
      },
    });

    return res.json({ challenge: data, modelUsed });
  } catch (error) {
    return handleApiError(res, error, language);
  }
});

async function startServer() {
  const isDev = process.argv.includes("--dev") || process.env.NODE_ENV === "development";

  if (isDev) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`IDEA WORLD server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
