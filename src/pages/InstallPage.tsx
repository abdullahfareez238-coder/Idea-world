import {
  CheckCircle2,
  Download,
  Laptop,
  Share,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { usePWAInstall } from "../hooks/usePWAInstall";

export function InstallPage() {
  const { state, t, showToast } = useWorkspace();
  const { isInstallable, isInstalled, platform, swReady, install } = usePWAInstall();

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const handleInstallClick = async () => {
    const outcome = await install();
    if (outcome === "accepted") {
      showToast(t.pwa.installSuccessToast, "success");
    }
  };

  const platforms = [
    {
      id: "android" as const,
      title: t.pwa.platformAndroidTitle,
      subtitle: t.pwa.platformAndroidSubtitle,
      steps: t.pwa.platformAndroidSteps,
      icon: Smartphone,
    },
    {
      id: "windows" as const,
      title: t.pwa.platformWindowsTitle,
      subtitle: t.pwa.platformWindowsSubtitle,
      steps: t.pwa.platformWindowsSteps,
      icon: Laptop,
    },
    {
      id: "ios" as const,
      title: t.pwa.platformIOSTitle,
      subtitle: t.pwa.platformIOSSubtitle,
      steps: t.pwa.platformIOSSteps,
      icon: Share,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t.pwa.pageTitle}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-300">{t.pwa.pageSubtitle}</p>
      </div>

      {/* Live App Installation Status Card */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <img
              src="/pwa-192x192.png"
              alt={t.brand}
              className="h-16 w-16 shrink-0 rounded-xl border border-purple-500/30 bg-[#070B19] object-cover"
            />
            <div>
              <h3 className="font-display text-lg font-bold text-white">{t.brand}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-purple-300">
                {isInstalled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-emerald-300">{t.pwa.statusInstalled}</span>
                  </>
                ) : isInstallable ? (
                  <>
                    <Download className="h-4 w-4 shrink-0 text-purple-300" />
                    <span>{t.pwa.statusReady}</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="text-slate-200">{t.pwa.statusBrowser}</span>
                  </>
                )}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck
                    className={`h-3.5 w-3.5 ${swReady ? "text-emerald-400" : "text-slate-500"}`}
                  />
                  {swReady ? t.pwa.swActiveLabel : t.pwa.swPendingLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {isInstalled ? t.pwa.standaloneModeLabel : t.pwa.browserModeLabel}
                </span>
              </div>
            </div>
          </div>

          {!isInstalled && isInstallable && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] focus-visible:outline-2 focus-visible:outline-white"
            >
              <Download className="h-4 w-4" />
              <span>{t.pwa.installNowBtn}</span>
            </button>
          )}
        </div>

        {platform === "ios" && !isInstalled && (
          <p className="mt-4 border-t border-slate-800/80 pt-4 text-xs text-purple-200">
            {t.pwa.iosNote}
          </p>
        )}
      </section>

      {/* Platform Guides: Android, Windows, iOS */}
      <section className="grid gap-5 lg:grid-cols-3">
        {platforms.map(({ id, title, subtitle, steps, icon: Icon }) => {
          const isCurrent = platform === id;
          return (
            <article
              key={id}
              className={`flex flex-col rounded-xl border p-6 transition-colors ${
                isCurrent
                  ? "border-purple-500/60 bg-[#0F1631]"
                  : `${borderTone} bg-[#0D1328]`
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-[#7C3AED]/15 text-purple-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{title}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                </div>
              </div>

              <ol className="mt-5 space-y-3 border-t border-slate-800/80 pt-4">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300">
                    <span className="font-mono-num mt-0.5 font-semibold text-purple-300">
                      0{idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </section>
    </div>
  );
}
