import { useState } from "react";
import { CheckCircle2, Clock, Crown, Flame, Loader2, Sparkles } from "lucide-react";
import { DAILY_CHALLENGES } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";
import type { DailyChallenge } from "../types/ideaWorld";

export function ChallengesPage() {
  const {
    state,
    t,
    lang,
    acceptChallenge,
    saveChallengeProgress,
    addCustomChallenge,
    showToast,
    authPlan,
    getAuthHeaders,
    setCurrentPage,
  } = useWorkspace();

  const [domainFilter, setDomainFilter] = useState<"all" | "design" | "build" | "research" | "launch">("all");
  const [generating, setGenerating] = useState(false);
  const [proGateError, setProGateError] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [draftLinks, setDraftLinks] = useState<Record<string, string>>({});

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const allChallenges = [...state.customChallenges, ...DAILY_CHALLENGES];
  const filteredChallenges =
    domainFilter === "all"
      ? allChallenges
      : allChallenges.filter((c) => c.domain === domainFilter);

  const completedCount = Object.values(state.challengeProgress).filter(
    (p) => p.status === "completed"
  ).length;

  const handleGenerateChallenge = async () => {
    setGenerating(true);
    setProGateError(null);
    try {
      const response = await fetch("/api/generate-challenge", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tools: state.profile.tools,
          skills: state.profile.skills,
          language: lang,
        }),
      });
      const rawText = await response.text();
      let data: {
        error?: string;
        code?: string;
        challenge?: {
          title: string;
          domain: string;
          durationMinutes: number;
          prompt: string;
          deliverable: string;
          hints: string[];
        };
      } = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("Received an invalid response from the server.");
      }
      if (!response.ok || !data.challenge) {
        if (data?.code === "PRO_REQUIRED") {
          setProGateError(data.error || t.membership.proRequiredAction);
        }
        throw new Error(data?.error || "Unable to generate custom challenge.");
      }

      const raw = data.challenge;
      const normalizedDomain = (["design", "build", "research", "launch"].includes(
        String(raw.domain).toLowerCase()
      )
        ? String(raw.domain).toLowerCase()
        : "build") as DailyChallenge["domain"];

      const custom: DailyChallenge = {
        id: `chal-custom-${Date.now().toString(36)}`,
        titleEn: raw.title,
        titleAr: raw.title,
        domain: normalizedDomain,
        durationMinutes: Number(raw.durationMinutes) || 45,
        promptEn: raw.prompt,
        promptAr: raw.prompt,
        deliverableEn: raw.deliverable,
        deliverableAr: raw.deliverable,
        hintsEn: Array.isArray(raw.hints) ? raw.hints : [],
        hintsAr: Array.isArray(raw.hints) ? raw.hints : [],
        isCustom: true,
      };
      addCustomChallenge(custom);
      acceptChallenge(custom.id);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Unable to generate challenge.",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  };

  const domains: ("all" | "design" | "build" | "research" | "launch")[] = [
    "all",
    "design",
    "build",
    "research",
    "launch",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t.challenges.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-300">{t.challenges.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="font-mono-num flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0D1328] px-3.5 py-2 text-xs text-slate-300">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>
              {completedCount} {t.challenges.completedCountLabel}
            </span>
          </div>

          <button
            type="button"
            disabled={generating}
            onClick={handleGenerateChallenge}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>
              {generating
                ? t.challenges.generatingChallengeBtn
                : authPlan === "PRO"
                ? t.challenges.generateChallengeBtn
                : `${t.challenges.generateChallengeBtn} (PRO)`}
            </span>
          </button>
        </div>
      </div>

      {proGateError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-500/40 bg-purple-950/30 p-4 text-xs text-purple-100">
          <span>{proGateError}</span>
          <button
            type="button"
            onClick={() => setCurrentPage("upgrade")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
          >
            <Crown className="h-3.5 w-3.5" />
            <span>{t.membership.upgradeCta}</span>
          </button>
        </div>
      )}

      {/* Domain Filter Segmented Controls */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0B1124] p-1.5 w-fit">
        {domains.map((dom) => {
          const active = domainFilter === dom;
          return (
            <button
              key={dom}
              type="button"
              onClick={() => setDomainFilter(dom)}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              }`}
            >
              {dom === "all" ? t.challenges.filterAll : t.challenges.domains[dom]}
            </button>
          );
        })}
      </div>

      {/* Challenge Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filteredChallenges.map((challenge, idx) => {
          const progress = state.challengeProgress[challenge.id];
          const isCompleted = progress?.status === "completed";
          const isAccepted = progress?.status === "accepted";

          const noteValue =
            draftNotes[challenge.id] ?? progress?.reflectionNote ?? "";
          const linkValue =
            draftLinks[challenge.id] ?? progress?.deliverableLink ?? "";

          const title = lang === "ar" ? challenge.titleAr : challenge.titleEn;
          const prompt = lang === "ar" ? challenge.promptAr : challenge.promptEn;
          const deliverable =
            lang === "ar" ? challenge.deliverableAr : challenge.deliverableEn;
          const hints = lang === "ar" ? challenge.hintsAr : challenge.hintsEn;

          return (
            <article
              key={challenge.id}
              className={`flex flex-col justify-between rounded-xl border p-6 transition-colors ${
                isCompleted
                  ? "border-emerald-500/35 bg-[#0D1328]"
                  : `${borderTone} bg-[#0D1328]`
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-purple-300">
                      {t.challenges.domains[challenge.domain]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {challenge.durationMinutes} {t.challenges.minutesUnit}
                    </span>
                    {idx === 0 && !challenge.isCustom && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-amber-300">
                          {t.challenges.featuredLabel}
                        </span>
                      </>
                    )}
                  </div>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t.challenges.completedStatus}
                    </span>
                  )}
                </div>

                <h3 className="mt-2.5 font-display text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{prompt}</p>

                <p className="mt-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    {t.challenges.deliverableLabel}:{" "}
                  </span>
                  {deliverable}
                </p>

                {hints.length > 0 && (
                  <div className="mt-4 border-t border-slate-800/80 pt-3.5">
                    <p className="text-xs font-semibold text-slate-400">
                      {t.challenges.hintsTitle}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                      {hints.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-purple-400">·</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-slate-800/80 pt-4">
                {!progress ? (
                  <button
                    type="button"
                    onClick={() => acceptChallenge(challenge.id)}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    <span>{t.challenges.acceptBtn}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">
                        {t.challenges.reflectionLabel}
                      </label>
                      <textarea
                        rows={2}
                        value={noteValue}
                        onChange={(e) =>
                          setDraftNotes((prev) => ({
                            ...prev,
                            [challenge.id]: e.target.value,
                          }))
                        }
                        placeholder={t.challenges.reflectionPlaceholder}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-[#070B19] p-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400">
                        {t.challenges.linkLabel}
                      </label>
                      <input
                        type="url"
                        value={linkValue}
                        onChange={(e) =>
                          setDraftLinks((prev) => ({
                            ...prev,
                            [challenge.id]: e.target.value,
                          }))
                        }
                        placeholder={t.challenges.linkPlaceholder}
                        className="mt-1 min-h-[36px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          saveChallengeProgress(challenge.id, {
                            reflectionNote: noteValue,
                            deliverableLink: linkValue,
                          })
                        }
                        className="min-h-[38px] rounded-lg border border-slate-700 bg-[#121A35] px-3.5 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
                      >
                        {t.challenges.updateNoteBtn}
                      </button>

                      {isAccepted && (
                        <button
                          type="button"
                          onClick={() =>
                            saveChallengeProgress(challenge.id, {
                              status: "completed",
                              reflectionNote: noteValue,
                              deliverableLink: linkValue,
                            })
                          }
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{t.challenges.completeBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
