import React, { useState } from "react";
import {
  AlertCircle,
  Bookmark,
  CheckCircle2,
  Crown,
  Edit3,
  Flame,
  Hammer,
  LogIn,
  LogOut,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { DAILY_CHALLENGES } from "../data/seedData";
import { useWorkspace } from "../context/WorkspaceContext";

export function ProfilePage() {
  const {
    state,
    t,
    lang,
    updateProfile,
    setInspectedIdea,
    promoteIdeaToProject,
    removeSavedIdea,
    setActiveProjectId,
    setCurrentPage,
    authAccount,
    authPlan,
    dailyGenerationsUsed,
    dailyGenerationsLimit,
    loginAccount,
    registerAccount,
    logoutAccount,
  } = useWorkspace();

  const [authTab, setAuthTab] = useState<"login" | "register">("register");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.profile.name);
  const [role, setRole] = useState(state.profile.role);
  const [location, setLocation] = useState(state.profile.location);
  const [bio, setBio] = useState(state.profile.bio);
  const [weeklyHours, setWeeklyHours] = useState(state.profile.weeklyHours);
  const [tools, setTools] = useState<string[]>(state.profile.tools);
  const [skills, setSkills] = useState<string[]>(state.profile.skills);
  const [newTool, setNewTool] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState<"saved" | "projects" | "challenges">("saved");

  const borderTone = state.settings.highContrastBorders
    ? "border-slate-600/70"
    : "border-slate-800/80";

  const completedProjects = state.projects.filter((p) => p.status === "completed").length;
  const completedChallenges = Object.values(state.challengeProgress).filter(
    (c) => c.status === "completed"
  );

  const allChallenges = [...state.customChallenges, ...DAILY_CHALLENGES];

  const startEditing = () => {
    setName(state.profile.name);
    setRole(state.profile.role);
    setLocation(state.profile.location);
    setBio(state.profile.bio);
    setWeeklyHours(state.profile.weeklyHours);
    setTools(state.profile.tools);
    setSkills(state.profile.skills);
    setEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || state.profile.name,
      role: role.trim() || state.profile.role,
      location: location.trim(),
      bio: bio.trim(),
      weeklyHours: Math.max(1, Number(weeklyHours) || 6),
      tools,
      skills,
    });
    setEditing(false);
  };

  const addTool = () => {
    const val = newTool.trim();
    if (!val || tools.includes(val)) return;
    setTools([...tools, val]);
    setNewTool("");
  };

  const addSkill = () => {
    const val = newSkill.trim();
    if (!val || skills.includes(val)) return;
    setSkills([...skills, val]);
    setNewSkill("");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);
    const result =
      authTab === "login"
        ? await loginAccount(authEmail, authPassword)
        : await registerAccount(authName, authEmail, authPassword);
    if (!result.ok) {
      setAuthError(result.error || "Authentication failed.");
    } else {
      setAuthPassword("");
    }
    setAuthSubmitting(false);
  };

  const isPro = authPlan === "PRO";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t.profile.title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-300">{t.profile.subtitle}</p>
      </div>

      {/* Account & Backend-Verified Membership Status */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {t.membership.accountCardTitle}
            </h3>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
              {t.membership.accountCardSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-slate-800 bg-[#070B19] px-3.5 py-2 text-start">
              <p className="text-[11px] text-slate-400">{t.membership.activePlanLabel}</p>
              <p
                className={`mt-0.5 flex items-center gap-1.5 text-sm font-bold ${
                  isPro ? "text-purple-300" : "text-white"
                }`}
              >
                {isPro && <Crown className="h-4 w-4 text-purple-300" />}
                <span>{isPro ? t.membership.proPlanName : t.membership.freePlanName}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#070B19] px-3.5 py-2 text-start">
              <p className="text-[11px] text-slate-400">{t.membership.currentQuotaLabel}</p>
              <p className="font-mono-num mt-0.5 text-sm font-semibold text-purple-300">
                {dailyGenerationsLimit === null
                  ? t.membership.unlimitedLabel
                  : `${dailyGenerationsUsed} / ${dailyGenerationsLimit}`}
              </p>
            </div>
          </div>
        </div>

        {authAccount ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{authAccount.name}</p>
                <p className="text-xs text-slate-400">{authAccount.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!isPro && (
                <button
                  type="button"
                  onClick={() => setCurrentPage("upgrade")}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9]"
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span>{t.membership.upgradeCta}</span>
                </button>
              )}
              <button
                type="button"
                onClick={logoutAccount}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t.membership.signOutBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 border-t border-slate-800/80 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#090E20] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                  }}
                  className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    authTab === "register"
                      ? "bg-[#7C3AED] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t.membership.registerTab}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                  }}
                  className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    authTab === "login"
                      ? "bg-[#7C3AED] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t.membership.signInTab}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage("upgrade")}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3.5 py-1.5 text-xs font-medium text-purple-200 whitespace-nowrap hover:bg-purple-500/20"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>{t.membership.upgradeCta}</span>
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
              {authTab === "register" && (
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    {t.membership.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.membership.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.membership.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={t.membership.passwordPlaceholder}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-3">
                <p className="text-[11px] text-slate-400">
                  {authTab === "register"
                    ? t.membership.freeAutoAssignNote
                    : t.membership.guestModeNotice}
                </p>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#6D28D9] disabled:opacity-60"
                >
                  {authTab === "login" ? (
                    <LogIn className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {authTab === "login" ? t.membership.signInBtn : t.membership.registerBtn}
                  </span>
                </button>
              </div>
            </form>

            {authError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/30 px-3.5 py-2.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Identity Header Card */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        {!editing ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img
                src={state.profile.avatarUrl}
                alt={state.profile.name}
                referrerPolicy="no-referrer"
                className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-700"
              />
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {state.profile.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-purple-300">{state.profile.role}</span>
                  {state.profile.location && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {state.profile.location}
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {state.profile.weeklyHours} {t.generator.hoursUnit}/wk
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  {state.profile.bio}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startEditing}
              className="inline-flex min-h-[40px] items-center gap-2 self-start rounded-lg border border-slate-700 bg-[#121A35] px-4 py-2 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0 hover:border-purple-500/40 hover:text-white"
            >
              <Edit3 className="h-3.5 w-3.5 text-purple-300" />
              <span>{t.profile.editProfile}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.roleLabel}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.locationLabel}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.weeklyHoursLabel}
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="font-mono-num mt-1.5 min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#070B19] px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                {t.profile.bioLabel}
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-[#070B19] p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.myTools}
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tools.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => setTools(tools.filter((x) => x !== tool))}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-[#111831] px-2.5 py-1 text-xs text-slate-200 hover:border-red-400/50"
                    >
                      <span>{tool}</span>
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder={t.generator.toolsPlaceholder}
                    className="min-h-[36px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTool}
                    className="min-h-[36px] rounded-lg border border-slate-700 bg-[#121A35] px-3 text-xs font-medium text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  {t.profile.mySkills}
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSkills(skills.filter((x) => x !== skill))}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-[#111831] px-2.5 py-1 text-xs text-slate-200 hover:border-red-400/50"
                    >
                      <span>{skill}</span>
                      <X className="h-3 w-3 text-slate-400" />
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder={t.generator.skillsPlaceholder}
                    className="min-h-[36px] flex-1 rounded-lg border border-slate-800 bg-[#070B19] px-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="min-h-[36px] rounded-lg border border-slate-700 bg-[#121A35] px-3 text-xs font-medium text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="min-h-[40px] rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300"
              >
                {t.profile.cancelEdit}
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#7C3AED] px-5 py-2 text-xs font-semibold text-white hover:bg-[#6D28D9]"
              >
                {t.profile.saveProfile}
              </button>
            </div>
          </form>
        )}

        {!editing && (
          <div className="mt-6 grid gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-400">{t.profile.myTools}</p>
              <p className="mt-1.5 text-sm text-slate-200">
                {state.profile.tools.join(" · ")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">{t.profile.mySkills}</p>
              <p className="mt-1.5 text-sm text-slate-200">
                {state.profile.skills.join(" · ")}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Profile Stats Strip */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <p className="text-xs text-slate-400">{t.profile.stats.totalProjects}</p>
          <p className="font-mono-num mt-2 text-2xl font-bold text-white">
            {state.projects.length}
          </p>
        </div>
        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <p className="text-xs text-slate-400">{t.profile.stats.completedProjects}</p>
          <p className="font-mono-num mt-2 text-2xl font-bold text-white">
            {completedProjects}
          </p>
        </div>
        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <p className="text-xs text-slate-400">{t.profile.stats.savedIdeas}</p>
          <p className="font-mono-num mt-2 text-2xl font-bold text-white">
            {state.savedIdeas.length}
          </p>
        </div>
        <div className={`rounded-xl border ${borderTone} bg-[#0D1328] p-5`}>
          <p className="text-xs text-slate-400">{t.profile.stats.challengesDone}</p>
          <p className="font-mono-num mt-2 text-2xl font-bold text-white">
            {completedChallenges.length}
          </p>
        </div>
      </section>

      {/* Personal Library Tabs */}
      <section className={`rounded-xl border ${borderTone} bg-[#0D1328] p-6`}>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-4">
          {(["saved", "projects", "challenges"] as const).map((tab) => {
            const active = activeTab === tab;
            const label =
              tab === "saved"
                ? `${t.profile.tabSaved} (${state.savedIdeas.length})`
                : tab === "projects"
                ? `${t.profile.tabProjects} (${state.projects.length})`
                : `${t.profile.tabChallenges} (${completedChallenges.length})`;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`min-h-[38px] rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#7C3AED] text-white"
                    : "bg-[#111831] text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {activeTab === "saved" &&
            (state.savedIdeas.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                {t.profile.noSavedYet}
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {state.savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Bookmark className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-purple-300">{idea.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">
                          {idea.estimatedCost} · {idea.estimatedHours} {t.generator.hoursUnit}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-base font-semibold text-white">
                        {idea.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">{idea.tagline}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectedIdea(idea)}
                        className="min-h-[36px] rounded-lg border border-slate-700 bg-[#121A35] px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white"
                      >
                        {t.generator.inspectPlan}
                      </button>
                      <button
                        type="button"
                        onClick={() => promoteIdeaToProject(idea)}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#6D28D9]"
                      >
                        <Hammer className="h-3.5 w-3.5" />
                        <span>{t.generator.startProject}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedIdea(idea.id)}
                        aria-label={t.profile.removeFavorite}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-red-500/40 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {activeTab === "projects" && (
            <div className="divide-y divide-slate-800/80">
              {state.projects.map((proj) => {
                const done = proj.steps.filter((s) => s.completed).length;
                const total = proj.steps.length;
                return (
                  <div
                    key={proj.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs text-purple-300">
                        {proj.category} · {t.builder.statuses[proj.status]}
                      </p>
                      <h4 className="mt-1 font-display text-base font-semibold text-white">
                        {proj.title}
                      </h4>
                      <p className="font-mono-num mt-0.5 text-xs text-slate-400">
                        {done}/{total} {t.dashboard.kpis.stepsCompleted}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setCurrentPage("builder");
                      }}
                      className="min-h-[38px] rounded-lg border border-slate-700 bg-[#121A35] px-4 py-1.5 text-xs font-medium text-white hover:border-purple-500/40"
                    >
                      {t.dashboard.openInBuilder}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "challenges" &&
            (completedChallenges.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                {t.profile.noChallengesYet}
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {completedChallenges.map((entry) => {
                  const chal = allChallenges.find((c) => c.id === entry.challengeId);
                  return (
                    <div key={entry.challengeId} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{t.challenges.completedStatus}</span>
                        {chal && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-400">
                              <Flame className="inline h-3.5 w-3.5 text-amber-400" />{" "}
                              {t.challenges.domains[chal.domain]}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="mt-1 font-display text-base font-semibold text-white">
                        {chal
                          ? lang === "ar"
                            ? chal.titleAr
                            : chal.titleEn
                          : entry.challengeId}
                      </h4>
                      {entry.reflectionNote && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-300">
                          {entry.reflectionNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
