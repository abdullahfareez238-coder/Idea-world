import { Bookmark, Check, Clock, Hammer, Layers, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useWorkspace } from "../context/WorkspaceContext";

export function IdeaDetailModal() {
  const {
    inspectedIdea,
    setInspectedIdea,
    t,
    isIdeaSaved,
    toggleSaveIdea,
    promoteIdeaToProject,
  } = useWorkspace();

  return (
    <AnimatePresence>
      {inspectedIdea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="idea-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setInspectedIdea(null)}
            className="fixed inset-0 bg-[#040712]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-[#0D1328] shadow-2xl"
          >
            {inspectedIdea.imageUrl && (
              <div className="relative h-48 w-full shrink-0 overflow-hidden border-b border-slate-800/80 bg-[#090E20]">
                <img
                  src={inspectedIdea.imageUrl}
                  alt={inspectedIdea.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1328] via-[#0D1328]/45 to-transparent" />
                <button
                  type="button"
                  onClick={() => setInspectedIdea(null)}
                  aria-label={t.modal.close}
                  className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/70 bg-[#0B1124]/85 text-slate-200 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 px-6 py-5">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-purple-300">{inspectedIdea.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inspectedIdea.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{inspectedIdea.estimatedCost}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {inspectedIdea.estimatedHours} {t.generator.hoursUnit}
                  </span>
                </div>
                <h2
                  id="idea-modal-title"
                  className="font-display text-xl font-semibold text-white sm:text-2xl"
                >
                  {inspectedIdea.title}
                </h2>
                <p className="mt-1 text-sm text-slate-300">{inspectedIdea.tagline}</p>
              </div>

              {!inspectedIdea.imageUrl && (
                <button
                  type="button"
                  onClick={() => setInspectedIdea(null)}
                  aria-label={t.modal.close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-[#121A35] text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div>
                <h3 className="text-xs font-semibold tracking-wide text-slate-400">
                  {t.modal.overview}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {inspectedIdea.summary}
                </p>
                {inspectedIdea.fitReason && (
                  <p className="mt-3 text-xs leading-relaxed text-purple-300/90">
                    {t.modal.fitReason}: {inspectedIdea.fitReason}
                  </p>
                )}
              </div>

              <div className="grid gap-5 border-y border-slate-800/80 py-5 sm:grid-cols-2">
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Wrench className="h-4 w-4 text-purple-400" />
                    <span>{t.modal.toolsRequired}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {inspectedIdea.toolsRequired.map((tool) => (
                      <li key={tool} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-purple-400" aria-hidden="true" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span>{t.modal.materialsList}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {inspectedIdea.materials.map((mat) => (
                      <li key={mat} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-slate-500" aria-hidden="true" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold text-white">
                  {t.modal.executionPlan}
                </h3>
                <ol className="space-y-3">
                  {inspectedIdea.steps.map((step, index) => (
                    <li
                      key={`${step.title}-${index}`}
                      className="rounded-lg border border-slate-800/80 bg-[#111831] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="font-mono-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-600/20 text-xs font-semibold text-purple-300">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                            <p className="mt-1 text-sm leading-relaxed text-slate-300">
                              {step.description}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                              <span className="font-medium text-slate-300">
                                {t.modal.deliverable}:
                              </span>{" "}
                              {step.deliverable}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-num flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {step.estimatedHours} {t.generator.hoursUnit}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 bg-[#0A0F22] px-6 py-4">
              <button
                type="button"
                onClick={() => toggleSaveIdea(inspectedIdea)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5CF6] ${
                  isIdeaSaved(inspectedIdea.title)
                    ? "border-purple-500/50 bg-purple-500/15 text-purple-200"
                    : "border-slate-700 bg-[#121A35] text-slate-200 hover:border-slate-600 hover:text-white"
                }`}
              >
                {isIdeaSaved(inspectedIdea.title) ? (
                  <Check className="h-4 w-4 text-purple-300" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span>
                  {isIdeaSaved(inspectedIdea.title) ? t.generator.savedIdea : t.generator.saveIdea}
                </span>
              </button>

              <button
                type="button"
                onClick={() => promoteIdeaToProject(inspectedIdea)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] focus-visible:outline-2 focus-visible:outline-white"
              >
                <Hammer className="h-4 w-4" />
                <span>{t.generator.startProject}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
