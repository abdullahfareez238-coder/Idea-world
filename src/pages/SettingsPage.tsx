import React, { useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { BUDGET_PRESETS, TIMEFRAME_PRESETS } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";
import type { CurrencyCode } from "../types/ideaWorld";

export function SettingsPage() {
  const {
    state,
    t,
    lang,
    updateSettings,
    exportWorkspaceJson,
    importWorkspaceJson,
    resetWorkspace,
  } = useWorkspace();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        importWorkspaceJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t.settings.title}
        </h2>
        <p className="mt-1.5 text-sm text-slate-300">{t.settings.subtitle}</p>
      </div>

      {/* Language & Accessibility */}
      <section className={`divide-y divide-slate-800/80 rounded-xl border ${borderTone} bg-[#0D1328] px-6`}>
        <div className="py-4">
          <h3 className="font-display text-base font-semibold text-white">
            {t.settings.appearanceSection}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-medium text-white">{t.settings.languageLabel}</p>
            <p className="mt-0.5 text-xs text-slate-400">{t.settings.languageDesc}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#070B19] p-1">
            <button
              type="button"
              onClick={() => updateSettings({ language: "en" })}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                lang === "en"
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.settings.englishOption}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ language: "ar" })}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                lang === "ar"
                  ? "bg-[#7C3AED] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.settings.arabicOption}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-medium text-white">
              {t.settings.reducedMotionLabel}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {t.settings.reducedMotionDesc}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reducedMotion}
            onClick={() =>
              updateSettings({ reducedMotion: !state.settings.reducedMotion })
            }
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              state.settings.reducedMotion
                ? "border-purple-400 bg-[#7C3AED]"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                state.settings.reducedMotion
                  ? lang === "ar"
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : lang === "ar"
                  ? "-translate-x-1"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-medium text-white">
              {t.settings.highContrastLabel}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {t.settings.highContrastDesc}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.highContrastBorders}
            onClick={() =>
              updateSettings({
                highContrastBorders: !state.settings.highContrastBorders,
              })
            }
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              state.settings.highContrastBorders
                ? "border-purple-400 bg-[#7C3AED]"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                state.settings.highContrastBorders
                  ? lang === "ar"
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : lang === "ar"
                  ? "-translate-x-1"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Workspace Defaults */}
      <section className={`divide-y divide-slate-800/80 rounded-xl border ${borderTone} bg-[#0D1328] px-6`}>
        <div className="py-4">
          <h3 className="font-display text-base font-semibold text-white">
            {t.settings.workspaceSection}
          </h3>
        </div>

        <div className="grid gap-4 py-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              {t.settings.currencyLabel}
            </label>
            <select
              value={state.settings.currency}
              onChange={(e) =>
                updateSettings({ currency: e.target.value as CurrencyCode })
              }
              className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              {t.settings.defaultBudgetLabel}
            </label>
            <select
              value={state.settings.defaultBudget}
              onChange={(e) => updateSettings({ defaultBudget: e.target.value })}
              className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              {BUDGET_PRESETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {lang === "ar" ? b.ar : b.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              {t.settings.defaultTimeframeLabel}
            </label>
            <select
              value={state.settings.defaultTimeframe}
              onChange={(e) => updateSettings({ defaultTimeframe: e.target.value })}
              className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              {TIMEFRAME_PRESETS.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {lang === "ar" ? tf.ar : tf.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-medium text-white">
              {t.settings.dailyReminderLabel}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {t.settings.dailyReminderDesc}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.dailyReminder}
            onClick={() =>
              updateSettings({ dailyReminder: !state.settings.dailyReminder })
            }
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
              state.settings.dailyReminder
                ? "border-purple-400 bg-[#7C3AED]"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                state.settings.dailyReminder
                  ? lang === "ar"
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : lang === "ar"
                  ? "-translate-x-1"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Data Backup & Reset */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <h3 className="font-display text-base font-semibold text-white">
          {t.settings.dataSection}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportWorkspaceJson}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-white whitespace-nowrap shrink-0 hover:border-purple-500/40"
          >
            <Download className="h-4 w-4 text-purple-300" />
            <span>{t.settings.exportJson}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-white whitespace-nowrap shrink-0 hover:border-purple-500/40"
          >
            <Upload className="h-4 w-4 text-purple-300" />
            <span>{t.settings.importJson}</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/25 px-4 py-2 text-xs font-medium text-red-200 whitespace-nowrap shrink-0 hover:bg-red-950/45"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.settings.resetWorkspace}</span>
          </button>
        </div>
      </section>

      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setConfirmResetOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-sm space-y-4 rounded-xl border border-slate-700 bg-[#0D1328] p-6 shadow-2xl">
            <h3 className="font-display text-lg font-semibold text-white">
              {t.settings.resetConfirmTitle}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {t.settings.resetConfirmBody}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[38px] rounded-lg border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200"
              >
                {t.builder.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetWorkspace();
                  setConfirmResetOpen(false);
                }}
                className="min-h-[38px] rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                {t.settings.resetConfirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
