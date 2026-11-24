import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type MembershipPlan = "FREE" | "PRO";

export interface StoredAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // format: saltHex:hashHex
  plan: MembershipPlan;
  planUpdatedAt: string;
  billingCustomerId?: string;
  dailyGenerationsDate: string;
  dailyGenerationsCount: number;
  createdAt: string;
}

export interface PublicAccount {
  id: string;
  email: string;
  name: string;
  plan: MembershipPlan;
  planUpdatedAt: string;
  dailyGenerationsUsed: number;
  dailyGenerationsLimit: number | null;
  createdAt: string;
}

interface AccountDatabase {
  accounts: StoredAccount[];
  guestUsage: Record<string, { date: string; count: number }>;
}

export const FREE_DAILY_GENERATION_LIMIT = 3;

const DATA_DIR = path.resolve(process.cwd(), ".idea-world-data");
const DB_FILE = path.join(DATA_DIR, "accounts.json");

// Ephemeral fallback signing key per process if SESSION_SECRET is unset (never stored in .env.example)
const SIGNING_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function readDb(): AccountDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { accounts: [], guestUsage: {} };
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AccountDatabase>;
    return {
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      guestUsage:
        parsed.guestUsage && typeof parsed.guestUsage === "object" ? parsed.guestUsage : {},
    };
  } catch {
    return { accounts: [], guestUsage: {} };
  }
}

function writeDb(db: AccountDatabase): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { encoding: "utf8", mode: 0o600 });
  fs.renameSync(tmp, DB_FILE);
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  const actualBuf = crypto.scryptSync(password, salt, 64);
  const expectedBuf = Buffer.from(expectedHex, "hex");
  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}

export function sanitizeAccount(acc: StoredAccount): PublicAccount {
  const today = todayIsoDate();
  const usedToday = acc.dailyGenerationsDate === today ? acc.dailyGenerationsCount : 0;
  return {
    id: acc.id,
    email: acc.email,
    name: acc.name,
    plan: acc.plan,
    planUpdatedAt: acc.planUpdatedAt,
    dailyGenerationsUsed: usedToday,
    dailyGenerationsLimit: acc.plan === "PRO" ? null : FREE_DAILY_GENERATION_LIMIT,
    createdAt: acc.createdAt,
  };
}

export function createSessionToken(accountId: string): string {
  const payload = {
    uid: accountId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SIGNING_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string | undefined): StoredAccount | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(encoded)
    .digest("base64url");

  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      uid?: string;
      exp?: number;
    };
    if (!decoded.uid || !decoded.exp || decoded.exp <= Date.now()) {
      return null;
    }
    const db = readDb();
    return db.accounts.find((a) => a.id === decoded.uid) ?? null;
  } catch {
    return null;
  }
}

export function registerAccount(input: {
  email: string;
  password: string;
  name: string;
}): { account: PublicAccount; token: string } {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    throw new Error("INVALID_EMAIL");
  }
  if (password.length < 8 || password.length > 128) {
    throw new Error("INVALID_PASSWORD");
  }
  if (!name || name.length > 80) {
    throw new Error("INVALID_NAME");
  }

  const db = readDb();
  if (db.accounts.some((a) => a.email === email)) {
    throw new Error("EMAIL_EXISTS");
  }

  const now = new Date().toISOString();
  // Security invariant: every new account unconditionally starts on FREE
  const newAcc: StoredAccount = {
    id: `usr_${crypto.randomUUID()}`,
    email,
    name,
    passwordHash: hashPassword(password),
    plan: "FREE",
    planUpdatedAt: now,
    dailyGenerationsDate: todayIsoDate(),
    dailyGenerationsCount: 0,
    createdAt: now,
  };

  db.accounts.push(newAcc);
  writeDb(db);

  return {
    account: sanitizeAccount(newAcc),
    token: createSessionToken(newAcc.id),
  };
}

export function authenticateAccount(input: {
  email: string;
  password: string;
}): { account: PublicAccount; token: string } {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  const db = readDb();
  const account = db.accounts.find((a) => a.email === email);
  if (!account || !verifyPassword(password, account.passwordHash)) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    account: sanitizeAccount(account),
    token: createSessionToken(account.id),
  };
}

export function getGuestUsageToday(guestKey: string): {
  used: number;
  limit: number;
} {
  const db = readDb();
  const today = todayIsoDate();
  const rec = db.guestUsage[guestKey];
  const used = rec && rec.date === today ? rec.count : 0;
  return { used, limit: FREE_DAILY_GENERATION_LIMIT };
}

export function canConsumeGenerationQuota(
  account: StoredAccount | null,
  guestKey: string
): { allowed: boolean; used: number; limit: number | null } {
  const today = todayIsoDate();
  if (account) {
    if (account.plan === "PRO") {
      return { allowed: true, used: account.dailyGenerationsCount, limit: null };
    }
    const used = account.dailyGenerationsDate === today ? account.dailyGenerationsCount : 0;
    return {
      allowed: used < FREE_DAILY_GENERATION_LIMIT,
      used,
      limit: FREE_DAILY_GENERATION_LIMIT,
    };
  }

  const db = readDb();
  const rec = db.guestUsage[guestKey];
  const used = rec && rec.date === today ? rec.count : 0;
  return {
    allowed: used < FREE_DAILY_GENERATION_LIMIT,
    used,
    limit: FREE_DAILY_GENERATION_LIMIT,
  };
}

export function recordGenerationUsage(
  accountId: string | null,
  guestKey: string
): PublicAccount | null {
  const db = readDb();
  const today = todayIsoDate();

  if (accountId) {
    const acc = db.accounts.find((a) => a.id === accountId);
    if (!acc) return null;
    if (acc.dailyGenerationsDate !== today) {
      acc.dailyGenerationsDate = today;
      acc.dailyGenerationsCount = 1;
    } else {
      acc.dailyGenerationsCount += 1;
    }
    writeDb(db);
    return sanitizeAccount(acc);
  }

  const rec = db.guestUsage[guestKey];
  if (!rec || rec.date !== today) {
    db.guestUsage[guestKey] = { date: today, count: 1 };
  } else {
    rec.count += 1;
  }
  writeDb(db);
  return null;
}

export function setAccountMembershipPlanFromWebhook(
  accountId: string,
  plan: MembershipPlan,
  billingCustomerId?: string
): PublicAccount | null {
  const db = readDb();
  const acc = db.accounts.find((a) => a.id === accountId);
  if (!acc) return null;
  acc.plan = plan;
  acc.planUpdatedAt = new Date().toISOString();
  if (billingCustomerId) {
    acc.billingCustomerId = billingCustomerId;
  }
  writeDb(db);
  return sanitizeAccount(acc);
}
