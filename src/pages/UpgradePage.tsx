import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";

interface CheckoutResponse {
  configured?: boolean;
  providerReady?: boolean;
  alreadyPro?: boolean;
  supportedProviders?: string[];
  code?: string;
  message?: string;
  error?: string;
  checkoutUrl?: string;
}

export function UpgradePage() {
  const {
    state,
    t,
    lang,
    authAccount,
    authPlan,
    dailyGenerationsUsed,
    dailyGenerationsLimit,
    getAuthHeaders,
    setCurrentPage,
  } = useWorkspace();

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const isPro = authPlan === "PRO";

  const handleStartCheckout = async () => {
    setCheckingOut(true);
    setCheckoutInfo(null);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ language: lang }),
      });

      const rawText = await response.text();
      let payload: CheckoutResponse = {};
      try {
        payload = rawText ? (JSON.parse(rawText) as CheckoutResponse) : {};
      } catch {
        throw new Error(
          lang === "ar"
            ? "استجابة غير صالحة من الخادم."
            : "Received an invalid response from the server."
        );
      }

      if (payload.checkoutUrl) {
        window.location.assign(payload.checkoutUrl);
        return;
      }

      if (response.status === 501 && payload.providerReady) {
        setCheckoutInfo(payload);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error || "Checkout session could not be started.");
      }

      setCheckoutInfo(payload);
    } catch (err) {
      setCheckoutError(
        err instanceof Error
          ? err.message
          : lang === "ar"
          ? "تعذر بدء جلسة الدفع."
          : "Unable to initiate checkout."
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const comparisonRows = [
    {
      label: t.membership.features.dailyIdeas,
      free: t.membership.features.freeDailyVal,
      pro: t.membership.features.proDailyVal,
    },
    {
      label: t.membership.features.blueprintDepth,
      free: t.membership.features.freeDepthVal,
      pro: t.membership.features.proDepthVal,
    },
    {
      label: t.membership.features.projectBuilder,
      free: t.membership.features.freeBuilderVal,
      pro: t.membership.features.proBuilderVal,
    },
    {
      label: t.membership.features.aiBreakdown,
      free: t.membership.features.freeBreakdownVal,
      pro: t.membership.features.proBreakdownVal,
    },
    {
      label: t.membership.features.dailyChallenges,
      free: t.membership.features.freeChallengesVal,
      pro: t.membership.features.proChallengesVal,
    },
    {
      label: t.membership.features.pwaOffline,
      free: t.membership.features.freePwaVal,
      pro: t.membership.features.proPwaVal,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t.membership.upgradePageTitle}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-300">
          {t.membership.upgradePageSubtitle}
        </p>
      </div>

      {/* Verified Backend Membership Status */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                isPro
                  ? "border-purple-400/50 bg-[#7C3AED]/25 text-purple-200"
                  : "border-slate-700 bg-[#121A35] text-slate-300"
              }`}
            >
              {isPro ? <Crown className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-xs font-medium text-slate-400">
                {t.membership.activePlanLabel}
              </p>
              <h3 className="mt-0.5 font-display text-xl font-bold text-white">
                {isPro ? t.membership.proPlanName : t.membership.freePlanName}
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                {authAccount
                  ? `${t.membership.signedInAs}: ${authAccount.email}`
                  : t.membership.guestModeNotice}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#070B19] px-4 py-3 text-start">
            <p className="text-[11px] font-medium text-slate-400">
              {t.membership.currentQuotaLabel}
            </p>
            <p className="font-mono-num mt-1 text-sm font-semibold text-purple-300">
              {dailyGenerationsLimit === null
                ? t.membership.unlimitedLabel
                : `${dailyGenerationsUsed} / ${dailyGenerationsLimit}`}
            </p>
          </div>
        </div>
      </section>

      {/* Plan Summary Cards */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article
          className={`flex flex-col justify-between rounded-xl border p-6 ${
            !isPro ? "border-purple-500/45 bg-[#0F1631]" : `${borderTone} bg-[#0D1328]`
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-white">
                {t.membership.freeCol}
              </h3>
              {!isPro && (
                <span className="text-xs font-semibold text-purple-300">
                  {t.membership.activePlanLabel}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t.membership.freeSummary}
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {t.membership.features.dailyIdeas}: {t.membership.features.freeDailyVal}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {t.membership.features.projectBuilder}: {t.membership.features.freeBuilderVal}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {t.membership.features.pwaOffline}: {t.membership.features.freePwaVal}
                </span>
              </li>
            </ul>
          </div>
        </article>

        <article
          className={`flex flex-col justify-between rounded-xl border p-6 ${
            isPro
              ? "border-purple-400/70 bg-[#12193A]"
              : "border-purple-500/50 bg-[#0D1328]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <Sparkles className="h-5 w-5 text-purple-300" />
                <span>{t.membership.proCol}</span>
              </h3>
              {isPro && (
                <span className="text-xs font-semibold text-emerald-400">
                  {t.membership.activePlanLabel}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t.membership.proSummary}
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-4 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-300" />
                <span>
                  {t.membership.features.dailyIdeas}: {t.membership.features.proDailyVal}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-300" />
                <span>{t.membership.features.proDepthVal}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-300" />
                <span>
                  {t.membership.features.aiBreakdown}: {t.membership.features.proBreakdownVal}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-300" />
                <span>{t.membership.features.proChallengesVal}</span>
              </li>
            </ul>
          </div>
        </article>
      </section>

      {/* Detailed Feature Comparison Table */}
      <section className={`overflow-hidden rounded-xl border ${borderTone} bg-[#0D1328]`}>
        <div className="border-b border-slate-800/80 px-6 py-4">
          <h3 className="font-display text-base font-semibold text-white">
            {t.membership.planComparisonTitle}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="border-b border-slate-800/80 bg-[#090E20] text-slate-400">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-start">
                  {t.membership.featureCol}
                </th>
                <th className="px-6 py-3.5 font-semibold text-start">
                  {t.membership.freeCol}
                </th>
                <th className="px-6 py-3.5 font-semibold text-purple-300 text-start">
                  {t.membership.proCol}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparisonRows.map((row) => (
                <tr key={row.label} className="hover:bg-[#111831]/60">
                  <td className="px-6 py-3.5 font-medium text-white">{row.label}</td>
                  <td className="px-6 py-3.5 text-slate-300">{row.free}</td>
                  <td className="px-6 py-3.5 font-medium text-purple-200">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment-Provider-Ready Checkout Section (Zero Fake Payments / Zero Card Collection) */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h3 className="font-display text-lg font-bold text-white">
              {t.membership.checkoutTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{t.membership.checkoutSubtitle}</p>
            <p className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{t.membership.checkoutSecurityNote}</span>
            </p>
          </div>

          <div className="shrink-0">
            {!authAccount ? (
              <button
                type="button"
                onClick={() => setCurrentPage("profile")}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9]"
              >
                <UserCheck className="h-4 w-4" />
                <span>{t.membership.checkoutGoToProfile}</span>
              </button>
            ) : isPro ? (
              <div className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.membership.checkoutAlreadyPro}</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={checkingOut}
                onClick={handleStartCheckout}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] disabled:opacity-60"
              >
                {checkingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                <span>
                  {checkingOut
                    ? t.membership.checkoutCheckingBtn
                    : t.membership.checkoutBtn}
                </span>
              </button>
            )}
          </div>
        </div>

        {!authAccount && (
          <p className="mt-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            {t.membership.checkoutSignInFirst}
          </p>
        )}

        {checkoutError && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="leading-relaxed">{checkoutError}</p>
          </div>
        )}

        {checkoutInfo && (
          <div className="mt-4 space-y-2 rounded-lg border border-purple-500/40 bg-[#111831] p-4 text-xs text-slate-200">
            <p className="font-semibold text-purple-300">
              {t.membership.checkoutNotConfiguredTitle}
            </p>
            {checkoutInfo.error && (
              <p className="leading-relaxed text-slate-300">{checkoutInfo.error}</p>
            )}
            {checkoutInfo.message && (
              <p className="leading-relaxed text-emerald-300">{checkoutInfo.message}</p>
            )}
            {Array.isArray(checkoutInfo.supportedProviders) && (
              <p className="text-slate-400">
                <span className="font-medium text-slate-300">
                  {t.membership.checkoutProvidersLabel}:{" "}
                </span>
                {checkoutInfo.supportedProviders.join(" · ")}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
