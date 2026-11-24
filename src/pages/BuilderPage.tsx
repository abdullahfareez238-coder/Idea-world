import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  Crown,
  Download,
  Hammer,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { CURRENCY_META } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";
import type { ProjectStatus } from "../types/ideaWorld";

export function BuilderPage() {
  const {
    state,
    t,
    lang,
    setActiveProjectId,
    createCustomProject,
    updateProject,
    deleteProject,
    toggleStepComplete,
    addProjectStep,
    updateProjectStep,
    deleteProjectStep,
    moveProjectStep,
    toggleMaterial,
    addMaterial,
    removeMaterial,
    showToast,
    authPlan,
    getAuthHeaders,
    setCurrentPage,
  } = useWorkspace();

  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newCategory, setNewCategory] = useState("Tech & Apps");
  const [newBudget, setNewBudget] = useState(50);

  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");
  const [stepDeliverable, setStepDeliverable] = useState("");
  const [stepHours, setStepHours] = useState(2);

  const [newMaterial, setNewMaterial] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandingStepId, setExpandingStepId] = useState<string | null>(null);
  const [proGateError, setProGateError] = useState<string | null>(null);

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const activeProject =
    state.projects.find((p) => p.id === state.activeProjectId) ?? state.projects[0] ?? null;

  const currencySymbol = CURRENCY_META[state.settings.currency].symbol;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createCustomProject({
      title: newTitle,
      tagline: newTagline || newTitle,
      category: newCategory,
      budgetTarget: newBudget,
    });
    setNewTitle("");
    setNewTagline("");
    setNewBudget(50);
    setCreateOpen(false);
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !stepTitle.trim()) return;
    addProjectStep(activeProject.id, {
      title: stepTitle.trim(),
      description: stepDesc.trim() || stepTitle.trim(),
      deliverable: stepDeliverable.trim() || "Completed milestone",
      estimatedHours: Math.max(0.5, Number(stepHours) || 1),
      notes: "",
    });
    setStepTitle("");
    setStepDesc("");
    setStepDeliverable("");
    setStepHours(2);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newMaterial.trim()) return;
    addMaterial(activeProject.id, newMaterial);
    setNewMaterial("");
  };

  const handleExpandStep = async (stepId: string, title: string, description: string) => {
    if (!activeProject) return;
    setExpandingStepId(stepId);
    setProGateError(null);
    try {
      const response = await fetch("/api/expand-step", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          projectTitle: activeProject.title,
          stepTitle: title,
          stepDescription: description,
          language: lang,
        }),
      });
      const rawText = await response.text();
      let data: { error?: string; code?: string; subtasks?: string[]; practicalTip?: string } = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("Received an invalid response from the server.");
      }
      if (!response.ok) {
        if (data?.code === "PRO_REQUIRED") {
          setProGateError(data.error || t.membership.proRequiredAction);
        }
        throw new Error(data?.error || "Unable to break down step.");
      }
      updateProjectStep(activeProject.id, stepId, {
        subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
        practicalTip: data.practicalTip || "",
      });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Unable to break down step.",
        "error"
      );
    } finally {
      setExpandingStepId(null);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeProject) return;
    const lines = [
      `# ${activeProject.title}`,
      ``,
      `${activeProject.tagline}`,
      ``,
      `- Category: ${activeProject.category}`,
      `- Status: ${t.builder.statuses[activeProject.status]}`,
      `- Target Date: ${activeProject.targetDate}`,
      `- Budget: ${currencySymbol}${activeProject.budgetSpent} / ${currencySymbol}${activeProject.budgetTarget}`,
      ``,
      `## Tools`,
      ...activeProject.toolsRequired.map((tool) => `- ${tool}`),
      ``,
      `## Materials`,
      ...activeProject.materials.map(
        (m) => `- [${m.acquired ? "x" : " "}] ${m.name}`
      ),
      ``,
      `## Step-by-Step Execution Plan`,
      ...activeProject.steps.map(
        (s, i) =>
          `${i + 1}. [${s.completed ? "x" : " "}] **${s.title}** (${s.estimatedHours}h)\n   - ${s.description}\n   - Deliverable: ${s.deliverable}${s.notes ? `\n   - Notes: ${s.notes}` : ""}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.toasts.exportedMarkdown, "success");
  };

  const completedSteps = activeProject
    ? activeProject.steps.filter((s) => s.completed).length
    : 0;
  const totalSteps = activeProject ? activeProject.steps.length : 0;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t.builder.title}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-300">{t.builder.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9]"
        >
          <Plus className="h-4 w-4" />
          <span>{t.builder.newProjectBtn}</span>
        </button>
      </div>

      {state.projects.length === 0 || !activeProject ? (
        <div
          className={`flex flex-col items-center justify-center rounded-xl border border-dashed ${borderTone} bg-[#0B1124] px-6 py-16 text-center`}
        >
          <Hammer className="h-9 w-9 text-purple-400" />
          <h3 className="mt-4 font-display text-lg font-semibold text-white">
            {t.builder.emptyTitle}
          </h3>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">
            {t.builder.emptyBody}
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-5 inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9]"
          >
            <Plus className="h-4 w-4" />
            <span>{t.builder.newProjectBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Project Selector Rail */}
          <aside className={`rounded-xl border ${borderTone} bg-[#0D1328] p-4 lg:col-span-4`}>
            <h3 className="px-2 text-xs font-semibold tracking-wide text-slate-400">
              {t.builder.projectListTitle} ({state.projects.length})
            </h3>
            <div className="mt-3 space-y-2">
              {state.projects.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                const done = proj.steps.filter((s) => s.completed).length;
                const pct =
                  proj.steps.length > 0 ? Math.round((done / proj.steps.length) * 100) : 0;

                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setActiveProjectId(proj.id)}
                    className={`w-full rounded-lg border p-3.5 text-start transition-colors ${
                      isSelected
                        ? "border-purple-500/60 bg-[#7C3AED]/15"
                        : "border-slate-800/80 bg-[#111831] hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="truncate text-purple-300">{proj.category}</span>
                      <span className="font-mono-num shrink-0">{pct}%</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {proj.title}
                    </p>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-[#8B5CF6]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Materials Checklist inside Rail */}
            <div className="mt-6 border-t border-slate-800/80 pt-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>{t.builder.materialsTitle}</span>
              </div>

              <ul className="mt-3 space-y-2">
                {activeProject.materials.map((mat) => (
                  <li
                    key={mat.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-[#111831] px-3 py-2 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleMaterial(activeProject.id, mat.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-start"
                    >
                      {mat.acquired ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-slate-500" />
                      )}
                      <span
                        className={`truncate ${
                          mat.acquired ? "text-slate-400 line-through" : "text-slate-200"
                        }`}
                      >
                        {mat.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMaterial(activeProject.id, mat.id)}
                      aria-label="Remove item"
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleAddMaterial} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder={t.builder.addMaterialPlaceholder}
                  className="min-h-[38px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[38px] rounded-lg border border-slate-700 bg-[#121A35] px-3 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
                >
                  {t.builder.addMaterialBtn}
                </button>
              </form>
            </div>
          </aside>

          {/* Active Project Workspace */}
          <div className="space-y-6 lg:col-span-8">
            <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={activeProject.title}
                    onChange={(e) =>
                      updateProject(activeProject.id, { title: e.target.value })
                    }
                    className="w-full bg-transparent font-display text-xl font-bold text-white focus:outline-none sm:text-2xl"
                  />
                  <input
                    type="text"
                    value={activeProject.tagline}
                    onChange={(e) =>
                      updateProject(activeProject.id, { tagline: e.target.value })
                    }
                    className="mt-1 w-full bg-transparent text-sm text-slate-300 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportMarkdown}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121A35] px-3 py-1.5 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5 text-purple-300" />
                    <span>{t.builder.exportMarkdown}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(activeProject.id)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-300 whitespace-nowrap shrink-0 hover:bg-red-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.builder.deleteProject}</span>
                  </button>
                </div>
              </div>

              {/* Controls Grid: Status, Progress, Budget, Target Date */}
              <div className="mt-6 grid gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs text-slate-400">
                    {t.builder.statusLabel}
                  </label>
                  <select
                    value={activeProject.status}
                    onChange={(e) =>
                      updateProject(activeProject.id, {
                        status: e.target.value as ProjectStatus,
                      })
                    }
                    className="mt-1.5 min-h-[38px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-2.5 py-1.5 text-xs font-medium text-white focus:border-purple-500 focus:outline-none"
                  >
                    {(Object.keys(t.builder.statuses) as ProjectStatus[]).map((st) => (
                      <option key={st} value={st}>
                        {t.builder.statuses[st]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    {t.builder.deadlineLabel}
                  </label>
                  <input
                    type="date"
                    value={activeProject.targetDate}
                    onChange={(e) =>
                      updateProject(activeProject.id, { targetDate: e.target.value })
                    }
                    className="font-mono-num mt-1.5 min-h-[38px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    {t.builder.spentLabel} ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={activeProject.budgetSpent}
                    onChange={(e) =>
                      updateProject(activeProject.id, {
                        budgetSpent: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="font-mono-num mt-1.5 min-h-[38px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400">
                    {t.builder.targetLabel} ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={activeProject.budgetTarget}
                    onChange={(e) =>
                      updateProject(activeProject.id, {
                        budgetTarget: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="font-mono-num mt-1.5 min-h-[38px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t.builder.completionLabel}</span>
                  <span className="font-mono-num font-semibold text-purple-300">
                    {completedSteps}/{totalSteps} · {progressPct}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#8B5CF6] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Step-by-Step Execution Plan */}
            <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
              <h3 className="font-display text-lg font-semibold text-white">
                {t.builder.stepsTitle}
              </h3>

              {proGateError && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-purple-500/40 bg-purple-950/30 p-3.5 text-xs text-purple-100">
                  <span>{proGateError}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage("upgrade")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    <span>{t.membership.upgradeCta}</span>
                  </button>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {activeProject.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      step.completed
                        ? "border-emerald-500/30 bg-[#0F172E]/60"
                        : "border-slate-800 bg-[#111831]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStepComplete(activeProject.id, step.id)}
                        className="flex items-start gap-3 text-start"
                      >
                        {step.completed ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 hover:text-purple-300" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              step.completed ? "text-slate-400 line-through" : "text-white"
                            }`}
                          >
                            <span className="font-mono-num me-1.5 text-purple-300">
                              0{index + 1}.
                            </span>
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-300">
                            {step.description}
                          </p>
                          <p className="mt-1.5 text-xs text-slate-400">
                            <span className="font-medium text-slate-300">
                              {t.modal.deliverable}:
                            </span>{" "}
                            {step.deliverable} ·{" "}
                            <span className="font-mono-num">
                              {step.estimatedHours} {t.generator.hoursUnit}
                            </span>
                          </p>
                        </div>
                      </button>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveProjectStep(activeProject.id, step.id, "up")}
                          disabled={index === 0}
                          aria-label={t.builder.moveUp}
                          className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProjectStep(activeProject.id, step.id, "down")}
                          disabled={index === activeProject.steps.length - 1}
                          aria-label={t.builder.moveDown}
                          className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProjectStep(activeProject.id, step.id)}
                          aria-label={t.builder.removeStep}
                          className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-red-950/40 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {step.subtasks && step.subtasks.length > 0 && (
                      <div className="mt-3 rounded-lg border border-purple-500/25 bg-[#090E20] p-3">
                        <p className="text-[11px] font-semibold text-purple-300">
                          {t.builder.subtasksTitle}
                        </p>
                        <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                          {step.subtasks.map((sub, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-mono-num text-purple-400">•</span>
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                        {step.practicalTip && (
                          <p className="mt-2 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">
                              {t.builder.tipLabel}:{" "}
                            </span>
                            {step.practicalTip}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={step.notes ?? ""}
                        onChange={(e) =>
                          updateProjectStep(activeProject.id, step.id, {
                            notes: e.target.value,
                          })
                        }
                        placeholder={t.builder.notesPlaceholder}
                        className="min-h-[36px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={expandingStepId === step.id}
                        onClick={() =>
                          handleExpandStep(step.id, step.title, step.description)
                        }
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200 whitespace-nowrap shrink-0 hover:bg-purple-500/20 disabled:opacity-50"
                      >
                        {expandingStepId === step.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {expandingStepId === step.id
                            ? t.builder.expandingStepBtn
                            : authPlan === "PRO"
                            ? t.builder.expandStepBtn
                            : `${t.builder.expandStepBtn} (PRO)`}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Step Form */}
              <form
                onSubmit={handleAddStep}
                className="mt-6 space-y-3 rounded-lg border border-slate-800 bg-[#090E20] p-4"
              >
                <p className="text-xs font-semibold text-white">{t.builder.addStepTitle}</p>
                <div className="grid gap-3 sm:grid-cols-4">
                  <input
                    type="text"
                    required
                    value={stepTitle}
                    onChange={(e) => setStepTitle(e.target.value)}
                    placeholder={t.builder.stepTitlePlaceholder}
                    className="min-h-[38px] rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none sm:col-span-3"
                  />
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={stepHours}
                    onChange={(e) => setStepHours(Number(e.target.value))}
                    placeholder={t.builder.stepHoursPlaceholder}
                    className="font-mono-num min-h-[38px] rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={stepDesc}
                    onChange={(e) => setStepDesc(e.target.value)}
                    placeholder={t.builder.stepDescPlaceholder}
                    className="min-h-[38px] rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={stepDeliverable}
                    onChange={(e) => setStepDeliverable(e.target.value)}
                    placeholder={t.builder.stepDeliverablePlaceholder}
                    className="min-h-[38px] rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.builder.addStepBtn}</span>
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      {/* Create Custom Project Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setCreateOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />
          <form
            onSubmit={handleCreateSubmit}
            className="relative z-10 w-full max-w-md space-y-4 rounded-xl border border-slate-700 bg-[#0D1328] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">
                {t.builder.createModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                {t.builder.projectTitleLabel}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                {t.builder.projectTaglineLabel}
              </label>
              <input
                type="text"
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.builder.projectCategoryLabel}
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.builder.projectBudgetLabel} ({currencySymbol})
                </label>
                <input
                  type="number"
                  min={0}
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="font-mono-num mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="min-h-[40px] rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                {t.builder.cancel}
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6D28D9]"
              >
                {t.builder.createProjectSubmit}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setConfirmDeleteId(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-sm space-y-4 rounded-xl border border-slate-700 bg-[#0D1328] p-6 shadow-2xl">
            <h3 className="font-display text-lg font-semibold text-white">
              {t.builder.confirmDeleteTitle}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {t.builder.confirmDeleteBody}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="min-h-[38px] rounded-lg border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200"
              >
                {t.builder.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="min-h-[38px] rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                {t.builder.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
