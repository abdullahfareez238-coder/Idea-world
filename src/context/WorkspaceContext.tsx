import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DISCOVER_PROJECTS, getInitialWorkspaceState } from "../data/seedData";
import { translations, type TranslationBundle } from "../i18n/translations";
import type {
  AppSettings,
  AuthAccount,
  ChallengeProgress,
  DailyChallenge,
  DiscoverProject,
  IdeaBlueprint,
  Language,
  MembershipPlan,
  PageId,
  ProjectStep,
  UserProfile,
  UserProject,
  WorkspaceState,
} from "../types/ideaWorld";

const STORAGE_KEY = "idea_world_workspace_v1";

interface ToastMessage {
  id: string;
  text: string;
  tone: "success" | "info" | "error";
}

interface WorkspaceContextValue {
  state: WorkspaceState;
  t: TranslationBundle;
  lang: Language;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  inspectedIdea: IdeaBlueprint | null;
  setInspectedIdea: (idea: IdeaBlueprint | null) => void;
  toast: ToastMessage | null;
  showToast: (text: string, tone?: "success" | "info" | "error") => void;
  setGeneratedIdeas: (ideas: IdeaBlueprint[]) => void;
  isIdeaSaved: (title: string) => boolean;
  toggleSaveIdea: (idea: IdeaBlueprint) => void;
  removeSavedIdea: (id: string) => void;
  discoverToIdeaBlueprint: (disc: DiscoverProject) => IdeaBlueprint;
  promoteIdeaToProject: (idea: IdeaBlueprint) => UserProject;
  createCustomProject: (input: {
    title: string;
    tagline: string;
    category: string;
    budgetTarget: number;
  }) => UserProject;
  setActiveProjectId: (id: string | null) => void;
  updateProject: (projectId: string, patch: Partial<UserProject>) => void;
  deleteProject: (projectId: string) => void;
  toggleStepComplete: (projectId: string, stepId: string) => void;
  addProjectStep: (
    projectId: string,
    step: Omit<ProjectStep, "id" | "completed">
  ) => void;
  updateProjectStep: (
    projectId: string,
    stepId: string,
    patch: Partial<ProjectStep>
  ) => void;
  deleteProjectStep: (projectId: string, stepId: string) => void;
  moveProjectStep: (projectId: string, stepId: string, direction: "up" | "down") => void;
  toggleMaterial: (projectId: string, materialId: string) => void;
  addMaterial: (projectId: string, name: string) => void;
  removeMaterial: (projectId: string, materialId: string) => void;
  acceptChallenge: (challengeId: string) => void;
  saveChallengeProgress: (
    challengeId: string,
    patch: Partial<ChallengeProgress>
  ) => void;
  addCustomChallenge: (challenge: DailyChallenge) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  exportWorkspaceJson: () => void;
  importWorkspaceJson: (jsonText: string) => boolean;
  resetWorkspace: () => void;
  authAccount: AuthAccount | null;
  authPlan: MembershipPlan;
  authLoading: boolean;
  dailyGenerationsUsed: number;
  dailyGenerationsLimit: number | null;
  getAuthHeaders: () => Record<string, string>;
  refreshAuth: (overrideToken?: string | null) => Promise<void>;
  loginAccount: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  registerAccount: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logoutAccount: () => void;
  syncQuotaFromApi: (payload: {
    account?: AuthAccount | null;
    dailyGenerationsUsed?: number;
    dailyGenerationsLimit?: number | null;
  }) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseNumericBudget(costText: string): number {
  const match = costText.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 50;
}

function loadInitialState(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WorkspaceState;
      if (parsed && parsed.profile && parsed.settings && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch {
    // Fallback cleanly to initial seed state
  }
  return getInitialWorkspaceState("en");
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(() => loadInitialState());
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [inspectedIdea, setInspectedIdea] = useState<IdeaBlueprint | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Session token kept strictly in JS/React memory (never localStorage/sessionStorage)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authAccount, setAuthAccount] = useState<AuthAccount | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [dailyGenerationsUsed, setDailyGenerationsUsed] = useState<number>(0);
  const [dailyGenerationsLimit, setDailyGenerationsLimit] = useState<number | null>(3);

  const authPlan: MembershipPlan = authAccount?.plan ?? "FREE";
  const lang = state.settings.language;
  const t = translations[lang];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues safely
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.classList.toggle("reduced-motion", state.settings.reducedMotion);
  }, [lang, state.settings.reducedMotion]);

  const showToast = useCallback((text: string, tone: "success" | "info" | "error" = "success") => {
    const id = makeId("toast");
    setToast({ id, text, tone });
    window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3400);
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    return {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  }, [authToken]);

  const syncQuotaFromApi = useCallback(
    (payload: {
      account?: AuthAccount | null;
      dailyGenerationsUsed?: number;
      dailyGenerationsLimit?: number | null;
    }) => {
      if (payload.account) {
        setAuthAccount(payload.account);
        setDailyGenerationsUsed(payload.account.dailyGenerationsUsed);
        setDailyGenerationsLimit(payload.account.dailyGenerationsLimit);
        return;
      }
      if (typeof payload.dailyGenerationsUsed === "number") {
        setDailyGenerationsUsed(payload.dailyGenerationsUsed);
      }
      if (payload.dailyGenerationsLimit !== undefined) {
        setDailyGenerationsLimit(payload.dailyGenerationsLimit);
      }
    },
    []
  );

  const refreshAuth = useCallback(
    async (overrideToken?: string | null) => {
      const tokenToUse = overrideToken !== undefined ? overrideToken : authToken;
      try {
        const res = await fetch("/api/auth/me", {
          headers: tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {},
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          authenticated?: boolean;
          account?: AuthAccount | null;
          dailyGenerationsUsed?: number;
          dailyGenerationsLimit?: number | null;
        };
        if (data.authenticated && data.account) {
          setAuthAccount(data.account);
          setDailyGenerationsUsed(data.account.dailyGenerationsUsed);
          setDailyGenerationsLimit(data.account.dailyGenerationsLimit);
        } else {
          setAuthAccount(null);
          if (overrideToken === null) {
            setAuthToken(null);
          }
          setDailyGenerationsUsed(data.dailyGenerationsUsed ?? 0);
          setDailyGenerationsLimit(
            data.dailyGenerationsLimit !== undefined ? data.dailyGenerationsLimit : 3
          );
        }
      } catch {
        // Offline or network transient; retain current state gracefully
      } finally {
        setAuthLoading(false);
      }
    },
    [authToken]
  );

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const loginAccount = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, language: lang }),
        });
        const rawText = await res.text();
        const data = rawText
          ? (JSON.parse(rawText) as {
              error?: string;
              token?: string;
              account?: AuthAccount;
            })
          : {};
        if (!res.ok || !data.token || !data.account) {
          return { ok: false, error: data.error || "Sign in failed." };
        }
        setAuthToken(data.token);
        setAuthAccount(data.account);
        setDailyGenerationsUsed(data.account.dailyGenerationsUsed);
        setDailyGenerationsLimit(data.account.dailyGenerationsLimit);
        showToast(t.membership.signedInToast, "success");
        return { ok: true };
      } catch {
        return {
          ok: false,
          error:
            lang === "ar"
              ? "تعذر الاتصال بالخادم لتسجيل الدخول."
              : "Unable to reach the server to sign in.",
        };
      }
    },
    [lang, showToast, t.membership.signedInToast]
  );

  const registerAccount = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, language: lang }),
        });
        const rawText = await res.text();
        const data = rawText
          ? (JSON.parse(rawText) as {
              error?: string;
              token?: string;
              account?: AuthAccount;
            })
          : {};
        if (!res.ok || !data.token || !data.account) {
          return { ok: false, error: data.error || "Registration failed." };
        }
        setAuthToken(data.token);
        setAuthAccount(data.account);
        setDailyGenerationsUsed(data.account.dailyGenerationsUsed);
        setDailyGenerationsLimit(data.account.dailyGenerationsLimit);
        showToast(t.membership.registeredToast, "success");
        return { ok: true };
      } catch {
        return {
          ok: false,
          error:
            lang === "ar"
              ? "تعذر الاتصال بالخادم لإنشاء الحساب."
              : "Unable to reach the server to create account.",
        };
      }
    },
    [lang, showToast, t.membership.registeredToast]
  );

  const logoutAccount = useCallback(() => {
    setAuthToken(null);
    setAuthAccount(null);
    void refreshAuth(null);
    showToast(t.membership.signedOutToast, "info");
  }, [refreshAuth, showToast, t.membership.signedOutToast]);

  const setGeneratedIdeas = useCallback((ideas: IdeaBlueprint[]) => {
    setState((prev) => ({ ...prev, generatedIdeas: ideas }));
  }, []);

  const isIdeaSaved = useCallback(
    (title: string) => {
      const norm = title.trim().toLowerCase();
      return state.savedIdeas.some((item) => item.title.trim().toLowerCase() === norm);
    },
    [state.savedIdeas]
  );

  const toggleSaveIdea = useCallback(
    (idea: IdeaBlueprint) => {
      const norm = idea.title.trim().toLowerCase();
      const exists = state.savedIdeas.some((item) => item.title.trim().toLowerCase() === norm);
      if (exists) {
        setState((prev) => ({
          ...prev,
          savedIdeas: prev.savedIdeas.filter((item) => item.title.trim().toLowerCase() !== norm),
        }));
        showToast(t.toasts.ideaRemoved, "info");
      } else {
        setState((prev) => ({
          ...prev,
          savedIdeas: [{ ...idea, id: idea.id || makeId("idea") }, ...prev.savedIdeas],
        }));
        showToast(t.toasts.ideaSaved, "success");
      }
    },
    [state.savedIdeas, showToast, t.toasts.ideaRemoved, t.toasts.ideaSaved]
  );

  const removeSavedIdea = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        savedIdeas: prev.savedIdeas.filter((item) => item.id !== id),
      }));
      showToast(t.toasts.ideaRemoved, "info");
    },
    [showToast, t.toasts.ideaRemoved]
  );

  const discoverToIdeaBlueprint = useCallback(
    (disc: DiscoverProject): IdeaBlueprint => {
      const isAr = lang === "ar";
      return {
        id: `disc-blueprint-${disc.id}`,
        title: isAr ? disc.titleAr : disc.titleEn,
        tagline: isAr ? disc.taglineAr : disc.taglineEn,
        summary: isAr ? disc.summaryAr : disc.summaryEn,
        category: t.discover.categories[disc.categoryKey],
        difficulty: isAr ? disc.difficultyAr : disc.difficultyEn,
        estimatedCost: `$${disc.estimatedCostUsd}`,
        estimatedHours: disc.estimatedHours,
        fitReason: `${t.discover.byAuthor} ${isAr ? disc.authorAr : disc.authorEn}`,
        toolsRequired: isAr ? disc.toolsAr : disc.toolsEn,
        materials: isAr ? disc.materialsAr : disc.materialsEn,
        steps: isAr ? disc.stepsAr : disc.stepsEn,
        createdAt: new Date().toISOString(),
        source: "discover",
        imageUrl: disc.imageUrl,
      };
    },
    [lang, t.discover.byAuthor, t.discover.categories]
  );

  const promoteIdeaToProject = useCallback(
    (idea: IdeaBlueprint): UserProject => {
      const now = new Date().toISOString();
      const targetDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      const newProject: UserProject = {
        id: makeId("proj"),
        title: idea.title,
        tagline: idea.tagline,
        summary: idea.summary,
        category: idea.category,
        status: "planning",
        budgetTarget: parseNumericBudget(idea.estimatedCost),
        budgetSpent: 0,
        targetDate,
        toolsRequired: idea.toolsRequired,
        materials: idea.materials.map((m) => ({
          id: makeId("mat"),
          name: m,
          acquired: false,
        })),
        steps: idea.steps.map((s) => ({
          id: makeId("step"),
          title: s.title,
          description: s.description,
          estimatedHours: Number(s.estimatedHours) || 2,
          deliverable: s.deliverable,
          completed: false,
          notes: "",
        })),
        createdAt: now,
        updatedAt: now,
        imageUrl: idea.imageUrl,
      };

      setState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        activeProjectId: newProject.id,
      }));
      setInspectedIdea(null);
      setCurrentPage("builder");
      showToast(t.toasts.projectStarted, "success");
      return newProject;
    },
    [showToast, t.toasts.projectStarted]
  );

  const createCustomProject = useCallback(
    (input: { title: string; tagline: string; category: string; budgetTarget: number }) => {
      const now = new Date().toISOString();
      const targetDate = new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10);
      const newProject: UserProject = {
        id: makeId("proj"),
        title: input.title.trim(),
        tagline: input.tagline.trim(),
        summary: input.tagline.trim(),
        category: input.category.trim() || "General",
        status: "planning",
        budgetTarget: Math.max(0, Number(input.budgetTarget) || 0),
        budgetSpent: 0,
        targetDate,
        toolsRequired: state.profile.tools.slice(0, 3),
        materials: [],
        steps: [
          {
            id: makeId("step"),
            title: lang === "ar" ? "تحديد المتطلبات والهيكل الأولي" : "Define Scope & Core Sketch",
            description:
              lang === "ar"
                ? "كتابة النتيجة النهائية المطلوبة وتجهيز الأدوات الأساسية."
                : "Outline the core deliverable and gather required tools.",
            estimatedHours: 2,
            deliverable: lang === "ar" ? "ملخص وخطة أولية" : "One-page scope brief",
            completed: false,
            notes: "",
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      setState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        activeProjectId: newProject.id,
      }));
      showToast(t.toasts.projectCreated, "success");
      return newProject;
    },
    [lang, showToast, state.profile.tools, t.toasts.projectCreated]
  );

  const setActiveProjectId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeProjectId: id }));
  }, []);

  const updateProject = useCallback((projectId: string, patch: Partial<UserProject>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const deleteProject = useCallback(
    (projectId: string) => {
      setState((prev) => {
        const remaining = prev.projects.filter((p) => p.id !== projectId);
        const nextActive =
          prev.activeProjectId === projectId ? remaining[0]?.id ?? null : prev.activeProjectId;
        return {
          ...prev,
          projects: remaining,
          activeProjectId: nextActive,
        };
      });
      showToast(t.toasts.projectDeleted, "info");
    },
    [showToast, t.toasts.projectDeleted]
  );

  const toggleStepComplete = useCallback(
    (projectId: string, stepId: string) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projectId) return p;
          const updatedSteps = p.steps.map((s) =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          );
          const completedCount = updatedSteps.filter((s) => s.completed).length;
          let nextStatus = p.status;
          if (updatedSteps.length > 0 && completedCount === updatedSteps.length) {
            nextStatus = "completed";
          } else if (completedCount > 0 && p.status === "planning") {
            nextStatus = "in_progress";
          } else if (completedCount < updatedSteps.length && p.status === "completed") {
            nextStatus = "in_progress";
          }
          return {
            ...p,
            status: nextStatus,
            steps: updatedSteps,
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
      showToast(t.toasts.stepCompleted, "success");
    },
    [showToast, t.toasts.stepCompleted]
  );

  const addProjectStep = useCallback(
    (projectId: string, step: Omit<ProjectStep, "id" | "completed">) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                steps: [
                  ...p.steps,
                  {
                    ...step,
                    id: makeId("step"),
                    completed: false,
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }));
    },
    []
  );

  const updateProjectStep = useCallback(
    (projectId: string, stepId: string, patch: Partial<ProjectStep>) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                steps: p.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }));
    },
    []
  );

  const deleteProjectStep = useCallback((projectId: string, stepId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              steps: p.steps.filter((s) => s.id !== stepId),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  }, []);

  const moveProjectStep = useCallback(
    (projectId: string, stepId: string, direction: "up" | "down") => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projectId) return p;
          const idx = p.steps.findIndex((s) => s.id === stepId);
          if (idx === -1) return p;
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= p.steps.length) return p;
          const next = [...p.steps];
          const [item] = next.splice(idx, 1);
          next.splice(targetIdx, 0, item);
          return { ...p, steps: next, updatedAt: new Date().toISOString() };
        }),
      }));
    },
    []
  );

  const toggleMaterial = useCallback((projectId: string, materialId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              materials: p.materials.map((m) =>
                m.id === materialId ? { ...m, acquired: !m.acquired } : m
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  }, []);

  const addMaterial = useCallback((projectId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              materials: [
                ...p.materials,
                { id: makeId("mat"), name: trimmed, acquired: false },
              ],
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  }, []);

  const removeMaterial = useCallback((projectId: string, materialId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              materials: p.materials.filter((m) => m.id !== materialId),
              updatedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  }, []);

  const acceptChallenge = useCallback(
    (challengeId: string) => {
      setState((prev) => ({
        ...prev,
        challengeProgress: {
          ...prev.challengeProgress,
          [challengeId]: prev.challengeProgress[challengeId] ?? {
            challengeId,
            status: "accepted",
            reflectionNote: "",
            deliverableLink: "",
            updatedAt: new Date().toISOString(),
          },
        },
      }));
      showToast(t.toasts.challengeAccepted, "info");
    },
    [showToast, t.toasts.challengeAccepted]
  );

  const saveChallengeProgress = useCallback(
    (challengeId: string, patch: Partial<ChallengeProgress>) => {
      setState((prev) => {
        const existing = prev.challengeProgress[challengeId] ?? {
          challengeId,
          status: "accepted" as const,
          reflectionNote: "",
          deliverableLink: "",
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              ...existing,
              ...patch,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      if (patch.status === "completed") {
        showToast(t.toasts.challengeCompleted, "success");
      }
    },
    [showToast, t.toasts.challengeCompleted]
  );

  const addCustomChallenge = useCallback((challenge: DailyChallenge) => {
    setState((prev) => ({
      ...prev,
      customChallenges: [challenge, ...prev.customChallenges],
    }));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      }));
      showToast(t.toasts.profileSaved, "success");
    },
    [showToast, t.toasts.profileSaved]
  );

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const exportWorkspaceJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idea-world-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.toasts.exportedBackup, "success");
  }, [showToast, state, t.toasts.exportedBackup]);

  const importWorkspaceJson = useCallback(
    (jsonText: string): boolean => {
      try {
        const parsed = JSON.parse(jsonText) as WorkspaceState;
        if (!parsed || !parsed.profile || !parsed.settings || !Array.isArray(parsed.projects)) {
          showToast(t.settings.importError, "error");
          return false;
        }
        setState(parsed);
        showToast(t.settings.importSuccess, "success");
        return true;
      } catch {
        showToast(t.settings.importError, "error");
        return false;
      }
    },
    [showToast, t.settings.importError, t.settings.importSuccess]
  );

  const resetWorkspace = useCallback(() => {
    const fresh = getInitialWorkspaceState(state.settings.language);
    setState(fresh);
    showToast(t.toasts.workspaceReset, "info");
  }, [showToast, state.settings.language, t.toasts.workspaceReset]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      state,
      t,
      lang,
      currentPage,
      setCurrentPage,
      inspectedIdea,
      setInspectedIdea,
      toast,
      showToast,
      setGeneratedIdeas,
      isIdeaSaved,
      toggleSaveIdea,
      removeSavedIdea,
      discoverToIdeaBlueprint,
      promoteIdeaToProject,
      createCustomProject,
      setActiveProjectId,
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
      acceptChallenge,
      saveChallengeProgress,
      addCustomChallenge,
      updateProfile,
      updateSettings,
      exportWorkspaceJson,
      importWorkspaceJson,
      resetWorkspace,
      authAccount,
      authPlan,
      authLoading,
      dailyGenerationsUsed,
      dailyGenerationsLimit,
      getAuthHeaders,
      refreshAuth,
      loginAccount,
      registerAccount,
      logoutAccount,
      syncQuotaFromApi,
    }),
    [
      state,
      t,
      lang,
      currentPage,
      inspectedIdea,
      toast,
      showToast,
      setGeneratedIdeas,
      isIdeaSaved,
      toggleSaveIdea,
      removeSavedIdea,
      discoverToIdeaBlueprint,
      promoteIdeaToProject,
      createCustomProject,
      setActiveProjectId,
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
      acceptChallenge,
      saveChallengeProgress,
      addCustomChallenge,
      updateProfile,
      updateSettings,
      exportWorkspaceJson,
      importWorkspaceJson,
      resetWorkspace,
      authAccount,
      authPlan,
      authLoading,
      dailyGenerationsUsed,
      dailyGenerationsLimit,
      getAuthHeaders,
      refreshAuth,
      loginAccount,
      registerAccount,
      logoutAccount,
      syncQuotaFromApi,
    ]
  );

  // Keep reference to DISCOVER_PROJECTS available via import anywhere
  void DISCOVER_PROJECTS;

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return ctx;
}
