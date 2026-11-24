import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Circle,
  Compass,
  Flame,
  Hammer,
  Lightbulb,
} from "lucide-react";
import { DAILY_CHALLENGES, formatBudgetAmount, STUDIO_IMAGES } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";

export function DashboardPage() {
  const {
    state,
    t,
    lang,
    setCurrentPage,
    setActiveProjectId,
    toggleStepComplete,
    setInspectedIdea,
    acceptChallenge,
  } = useWorkspace();

  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;
  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const activeProjects = state.projects.filter((p) => p.status !== "completed");
  const allSteps = state.projects.flatMap((p) => p.steps);
  const completedSteps = allSteps.filter((s) => s.completed).length;
  const completedChallenges = Object.values(state.challengeProgress).filter(
    (c) => c.status === "completed"
  ).length;

  const allChallenges = [...state.customChallenges, ...DAILY_CHALLENGES];
  const featuredChallenge =
    allChallenges.find((c) => state.challengeProgress[c.id]?.status !== "completed") ??
    allChallenges[0];
  const featuredProgress = featuredChallenge
    ? state.challengeProgress[featuredChallenge.id]
    : undefined;

  return (
    <div className="space-y-8">
      {/* Hero Studio Banner */}
      <section
        className={`relative overflow-hidden rounded-xl border ${borderTone} bg-[#0D1328]`}
      >
        <div className="grid items-stretch lg:grid-cols-12">
          <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <div>
              <p className="text-xs font-semibold tracking-wide text-purple-300">
                {t.dashboard.heroEyebrow}
              </p>
              <h2 className="mt-3 max-w-xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
                {t.dashboard.heroTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {t.dashboard.heroSubtitle}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage("generator")}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] focus-visible:outline-2 focus-visible:outline-white"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{t.dashboard.primaryCta}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage("builder")}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border ${borderTone} bg-[#121A35] px-5 py-2.5 text-sm font-medium text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:border-purple-500/40 hover:text-white focus-visible:outline-2 focus-visible:outline-[#8B5CF6]`}
              >
                <Hammer className="h-4 w-4 text-purple-300" />
                <span>{t.dashboard.secondaryCta}</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] lg:col-span-5 lg:min-h-[300px]">
            <img
              src={STUDIO_IMAGES.heroStudio}
              alt="IDEA WORLD creative workspace desk"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div
              className={`absolute inset-0 ${
                lang === "ar"
                  ? "bg-gradient-to-l from-[#0D1328] via-[#0D1328]/45 to-transparent"
                  : "bg-gradient-to-r from-[#0D1328] via-[#0D1328]/45 to-transparent"
              }`}
            />
          </div>
        </div>
      </section>

      {/* 4-Column Tabular KPI Strip */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>{t.dashboard.kpis.activeProjects}</span>
            <Hammer className="h-4 w-4 text-purple-400" />
          </div>
          <p className="font-mono-num mt-2.5 text-2xl font-bold text-white sm:text-3xl">
            {activeProjects.length}
          </p>
        </div>

        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>{t.dashboard.kpis.savedIdeas}</span>
            <Bookmark className="h-4 w-4 text-purple-400" />
          </div>
          <p className="font-mono-num mt-2.5 text-2xl font-bold text-white sm:text-3xl">
            {state.savedIdeas.length}
          </p>
        </div>

        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>{t.dashboard.kpis.stepsCompleted}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="font-mono-num mt-2.5 text-2xl font-bold text-white sm:text-3xl">
            {completedSteps}
            <span className="text-base font-normal text-slate-400">/{allSteps.length}</span>
          </p>
        </div>

        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>{t.dashboard.kpis.challengeStreak}</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <p className="font-mono-num mt-2.5 text-2xl font-bold text-white sm:text-3xl">
            {completedChallenges}
          </p>
        </div>
      </section>

      {/* Main 2-Column Workspace */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Active Project Tracker */}
        <section
          className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6 lg:col-span-7`}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {t.dashboard.activeFeedTitle}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {t.dashboard.activeFeedSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage("builder")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 whitespace-nowrap shrink-0 hover:text-purple-200"
            >
              <span>{t.dashboard.viewAllProjects}</span>
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {state.projects.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-white">{t.dashboard.noProjectsTitle}</p>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">
                {t.dashboard.noProjectsBody}
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage("generator")}
                className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6D28D9]"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{t.dashboard.createFirstProject}</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {state.projects.slice(0, 4).map((project) => {
                const done = project.steps.filter((s) => s.completed).length;
                const total = project.steps.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                const nextUnfinished = project.steps.find((s) => !s.completed);

                return (
                  <div key={project.id} className="py-5 first:pt-4 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-purple-300">{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.builder.statuses[project.status]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num">
                            {formatBudgetAmount(project.budgetSpent, state.settings.currency)} /{" "}
                            {formatBudgetAmount(project.budgetTarget, state.settings.currency)}
                          </span>
                        </div>
                        <h4 className="mt-1 font-display text-base font-semibold text-white">
                          {project.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveProjectId(project.id);
                          setCurrentPage("builder");
                        }}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700/70 bg-[#121A35] px-3 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:border-purple-500/40 hover:text-white"
                      >
                        <span>{t.dashboard.openInBuilder}</span>
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-[#8B5CF6] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono-num w-12 text-end text-xs font-semibold text-slate-300">
                        {pct}%
                      </span>
                    </div>

                    {nextUnfinished && (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[#111831] px-3.5 py-2.5">
                        <button
                          type="button"
                          onClick={() => toggleStepComplete(project.id, nextUnfinished.id)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-start text-xs text-slate-200 hover:text-white"
                        >
                          <Circle className="h-4 w-4 shrink-0 text-purple-400" />
                          <span className="truncate">
                            <span className="text-slate-400">{t.dashboard.nextStep}: </span>
                            {nextUnfinished.title}
                          </span>
                        </button>
                        <span className="font-mono-num shrink-0 text-[11px] text-slate-400">
                          {nextUnfinished.estimatedHours} {t.generator.hoursUnit}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Daily Challenge & Saved Ideas */}
        <div className="space-y-6 lg:col-span-5">
          {state.settings.dailyReminder && featuredChallenge && (
            <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
              <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <h3 className="font-display text-base font-semibold text-white">
                    {t.dashboard.todayChallengeTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage("challenges")}
                  className="text-xs font-medium text-purple-300 whitespace-nowrap shrink-0 hover:text-purple-200"
                >
                  {t.dashboard.goToChallenges}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-purple-300">
                    {t.challenges.domains[featuredChallenge.domain]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {featuredChallenge.durationMinutes} {t.challenges.minutesUnit}
                  </span>
                </div>
                <h4 className="mt-1.5 font-display text-base font-semibold text-white">
                  {lang === "ar" ? featuredChallenge.titleAr : featuredChallenge.titleEn}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {lang === "ar" ? featuredChallenge.promptAr : featuredChallenge.promptEn}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {!featuredProgress ? (
                    <button
                      type="button"
                      onClick={() => {
                        acceptChallenge(featuredChallenge.id);
                        setCurrentPage("challenges");
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                    >
                      <span>{t.challenges.acceptBtn}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentPage("challenges")}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/15 px-4 py-1.5 text-xs font-semibold text-purple-200 whitespace-nowrap shrink-0 hover:bg-purple-500/25"
                    >
                      <span>
                        {featuredProgress.status === "completed"
                          ? t.challenges.completedStatus
                          : t.challenges.acceptedStatus}
                      </span>
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Saved Favorite Ideas */}
          <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-purple-400" />
                <h3 className="font-display text-base font-semibold text-white">
                  {t.dashboard.savedLibraryTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage("profile")}
                className="text-xs font-medium text-purple-300 whitespace-nowrap shrink-0 hover:text-purple-200"
              >
                {t.dashboard.viewAllSaved}
              </button>
            </div>

            {state.savedIdeas.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs leading-relaxed text-slate-400">
                  {t.dashboard.noSavedBody}
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentPage("discover")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-purple-200"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>{t.nav.discover}</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {state.savedIdeas.slice(0, 3).map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() => setInspectedIdea(idea)}
                    className="block w-full py-3.5 text-start transition-colors first:pt-3 last:pb-0 hover:text-purple-200"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="text-purple-300">{idea.category}</span>
                      <span className="font-mono-num">
                        {idea.estimatedCost} · {idea.estimatedHours} {t.generator.hoursUnit}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-white">{idea.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{idea.tagline}</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
