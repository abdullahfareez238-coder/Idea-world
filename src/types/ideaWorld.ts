export type Language = "en" | "ar";

export type PageId =
  | "dashboard"
  | "generator"
  | "builder"
  | "challenges"
  | "discover"
  | "profile"
  | "settings"
  | "upgrade"
  | "install";

export type MembershipPlan = "FREE" | "PRO";

export interface AuthAccount {
  id: string;
  email: string;
  name: string;
  plan: MembershipPlan;
  planUpdatedAt: string;
  dailyGenerationsUsed: number;
  dailyGenerationsLimit: number | null;
  createdAt: string;
}

export type CurrencyCode = "USD" | "SAR" | "AED" | "EUR";

export type ProjectStatus = "planning" | "in_progress" | "testing" | "completed";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  completed: boolean;
  notes?: string;
  subtasks?: string[];
  practicalTip?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  acquired: boolean;
}

export interface IdeaBlueprint {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  difficulty: string;
  estimatedCost: string;
  estimatedHours: number;
  fitReason: string;
  toolsRequired: string[];
  materials: string[];
  steps: Omit<ProjectStep, "id" | "completed">[];
  createdAt: string;
  source: "generated" | "discover" | "custom";
  imageUrl?: string;
}

export interface UserProject {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  status: ProjectStatus;
  budgetTarget: number;
  budgetSpent: number;
  targetDate: string;
  toolsRequired: string[];
  materials: MaterialItem[];
  steps: ProjectStep[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface DailyChallenge {
  id: string;
  titleEn: string;
  titleAr: string;
  domain: "design" | "build" | "research" | "launch";
  durationMinutes: number;
  promptEn: string;
  promptAr: string;
  deliverableEn: string;
  deliverableAr: string;
  hintsEn: string[];
  hintsAr: string[];
  isCustom?: boolean;
}

export interface ChallengeProgress {
  challengeId: string;
  status: "accepted" | "completed";
  reflectionNote: string;
  deliverableLink?: string;
  updatedAt: string;
}

export interface DiscoverProject {
  id: string;
  categoryKey: "tech" | "hardware" | "craft" | "sustainability" | "media";
  imageUrl: string;
  estimatedCostUsd: number;
  estimatedHours: number;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  summaryEn: string;
  summaryAr: string;
  authorEn: string;
  authorAr: string;
  difficultyEn: string;
  difficultyAr: string;
  toolsEn: string[];
  toolsAr: string[];
  materialsEn: string[];
  materialsAr: string[];
  stepsEn: Omit<ProjectStep, "id" | "completed">[];
  stepsAr: Omit<ProjectStep, "id" | "completed">[];
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  location: string;
  avatarUrl: string;
  tools: string[];
  skills: string[];
  weeklyHours: number;
}

export interface AppSettings {
  language: Language;
  currency: CurrencyCode;
  defaultBudget: string;
  defaultTimeframe: string;
  reducedMotion: boolean;
  highContrastBorders: boolean;
  dailyReminder: boolean;
}

export interface GeneratorInput {
  tools: string[];
  skills: string[];
  budget: string;
  hoursPerWeek: number;
  timeframe: string;
  category: string;
  focusNote: string;
}

export interface WorkspaceState {
  profile: UserProfile;
  settings: AppSettings;
  savedIdeas: IdeaBlueprint[];
  generatedIdeas: IdeaBlueprint[];
  projects: UserProject[];
  activeProjectId: string | null;
  challengeProgress: Record<string, ChallengeProgress>;
  customChallenges: DailyChallenge[];
}
