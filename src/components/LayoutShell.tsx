import React, { useState } from "react";
import {
  Compass,
  Crown,
  Flame,
  Hammer,
  Home,
  Languages,
  Lightbulb,
  Menu,
  Plus,
  Settings,
  Smartphone,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useWorkspace } from "../context/WorkspaceContext";
import type { PageId } from "../types/ideaWorld";
import { IdeaDetailModal } from "./IdeaDetailModal";
import { OfflineIndicator, PWAInstallButton } from "./PWAInstallButton";

const NAV_ITEMS: { id: PageId; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", icon: Home },
  { id: "generator", icon: Lightbulb },
  { id: "builder", icon: Hammer },
  { id: "challenges", icon: Flame },
  { id: "discover", icon: Compass },
  { id: "profile", icon: User },
  { id: "upgrade", icon: Crown },
  { id: "install", icon: Smartphone },
  { id: "settings", icon: Settings },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const {
    state,
    t,
    lang,
    currentPage,
    setCurrentPage,
    updateSettings,
    toast,
    authAccount,
    authPlan,
  } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    updateSettings({ language: lang === "en" ? "ar" : "en" });
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between border-e ${borderTone} bg-[#0B1124]`}
        >
          <div>
            <div className={`flex h-16 items-center border-b ${borderTone} px-6`}>
              <button
                type="button"
                onClick={() => handleNavigate("dashboard")}
                className="flex items-center gap-2.5 text-start whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-white">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <span className="font-display text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
                  {t.brand}
                </span>
              </button>
            </div>

            <nav className="space-y-1 p-4" aria-label="Main navigation">
              {NAV_ITEMS.map(({ id, icon: Icon }) => {
                const active = currentPage === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleNavigate(id)}
                    className={`flex min-h-[42px] w-full items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5CF6] ${
                      active
                        ? "bg-[#7C3AED]/18 text-white ring-1 ring-[#8B5CF6]/40"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-purple-300" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{t.nav[id]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={`space-y-3 border-t ${borderTone} p-4`}>
            <PWAInstallButton />

            <button
              type="button"
              onClick={toggleLanguage}
              className={`flex min-h-[40px] w-full items-center justify-between rounded-lg border ${borderTone} bg-[#111831] px-3.5 py-2 text-xs font-medium text-slate-200 whitespace-nowrap transition-colors hover:border-purple-500/40 hover:text-white focus-visible:outline-2 focus-visible:outline-[#8B5CF6]`}
            >
              <span className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-purple-400" />
                <span>{t.topBar.switchLang}</span>
              </span>
              <span className="font-mono-num text-[11px] text-slate-400">
                {lang === "en" ? "AR" : "EN"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate("profile")}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-start transition-colors hover:bg-slate-800/40 focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
            >
              <img
                src={state.profile.avatarUrl}
                alt={authAccount?.name ?? state.profile.name}
                referrerPolicy="no-referrer"
                className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {authAccount?.name ?? state.profile.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {state.profile.role} ·{" "}
                  <span
                    className={
                      authPlan === "PRO" ? "font-semibold text-purple-300" : "text-slate-300"
                    }
                  >
                    {authPlan}
                  </span>
                </p>
              </div>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              />
              <motion.aside
                initial={{ x: lang === "ar" ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: lang === "ar" ? "100%" : "-100%" }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-y-0 start-0 z-10 flex w-72 flex-col justify-between border-e ${borderTone} bg-[#0B1124]`}
              >
                <div>
                  <div className={`flex h-14 items-center justify-between border-b ${borderTone} px-5`}>
                    <span className="font-display text-base font-bold text-white whitespace-nowrap shrink-0">
                      {t.brand}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label={t.topBar.closeMenu}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="space-y-1 p-4" aria-label="Mobile navigation">
                    {NAV_ITEMS.map(({ id, icon: Icon }) => {
                      const active = currentPage === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleNavigate(id)}
                          className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                            active
                              ? "bg-[#7C3AED]/18 text-white ring-1 ring-[#8B5CF6]/40"
                              : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              active ? "text-purple-300" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{t.nav[id]}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className={`space-y-3 border-t ${borderTone} p-4`}>
                  <PWAInstallButton onNavigateInstallPage={() => handleNavigate("install")} />

                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className={`flex min-h-[44px] w-full items-center justify-between rounded-lg border ${borderTone} bg-[#111831] px-3.5 py-2 text-sm font-medium text-slate-200`}
                  >
                    <span className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-purple-400" />
                      <span>{t.topBar.switchLang}</span>
                    </span>
                    <span className="font-mono-num text-xs text-slate-400">
                      {lang === "en" ? "AR" : "EN"}
                    </span>
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Main Viewport */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Header Bar (Strict 1-row, 3-zone contract, <= 64px) */}
          <header
            className={`sticky top-0 z-30 flex h-14 lg:h-16 items-center justify-between gap-4 border-b ${borderTone} bg-[#070B19]/92 px-4 backdrop-blur-md sm:px-6 lg:px-8`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={t.topBar.openMenu}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[#0D1328] text-slate-200 hover:bg-slate-800 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 items-center gap-2 text-sm">
                <span className="hidden sm:inline text-slate-500 whitespace-nowrap shrink-0">
                  {t.brand}
                </span>
                <span className="hidden sm:inline text-slate-600" aria-hidden="true">
                  /
                </span>
                <h1 className="truncate font-display text-base font-semibold text-white sm:text-lg">
                  {t.nav[currentPage]}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden sm:block">
                <PWAInstallButton compact />
              </div>

              <button
                type="button"
                onClick={() => handleNavigate("generator")}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#6D28D9] focus-visible:outline-2 focus-visible:outline-white"
              >
                <Plus className="h-4 w-4" />
                <span>{t.topBar.newIdea}</span>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <IdeaDetailModal />
      <OfflineIndicator />

      {/* Action Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-5 end-5 z-50 max-w-sm rounded-lg border border-purple-500/40 bg-[#111831] px-4 py-3 text-sm font-medium text-white shadow-xl"
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
