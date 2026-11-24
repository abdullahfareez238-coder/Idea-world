import React, { useState } from "react";
import {
  AlertCircle,
  Bookmark,
  Check,
  Clock,
  Crown,
  Hammer,
  Lightbulb,
  Loader2,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  BUDGET_PRESETS,
  PRESET_SKILLS,
  PRESET_TOOLS,
  TIMEFRAME_PRESETS,
} from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";
import type { AuthAccount, IdeaBlueprint } from "../types/ideaWorld";

export function GeneratorPage() {
  const {
    state,
    t,
    lang,
    setGeneratedIdeas,
    isIdeaSaved,
    toggleSaveIdea,
    promoteIdeaToProject,
    setInspectedIdea,
    setCurrentPage,
    authPlan,
    dailyGenerationsUsed,
    dailyGenerationsLimit,
    getAuthHeaders,
    syncQuotaFromApi,
  } = useWorkspace();

  const [selectedTools, setSelectedTools] = useState<string[]>(state.profile.tools);
  const [customTool, setCustomTool] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(state.profile.skills);
  const [customSkill, setCustomSkill] = useState("");
  const [budget, setBudget] = useState(state.settings.defaultBudget || "$75");
  const [hoursPerWeek, setHoursPerWeek] = useState(state.profile.weeklyHours || 8);
  const [timeframe, setTimeframe] = useState(state.settings.defaultTimeframe || "2 weeks");
  const [category, setCategory] = useState("All");
  const [focusNote, setFocusNote] = useState("");
  const [deepMode, setDeepMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  const isPro = authPlan === "PRO";

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((i) => i !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleAddCustomTool = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customTool.trim();
    if (!val) return;
    if (!selectedTools.includes(val)) {
      setSelectedTools([...selectedTools, val]);
    }
    setCustomTool("");
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customSkill.trim();
    if (!val) return;
    if (!selectedSkills.includes(val)) {
      setSelectedSkills([...selectedSkills, val]);
    }
    setCustomSkill("");
  };

  const handleLoadDefaults = () => {
    setSelectedTools(state.profile.tools);
    setSelectedSkills(state.profile.skills);
    setHoursPerWeek(state.profile.weeklyHours);
    setBudget(state.settings.defaultBudget);
    setTimeframe(state.settings.defaultTimeframe);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setNeedsUpgrade(false);
    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tools: selectedTools,
          skills: selectedSkills,
          budget,
          hoursPerWeek,
          timeframe,
          category,
          focusNote,
          deepMode,
          language: lang,
        }),
      });

      const rawText = await response.text();
      let payload: {
        error?: string;
        code?: string;
        used?: number;
        limit?: number | null;
        account?: AuthAccount | null;
        dailyGenerationsUsed?: number;
        dailyGenerationsLimit?: number | null;
        ideas?: Omit<IdeaBlueprint, "id" | "createdAt" | "source">[];
      } = {};
      try {
        payload = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(
          lang === "ar"
            ? "استجابة غير صالحة من الخادم. يرجى المحاولة مرة أخرى."
            : "Received an invalid response from the server. Please try again."
        );
      }

      if (!response.ok) {
        if (payload.code === "PRO_REQUIRED" || payload.code === "QUOTA_EXCEEDED") {
          setNeedsUpgrade(true);
          if (typeof payload.used === "number") {
            syncQuotaFromApi({
              dailyGenerationsUsed: payload.used,
              dailyGenerationsLimit: payload.limit,
            });
          }
        }
        throw new Error(
          payload?.error ||
            (lang === "ar"
              ? "تعذر توليد أفكار المشاريع حالياً."
              : "Failed to generate project ideas.")
        );
      }

      syncQuotaFromApi({
        account: payload.account,
        dailyGenerationsUsed: payload.dailyGenerationsUsed,
        dailyGenerationsLimit: payload.dailyGenerationsLimit,
      });

      const rawIdeas = Array.isArray(payload.ideas) ? payload.ideas : [];
      if (rawIdeas.length === 0) {
        throw new Error(
          lang === "ar"
            ? "لم يُرجع الذكاء الاصطناعي أي أفكار. حاول تعديل المدخلات وإعادة المحاولة."
            : "No project ideas were returned. Please adjust your inputs and try again."
        );
      }

      const ideas: IdeaBlueprint[] = rawIdeas.map((raw, idx) => ({
        ...raw,
        id: `gen-${Date.now()}-${idx}`,
        createdAt: new Date().toISOString(),
        source: "generated",
      }));
      setGeneratedIdeas(ideas);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : lang === "ar"
          ? "حدث خطأ غير متوقع أثناء توليد الأفكار."
          : "An unexpected error occurred while generating ideas."
      );
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "All", en: "All Domains", ar: "كل المجالات" },
    { value: "Tech & Software", en: "Tech & Software", ar: "التقنية والبرمجيات" },
    { value: "Hardware & Maker", en: "Hardware & Maker", ar: "العتاد والإلكترونيات" },
    { value: "Craft & Design", en: "Craft & Design", ar: "التصميم والحرف" },
    { value: "Business & Micro-SaaS", en: "Micro-Venture", ar: "مشاريع ريادية مصغرة" },
    { value: "Sustainability", en: "Sustainability", ar: "الاستدامة والبيئة" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t.generator.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-300">
            {t.generator.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDefaults}
          className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border ${borderTone} bg-[#0D1328] px-4 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:border-purple-500/40 hover:text-white`}
        >
          <RotateCcw className="h-3.5 w-3.5 text-purple-300" />
          <span>{t.generator.loadDefaults}</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Constraints Input Studio */}
        <section
          className={`space-y-6 rounded-xl border ${borderTone} bg-[#0D1328] p-6 lg:col-span-5`}
        >
          {/* Tools */}
          <div>
            <label className="block text-sm font-semibold text-white">
              {t.generator.toolsLabel}
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PRESET_TOOLS.map((tool) => {
                const label = lang === "ar" ? tool.ar : tool.en;
                const active =
                  selectedTools.includes(tool.en) || selectedTools.includes(tool.ar);
                return (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => toggleItem(selectedTools, setSelectedTools, label)}
                    className={`min-h-[36px] rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "border-purple-500/60 bg-[#7C3AED]/20 text-purple-200"
                        : "border-slate-800 bg-[#111831] text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              {selectedTools
                .filter(
                  (toolName) =>
                    !PRESET_TOOLS.some((p) => p.en === toolName || p.ar === toolName)
                )
                .map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    onClick={() => toggleItem(selectedTools, setSelectedTools, custom)}
                    className="min-h-[36px] rounded-lg border border-purple-500/60 bg-[#7C3AED]/20 px-3 py-1.5 text-xs font-medium text-purple-200 whitespace-nowrap"
                  >
                    {custom} ×
                  </button>
                ))}
            </div>
            <form onSubmit={handleAddCustomTool} className="mt-3 flex gap-2">
              <input
                type="text"
                value={customTool}
                onChange={(e) => setCustomTool(e.target.value)}
                placeholder={t.generator.toolsPlaceholder}
                className="min-h-[40px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-700 bg-[#121A35] px-3.5 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.generator.addTool}</span>
              </button>
            </form>
          </div>

          {/* Skills */}
          <div className="border-t border-slate-800/80 pt-5">
            <label className="block text-sm font-semibold text-white">
              {t.generator.skillsLabel}
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PRESET_SKILLS.map((skill) => {
                const label = lang === "ar" ? skill.ar : skill.en;
                const active =
                  selectedSkills.includes(skill.en) || selectedSkills.includes(skill.ar);
                return (
                  <button
                    key={skill.key}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, label)}
                    className={`min-h-[36px] rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "border-purple-500/60 bg-[#7C3AED]/20 text-purple-200"
                        : "border-slate-800 bg-[#111831] text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              {selectedSkills
                .filter(
                  (skillName) =>
                    !PRESET_SKILLS.some((p) => p.en === skillName || p.ar === skillName)
                )
                .map((custom) => (
                  <button
                    key={custom}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, setSelectedSkills, custom)}
                    className="min-h-[36px] rounded-lg border border-purple-500/60 bg-[#7C3AED]/20 px-3 py-1.5 text-xs font-medium text-purple-200 whitespace-nowrap"
                  >
                    {custom} ×
                  </button>
                ))}
            </div>
            <form onSubmit={handleAddCustomSkill} className="mt-3 flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder={t.generator.skillsPlaceholder}
                className="min-h-[40px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-700 bg-[#121A35] px-3.5 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.generator.addSkill}</span>
              </button>
            </form>
          </div>

          {/* Budget */}
          <div className="border-t border-slate-800/80 pt-5">
            <label className="block text-sm font-semibold text-white">
              {t.generator.budgetLabel}
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BUDGET_PRESETS.map((preset) => {
                const active = budget === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBudget(preset.value)}
                    className={`min-h-[38px] rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "border-purple-500/60 bg-[#7C3AED]/20 text-purple-200"
                        : "border-slate-800 bg-[#111831] text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {lang === "ar" ? preset.ar : preset.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Commitment */}
          <div className="space-y-4 border-t border-slate-800/80 pt-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{t.generator.hoursPerWeek}</span>
                <span className="font-mono-num font-semibold text-purple-300">
                  {hoursPerWeek} {t.generator.hoursUnit}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="mt-2.5 w-full accent-[#8B5CF6]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400">
                  {t.generator.timeframeLabel}
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  {TIMEFRAME_PRESETS.map((tf) => (
                    <option key={tf.value} value={tf.value}>
                      {lang === "ar" ? tf.ar : tf.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">
                  {t.generator.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {lang === "ar" ? opt.ar : opt.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Custom Focus Note */}
          <div className="border-t border-slate-800/80 pt-5">
            <label htmlFor="focus-note" className="block text-sm font-semibold text-white">
              {t.generator.focusLabel}
            </label>
            <textarea
              id="focus-note"
              rows={2}
              value={focusNote}
              onChange={(e) => setFocusNote(e.target.value)}
              placeholder={t.generator.focusPlaceholder}
              className="mt-2 w-full rounded-lg border border-slate-800 bg-[#070B19] p-3 text-xs leading-relaxed text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Deep Blueprint Mode (PRO) + Daily Quota Status */}
          <div className="space-y-3 border-t border-slate-800/80 pt-5">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-[#090E20] p-3.5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Crown className="h-3.5 w-3.5 shrink-0 text-purple-300" />
                  <span>{t.membership.deepModeLabel}</span>
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  {t.membership.deepModeDesc}
                </p>
                {!isPro && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage("upgrade")}
                    className="mt-1.5 text-[11px] font-semibold text-purple-300 hover:text-purple-200"
                  >
                    {t.membership.deepModeProHint} →
                  </button>
                )}
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={deepMode}
                onClick={() => {
                  if (!isPro) {
                    setCurrentPage("upgrade");
                    return;
                  }
                  setDeepMode(!deepMode);
                }}
                className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors ${
                  deepMode && isPro
                    ? "border-purple-400 bg-[#7C3AED]"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    deepMode && isPro
                      ? lang === "ar"
                        ? "-translate-x-5"
                        : "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                {authPlan} ·{" "}
                <span className="font-mono-num text-slate-200">
                  {dailyGenerationsLimit === null
                    ? t.membership.unlimitedLabel
                    : `${Math.max(0, dailyGenerationsLimit - dailyGenerationsUsed)} / ${dailyGenerationsLimit} ${t.membership.remainingTodayLabel}`}
                </span>
              </span>
              {!isPro && (
                <button
                  type="button"
                  onClick={() => setCurrentPage("upgrade")}
                  className="font-semibold text-purple-300 hover:text-purple-200"
                >
                  {t.membership.upgradeCta}
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t.generator.generatingBtn}</span>
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4" />
                <span>{t.generator.generateBtn}</span>
              </>
            )}
          </button>
        </section>

        {/* Generated Ideas Results Column */}
        <section className="space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              {t.generator.resultsTitle}
            </h3>
            {state.generatedIdeas.length > 0 && (
              <span className="font-mono-num text-xs text-slate-400">
                {state.generatedIdeas.length} blueprints
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
              {needsUpgrade ? (
                <button
                  type="button"
                  onClick={() => setCurrentPage("upgrade")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span>{t.membership.upgradeCta}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-medium text-red-100 whitespace-nowrap shrink-0 hover:bg-red-500/20"
                >
                  {t.generator.retry}
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`animate-pulse rounded-xl border ${borderTone} bg-[#0D1328] p-6`}
                >
                  <div className="h-3 w-40 rounded bg-slate-800" />
                  <div className="mt-3 h-6 w-3/4 rounded bg-slate-800" />
                  <div className="mt-2 h-4 w-full rounded bg-slate-800/70" />
                  <div className="mt-5 h-20 rounded-lg bg-slate-800/50" />
                </div>
              ))}
            </div>
          ) : state.generatedIdeas.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center rounded-xl border border-dashed ${borderTone} bg-[#0B1124] px-6 py-16 text-center`}
            >
              <SlidersHorizontal className="h-8 w-8 text-purple-400" />
              <h4 className="mt-4 font-display text-base font-semibold text-white">
                {t.generator.resultsEmptyTitle}
              </h4>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
                {t.generator.resultsEmptyBody}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {state.generatedIdeas.map((idea) => {
                const saved = isIdeaSaved(idea.title);
                return (
                  <article
                    key={idea.id}
                    className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6 transition-colors hover:border-purple-500/40`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-purple-300">{idea.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{idea.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{idea.estimatedCost}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {idea.estimatedHours} {t.generator.hoursUnit}
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-xl font-bold text-white">
                      {idea.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-300">{idea.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{idea.summary}</p>

                    <p className="mt-3 text-xs leading-relaxed text-purple-300/90">
                      <span className="font-semibold">{t.generator.fitLabel}: </span>
                      {idea.fitReason}
                    </p>

                    <div className="mt-4 grid gap-4 border-y border-slate-800/80 py-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          {t.generator.toolsNeeded}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-200">
                          {idea.toolsRequired.join(" · ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          {t.generator.materialsNeeded}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-200">
                          {idea.materials.join(" · ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-400">
                        {t.generator.stepPlan} ({idea.steps.length})
                      </p>
                      <ol className="mt-2 space-y-1.5">
                        {idea.steps.slice(0, 3).map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="font-mono-num font-semibold text-purple-300">
                              {i + 1}.
                            </span>
                            <span>{step.title}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setInspectedIdea(idea)}
                          className="min-h-[40px] rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:border-purple-500/40 hover:text-white"
                        >
                          {t.generator.inspectPlan}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSaveIdea(idea)}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                            saved
                              ? "border-purple-500/50 bg-purple-500/15 text-purple-200"
                              : "border-slate-700 bg-[#121A35] text-slate-200 hover:text-white"
                          }`}
                        >
                          {saved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                          <span>{saved ? t.generator.savedIdea : t.generator.saveIdea}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => promoteIdeaToProject(idea)}
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9]"
                      >
                        <Hammer className="h-3.5 w-3.5" />
                        <span>{t.generator.startProject}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
