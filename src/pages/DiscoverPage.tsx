import { useState } from "react";
import { Bookmark, Check, Clock, Hammer, Search } from "lucide-react";
import { DISCOVER_PROJECTS, formatBudgetAmount } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";

type FilterCategory = "all" | "tech" | "hardware" | "craft" | "sustainability" | "media";

export function DiscoverPage() {
  const {
    state,
    t,
    lang,
    discoverToIdeaBlueprint,
    isIdeaSaved,
    toggleSaveIdea,
    promoteIdeaToProject,
    setInspectedIdea,
  } = useWorkspace();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const categories: FilterCategory[] = [
    "all",
    "tech",
    "hardware",
    "craft",
    "sustainability",
    "media",
  ];

  const filtered = DISCOVER_PROJECTS.filter((item) => {
    if (categoryFilter !== "all" && item.categoryKey !== categoryFilter) {
      return false;
    }
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      item.titleEn,
      item.titleAr,
      item.taglineEn,
      item.taglineAr,
      ...item.toolsEn,
      ...item.toolsAr,
      ...item.materialsEn,
      ...item.materialsAr,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t.discover.title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-300">{t.discover.subtitle}</p>
      </div>

      {/* Search & Category Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.discover.searchPlaceholder}
            className="min-h-[42px] w-full rounded-lg border border-slate-800 bg-[#0D1328] ps-10 pe-4 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0B1124] p-1.5">
          {categories.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#7C3AED] text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                {t.discover.categories[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Showcase Grid */}
      {filtered.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-xl border border-dashed ${borderTone} bg-[#0B1124] px-6 py-16 text-center`}
        >
          <p className="text-sm text-slate-300">{t.discover.emptySearch}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategoryFilter("all");
            }}
            className="mt-4 min-h-[38px] rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-white"
          >
            {t.discover.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => {
            const blueprint = discoverToIdeaBlueprint(item);
            const saved = isIdeaSaved(blueprint.title);
            const author = lang === "ar" ? item.authorAr : item.authorEn;
            const difficulty = lang === "ar" ? item.difficultyAr : item.difficultyEn;

            return (
              <article
                key={item.id}
                className={`flex flex-col overflow-hidden rounded-xl border ${borderTone} bg-[#0D1328] transition-colors hover:border-purple-500/40`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090E20]">
                  <img
                    src={item.imageUrl}
                    alt={blueprint.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1328] via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-purple-300">
                        {t.discover.categories[item.categoryKey]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">
                        {formatBudgetAmount(item.estimatedCostUsd, state.settings.currency)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.estimatedHours} {t.generator.hoursUnit}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-xl font-bold text-white">
                      {blueprint.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">{blueprint.tagline}</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      {blueprint.summary}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {t.discover.byAuthor}{" "}
                      <span className="font-medium text-slate-200">{author}</span>
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectedIdea(blueprint)}
                        className="min-h-[38px] rounded-lg border border-slate-700 bg-[#121A35] px-3.5 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:border-purple-500/40 hover:text-white"
                      >
                        {t.discover.viewBlueprint}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSaveIdea(blueprint)}
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                          saved
                            ? "border-purple-500/50 bg-purple-500/15 text-purple-200"
                            : "border-slate-700 bg-[#121A35] text-slate-200 hover:text-white"
                        }`}
                      >
                        {saved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                        <span>{saved ? t.discover.savedFavorite : t.discover.saveFavorite}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => promoteIdeaToProject(blueprint)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                    >
                      <Hammer className="h-3.5 w-3.5" />
                      <span>{t.discover.cloneToBuilder}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
