import type { Language, PageId, ProjectStatus } from "../types/ideaWorld";

export interface TranslationBundle {
  brand: string;
  nav: Record<PageId, string>;
  topBar: {
    newIdea: string;
    openMenu: string;
    closeMenu: string;
    switchLang: string;
  };
  dashboard: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    primaryCta: string;
    secondaryCta: string;
    kpis: {
      activeProjects: string;
      savedIdeas: string;
      stepsCompleted: string;
      challengeStreak: string;
    };
    activeFeedTitle: string;
    activeFeedSubtitle: string;
    viewAllProjects: string;
    openInBuilder: string;
    nextStep: string;
    noProjectsTitle: string;
    noProjectsBody: string;
    createFirstProject: string;
    todayChallengeTitle: string;
    goToChallenges: string;
    savedLibraryTitle: string;
    viewAllSaved: string;
    noSavedBody: string;
  };
  generator: {
    title: string;
    subtitle: string;
    toolsLabel: string;
    toolsPlaceholder: string;
    addTool: string;
    skillsLabel: string;
    skillsPlaceholder: string;
    addSkill: string;
    budgetLabel: string;
    timeLabel: string;
    hoursPerWeek: string;
    timeframeLabel: string;
    categoryLabel: string;
    focusLabel: string;
    focusPlaceholder: string;
    generateBtn: string;
    generatingBtn: string;
    loadDefaults: string;
    resultsTitle: string;
    resultsEmptyTitle: string;
    resultsEmptyBody: string;
    fitLabel: string;
    toolsNeeded: string;
    materialsNeeded: string;
    stepPlan: string;
    saveIdea: string;
    savedIdea: string;
    startProject: string;
    inspectPlan: string;
    hoursUnit: string;
    retry: string;
  };
  builder: {
    title: string;
    subtitle: string;
    newProjectBtn: string;
    projectListTitle: string;
    emptyTitle: string;
    emptyBody: string;
    statusLabel: string;
    statuses: Record<ProjectStatus, string>;
    completionLabel: string;
    budgetLabel: string;
    spentLabel: string;
    targetLabel: string;
    deadlineLabel: string;
    exportMarkdown: string;
    deleteProject: string;
    confirmDeleteTitle: string;
    confirmDeleteBody: string;
    confirmDeleteBtn: string;
    cancel: string;
    stepsTitle: string;
    addStepTitle: string;
    stepTitlePlaceholder: string;
    stepDescPlaceholder: string;
    stepDeliverablePlaceholder: string;
    stepHoursPlaceholder: string;
    addStepBtn: string;
    expandStepBtn: string;
    expandingStepBtn: string;
    subtasksTitle: string;
    tipLabel: string;
    notesPlaceholder: string;
    materialsTitle: string;
    addMaterialPlaceholder: string;
    addMaterialBtn: string;
    createModalTitle: string;
    projectTitleLabel: string;
    projectTaglineLabel: string;
    projectCategoryLabel: string;
    projectBudgetLabel: string;
    createProjectSubmit: string;
    moveUp: string;
    moveDown: string;
    removeStep: string;
  };
  challenges: {
    title: string;
    subtitle: string;
    generateChallengeBtn: string;
    generatingChallengeBtn: string;
    filterAll: string;
    domains: Record<"design" | "build" | "research" | "launch", string>;
    featuredLabel: string;
    minutesUnit: string;
    acceptBtn: string;
    acceptedStatus: string;
    completedStatus: string;
    reflectionLabel: string;
    reflectionPlaceholder: string;
    linkLabel: string;
    linkPlaceholder: string;
    completeBtn: string;
    updateNoteBtn: string;
    hintsTitle: string;
    deliverableLabel: string;
    completedCountLabel: string;
  };
  discover: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: Record<"all" | "tech" | "hardware" | "craft" | "sustainability" | "media", string>;
    byAuthor: string;
    viewBlueprint: string;
    cloneToBuilder: string;
    saveFavorite: string;
    savedFavorite: string;
    emptySearch: string;
    resetFilters: string;
  };
  profile: {
    title: string;
    subtitle: string;
    editProfile: string;
    saveProfile: string;
    cancelEdit: string;
    nameLabel: string;
    roleLabel: string;
    locationLabel: string;
    bioLabel: string;
    weeklyHoursLabel: string;
    myTools: string;
    mySkills: string;
    stats: {
      totalProjects: string;
      completedProjects: string;
      savedIdeas: string;
      challengesDone: string;
    };
    tabSaved: string;
    tabChallenges: string;
    tabProjects: string;
    removeFavorite: string;
    noSavedYet: string;
    noChallengesYet: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appearanceSection: string;
    languageLabel: string;
    languageDesc: string;
    englishOption: string;
    arabicOption: string;
    reducedMotionLabel: string;
    reducedMotionDesc: string;
    highContrastLabel: string;
    highContrastDesc: string;
    workspaceSection: string;
    currencyLabel: string;
    defaultBudgetLabel: string;
    defaultTimeframeLabel: string;
    dailyReminderLabel: string;
    dailyReminderDesc: string;
    dataSection: string;
    exportJson: string;
    importJson: string;
    resetWorkspace: string;
    resetConfirmTitle: string;
    resetConfirmBody: string;
    resetConfirmBtn: string;
    importSuccess: string;
    importError: string;
  };
  modal: {
    close: string;
    overview: string;
    fitReason: string;
    toolsRequired: string;
    materialsList: string;
    executionPlan: string;
    deliverable: string;
    estimatedHours: string;
  };
  toasts: {
    ideaSaved: string;
    ideaRemoved: string;
    projectStarted: string;
    projectCreated: string;
    projectDeleted: string;
    stepCompleted: string;
    challengeAccepted: string;
    challengeCompleted: string;
    profileSaved: string;
    exportedMarkdown: string;
    exportedBackup: string;
    workspaceReset: string;
  };
  pwa: {
    installButton: string;
    installSuccessToast: string;
    offlineBanner: string;
    pageTitle: string;
    pageSubtitle: string;
    statusInstalled: string;
    statusReady: string;
    statusBrowser: string;
    installNowBtn: string;
    swActiveLabel: string;
    swPendingLabel: string;
    standaloneModeLabel: string;
    browserModeLabel: string;
    platformAndroidTitle: string;
    platformAndroidSubtitle: string;
    platformAndroidSteps: string[];
    platformWindowsTitle: string;
    platformWindowsSubtitle: string;
    platformWindowsSteps: string[];
    platformIOSTitle: string;
    platformIOSSubtitle: string;
    platformIOSSteps: string[];
    iosNote: string;
  };
  membership: {
    freePlanName: string;
    proPlanName: string;
    activePlanLabel: string;
    currentQuotaLabel: string;
    unlimitedLabel: string;
    remainingTodayLabel: string;
    deepModeLabel: string;
    deepModeDesc: string;
    deepModeProHint: string;
    proRequiredAction: string;
    upgradeCta: string;
    accountCardTitle: string;
    accountCardSubtitle: string;
    guestModeNotice: string;
    signInTab: string;
    registerTab: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInBtn: string;
    registerBtn: string;
    signOutBtn: string;
    signedInAs: string;
    freeAutoAssignNote: string;
    upgradePageTitle: string;
    upgradePageSubtitle: string;
    planComparisonTitle: string;
    featureCol: string;
    freeCol: string;
    proCol: string;
    freeSummary: string;
    proSummary: string;
    features: {
      dailyIdeas: string;
      freeDailyVal: string;
      proDailyVal: string;
      blueprintDepth: string;
      freeDepthVal: string;
      proDepthVal: string;
      projectBuilder: string;
      freeBuilderVal: string;
      proBuilderVal: string;
      aiBreakdown: string;
      freeBreakdownVal: string;
      proBreakdownVal: string;
      dailyChallenges: string;
      freeChallengesVal: string;
      proChallengesVal: string;
      pwaOffline: string;
      freePwaVal: string;
      proPwaVal: string;
    };
    checkoutTitle: string;
    checkoutSubtitle: string;
    checkoutSignInFirst: string;
    checkoutGoToProfile: string;
    checkoutBtn: string;
    checkoutCheckingBtn: string;
    checkoutAlreadyPro: string;
    checkoutNotConfiguredTitle: string;
    checkoutProvidersLabel: string;
    checkoutSecurityNote: string;
    signedInToast: string;
    registeredToast: string;
    signedOutToast: string;
  };
}

export const translations: Record<Language, TranslationBundle> = {
  en: {
    brand: "IDEA WORLD",
    nav: {
      dashboard: "Home Dashboard",
      generator: "Idea Generator",
      builder: "Project Builder",
      challenges: "Daily Challenges",
      discover: "Discover Projects",
      profile: "User Profile",
      upgrade: "Upgrade to PRO",
      install: "Install App",
      settings: "Settings",
    },
    topBar: {
      newIdea: "Generate Idea",
      openMenu: "Open navigation",
      closeMenu: "Close navigation",
      switchLang: "العربية",
    },
    dashboard: {
      heroEyebrow: "Creative Build Studio",
      heroTitle: "Turn raw ideas into real, finished projects.",
      heroSubtitle:
        "Combine your available tools, skills, budget, and free hours to generate focused project blueprints and track every step from sketch to launch.",
      primaryCta: "Launch Idea Generator",
      secondaryCta: "Open Project Builder",
      kpis: {
        activeProjects: "Active Projects",
        savedIdeas: "Saved Ideas",
        stepsCompleted: "Steps Completed",
        challengeStreak: "Challenges Done",
      },
      activeFeedTitle: "Active Project Tracker",
      activeFeedSubtitle: "Check off your next step or open the full workspace.",
      viewAllProjects: "All Projects",
      openInBuilder: "Open in Builder",
      nextStep: "Next step",
      noProjectsTitle: "No active projects yet",
      noProjectsBody:
        "Generate an idea tailored to your tools or clone a blueprint from Discover to start building.",
      createFirstProject: "Generate First Idea",
      todayChallengeTitle: "Today's Creative Sprint",
      goToChallenges: "All Challenges",
      savedLibraryTitle: "Saved Favorite Ideas",
      viewAllSaved: "Manage in Profile",
      noSavedBody: "Bookmark ideas from the Generator or Discover gallery to keep them here.",
    },
    generator: {
      title: "Idea Generator",
      subtitle:
        "Enter your real-world tools, budget, skills, and available time to generate realistic, step-by-step project ideas.",
      toolsLabel: "Available Tools & Equipment",
      toolsPlaceholder: "Add custom tool (e.g. Soldering Iron, iPad)...",
      addTool: "Add",
      skillsLabel: "Your Skills & Strengths",
      skillsPlaceholder: "Add custom skill (e.g. Illustration, Python)...",
      addSkill: "Add",
      budgetLabel: "Available Budget",
      timeLabel: "Free Time Commitment",
      hoursPerWeek: "Hours per week",
      timeframeLabel: "Target Timeframe",
      categoryLabel: "Focus Domain",
      focusLabel: "Optional Theme or Problem to Solve",
      focusPlaceholder: "e.g., Organize my desk cables, teach kids Arabic letters, sustainable balcony herbs...",
      generateBtn: "Generate Project Ideas",
      generatingBtn: "Crafting Tailored Ideas...",
      loadDefaults: "Load Profile Defaults",
      resultsTitle: "Tailored Project Blueprints",
      resultsEmptyTitle: "Configure your constraints to generate ideas",
      resultsEmptyBody:
        "Select at least one tool or skill and click Generate Project Ideas to receive three detailed, actionable plans.",
      fitLabel: "Why it fits your constraints",
      toolsNeeded: "Tools",
      materialsNeeded: "Materials & Stack",
      stepPlan: "Execution Plan",
      saveIdea: "Save Favorite",
      savedIdea: "Saved",
      startProject: "Build This Project",
      inspectPlan: "View Full Plan",
      hoursUnit: "hrs",
      retry: "Try Again",
    },
    builder: {
      title: "Project Builder",
      subtitle: "Manage milestones, check off step-by-step deliverables, and track materials and budget.",
      newProjectBtn: "New Custom Project",
      projectListTitle: "Your Projects",
      emptyTitle: "Start your first project",
      emptyBody: "Create a custom project or promote any saved idea into an interactive build plan.",
      statusLabel: "Stage",
      statuses: {
        planning: "Planning",
        in_progress: "In Progress",
        testing: "Testing",
        completed: "Completed",
      },
      completionLabel: "Progress",
      budgetLabel: "Budget Tracker",
      spentLabel: "Spent",
      targetLabel: "Target",
      deadlineLabel: "Target Date",
      exportMarkdown: "Export Brief (.md)",
      deleteProject: "Delete",
      confirmDeleteTitle: "Delete this project?",
      confirmDeleteBody: "All steps, notes, and progress for this project will be permanently removed.",
      confirmDeleteBtn: "Delete Project",
      cancel: "Cancel",
      stepsTitle: "Step-by-Step Execution Plan",
      addStepTitle: "Add Execution Step",
      stepTitlePlaceholder: "Step title (e.g., Build clickable wireframe)",
      stepDescPlaceholder: "What needs to be done in this step?",
      stepDeliverablePlaceholder: "Concrete deliverable (e.g., 3 Figma screens)",
      stepHoursPlaceholder: "Hours",
      addStepBtn: "Add Step",
      expandStepBtn: "Break Down Step",
      expandingStepBtn: "Breaking down...",
      subtasksTitle: "Action Sub-tasks",
      tipLabel: "Practical Tip",
      notesPlaceholder: "Add build notes, measurements, or links...",
      materialsTitle: "Tools & Materials Checklist",
      addMaterialPlaceholder: "Add material or tool...",
      addMaterialBtn: "Add",
      createModalTitle: "Create Custom Project",
      projectTitleLabel: "Project Title",
      projectTaglineLabel: "Short Tagline",
      projectCategoryLabel: "Category",
      projectBudgetLabel: "Budget Target",
      createProjectSubmit: "Create Project",
      moveUp: "Move step up",
      moveDown: "Move step down",
      removeStep: "Remove step",
    },
    challenges: {
      title: "Daily Challenges",
      subtitle: "Build creative momentum with focused 30–90 minute maker sprints.",
      generateChallengeBtn: "Generate Custom Challenge",
      generatingChallengeBtn: "Generating...",
      filterAll: "All Domains",
      domains: {
        design: "Design",
        build: "Build",
        research: "Research",
        launch: "Launch",
      },
      featuredLabel: "Featured Today",
      minutesUnit: "min",
      acceptBtn: "Accept Challenge",
      acceptedStatus: "In Progress",
      completedStatus: "Completed",
      reflectionLabel: "Your Solution & Notes",
      reflectionPlaceholder: "Document what you built, sketched, or learned during this sprint...",
      linkLabel: "Output Link (optional)",
      linkPlaceholder: "https://...",
      completeBtn: "Mark Completed",
      updateNoteBtn: "Save Notes",
      hintsTitle: "Starter Hints",
      deliverableLabel: "Expected Deliverable",
      completedCountLabel: "Completed",
    },
    discover: {
      title: "Discover Projects",
      subtitle: "Explore curated real-world blueprints with complete material lists and step-by-step plans.",
      searchPlaceholder: "Search projects, tools, or materials...",
      categories: {
        all: "All Projects",
        tech: "Tech & Apps",
        hardware: "Hardware",
        craft: "Craft & Design",
        sustainability: "Sustainability",
        media: "Media & Publishing",
      },
      byAuthor: "Blueprint by",
      viewBlueprint: "Inspect Blueprint",
      cloneToBuilder: "Start in Builder",
      saveFavorite: "Save",
      savedFavorite: "Saved",
      emptySearch: "No curated blueprints match your filter.",
      resetFilters: "Reset Filters",
    },
    profile: {
      title: "User Profile",
      subtitle: "Your maker identity, saved ideas library, and completed challenge archive.",
      editProfile: "Edit Profile",
      saveProfile: "Save Changes",
      cancelEdit: "Cancel",
      nameLabel: "Display Name",
      roleLabel: "Creative Focus / Role",
      locationLabel: "Location",
      bioLabel: "Bio",
      weeklyHoursLabel: "Weekly Build Hours",
      myTools: "Default Toolkit",
      mySkills: "Core Skills",
      stats: {
        totalProjects: "Total Projects",
        completedProjects: "Completed Builds",
        savedIdeas: "Saved Ideas",
        challengesDone: "Challenges Done",
      },
      tabSaved: "Saved Ideas",
      tabProjects: "My Projects",
      tabChallenges: "Challenge Log",
      removeFavorite: "Remove",
      noSavedYet: "You haven't saved any ideas yet. Explore Idea Generator or Discover to bookmark blueprints.",
      noChallengesYet: "Accept and complete a Daily Challenge to build your creative log.",
    },
    settings: {
      title: "Settings",
      subtitle: "Configure bilingual display, default generator constraints, and local workspace backups.",
      appearanceSection: "Language & Motion",
      languageLabel: "Interface Language",
      languageDesc: "Switch seamlessly between English (LTR) and Arabic (RTL).",
      englishOption: "English (LTR)",
      arabicOption: "العربية (RTL)",
      reducedMotionLabel: "Reduced Motion",
      reducedMotionDesc: "Minimize decorative transitions for faster, distraction-free navigation.",
      highContrastLabel: "High-Contrast Borders",
      highContrastDesc: "Strengthen hairline container borders across dark navy surfaces.",
      workspaceSection: "Generator Defaults",
      currencyLabel: "Display Currency",
      defaultBudgetLabel: "Default Budget Preset",
      defaultTimeframeLabel: "Default Timeframe",
      dailyReminderLabel: "Daily Challenge Banner",
      dailyReminderDesc: "Highlight today's uncompleted sprint on the Home Dashboard.",
      dataSection: "Workspace Data & Backup",
      exportJson: "Export JSON Backup",
      importJson: "Import JSON Backup",
      resetWorkspace: "Reset Workspace",
      resetConfirmTitle: "Reset all workspace data?",
      resetConfirmBody:
        "This restores the initial sample project and clears your saved ideas, custom projects, and challenge history.",
      resetConfirmBtn: "Confirm Reset",
      importSuccess: "Workspace backup imported successfully.",
      importError: "Invalid backup file. Please choose a valid IDEA WORLD JSON export.",
    },
    modal: {
      close: "Close",
      overview: "Project Overview",
      fitReason: "Constraint Match",
      toolsRequired: "Required Tools",
      materialsList: "Materials & Components",
      executionPlan: "Step-by-Step Plan",
      deliverable: "Deliverable",
      estimatedHours: "Est. Time",
    },
    toasts: {
      ideaSaved: "Idea saved to your favorites.",
      ideaRemoved: "Idea removed from favorites.",
      projectStarted: "Project added to your Project Builder.",
      projectCreated: "New custom project created.",
      projectDeleted: "Project deleted.",
      stepCompleted: "Milestone progress updated.",
      challengeAccepted: "Challenge accepted! Document your outcome when ready.",
      challengeCompleted: "Challenge marked as completed.",
      profileSaved: "Profile updated.",
      exportedMarkdown: "Project brief downloaded as Markdown.",
      exportedBackup: "Workspace backup downloaded.",
      workspaceReset: "Workspace restored to initial defaults.",
    },
    pwa: {
      installButton: "Install App",
      installSuccessToast: "IDEA WORLD is ready on your device.",
      offlineBanner: "Offline mode — saved projects and workspace remain accessible.",
      pageTitle: "Install IDEA WORLD App",
      pageSubtitle:
        "Install IDEA WORLD as a standalone Progressive Web App on Android, Windows, or iOS for instant full-screen access without browser chrome.",
      statusInstalled: "Running in Standalone App Mode",
      statusReady: "Ready for One-Click Installation",
      statusBrowser: "Browser Manual Installation Available",
      installNowBtn: "Install IDEA WORLD Now",
      swActiveLabel: "Offline Service Worker Active",
      swPendingLabel: "Service Worker Initializing",
      standaloneModeLabel: "Display Mode: Standalone",
      browserModeLabel: "Display Mode: Browser Tab",
      platformAndroidTitle: "Android (Chrome / Edge)",
      platformAndroidSubtitle: "Native WebAPK Home Screen Install",
      platformAndroidSteps: [
        "Tap Install IDEA WORLD Now above when available, or open Chrome's top-right menu (⋮).",
        "Select Install app or Add to Home screen.",
        "Confirm installation — IDEA WORLD will open full-screen like a native app.",
      ],
      platformWindowsTitle: "Windows (Edge / Chrome)",
      platformWindowsSubtitle: "Desktop App Window & Taskbar Pinning",
      platformWindowsSteps: [
        "Click Install IDEA WORLD Now above or click the install icon in the browser address bar.",
        "Confirm Install in the prompt dialog.",
        "Launch IDEA WORLD anytime from your Start Menu or pinned Taskbar.",
      ],
      platformIOSTitle: "iPhone & iPad (Safari)",
      platformIOSSubtitle: "Add to Home Screen in Standalone Mode",
      platformIOSSteps: [
        "Open IDEA WORLD inside Apple Safari on iOS or iPadOS.",
        "Tap the Share button at the bottom (iPhone) or top toolbar (iPad).",
        "Scroll down and tap Add to Home Screen, then tap Add in the top corner.",
      ],
      iosNote: "On iOS, Add to Home Screen must be triggered manually from Safari's Share menu.",
    },
    membership: {
      freePlanName: "FREE",
      proPlanName: "PRO",
      activePlanLabel: "Membership Status",
      currentQuotaLabel: "Daily Idea Quota",
      unlimitedLabel: "Unlimited",
      remainingTodayLabel: "generations left today",
      deepModeLabel: "Deep Blueprint Mode (7 Steps + Risk Plan)",
      deepModeDesc:
        "Expands every generated blueprint with deeper execution milestones, risk mitigation, and launch checks.",
      deepModeProHint: "PRO plan required — verified securely on the server.",
      proRequiredAction: "This capability is restricted to PRO accounts.",
      upgradeCta: "Upgrade to PRO",
      accountCardTitle: "Account & Membership Plan",
      accountCardSubtitle:
        "Every new account starts on the FREE plan. Membership status is stored and enforced securely on the backend.",
      guestModeNotice:
        "Browsing as guest (FREE tier limits). Sign in or create a FREE account to link your membership status.",
      signInTab: "Sign In",
      registerTab: "Create FREE Account",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      signInBtn: "Sign In",
      registerBtn: "Create FREE Account",
      signOutBtn: "Sign Out",
      signedInAs: "Signed in as",
      freeAutoAssignNote: "New accounts are automatically initialized on the FREE plan.",
      upgradePageTitle: "FREE & PRO Membership Plans",
      upgradePageSubtitle:
        "Compare capabilities across FREE and PRO tiers. Your active membership is verified on every request by the backend.",
      planComparisonTitle: "Plan Comparison",
      featureCol: "Capability",
      freeCol: "FREE Plan",
      proCol: "PRO Plan",
      freeSummary: "Complete core creative workspace to generate ideas, build projects, and track challenges.",
      proSummary: "Unlimited AI ideation capacity, 7-step Deep Blueprints, step breakdowns, and custom sprints.",
      features: {
        dailyIdeas: "Daily Idea Generations",
        freeDailyVal: "3 runs / day",
        proDailyVal: "Unlimited",
        blueprintDepth: "Blueprint Roadmap Depth",
        freeDepthVal: "5-step plan",
        proDepthVal: "7-step Deep Blueprint Mode",
        projectBuilder: "Project Builder & Markdown Export",
        freeBuilderVal: "Included (full tracker)",
        proBuilderVal: "Included (full tracker)",
        aiBreakdown: "AI Step Sub-task Breakdown",
        freeBreakdownVal: "PRO only",
        proBreakdownVal: "Included",
        dailyChallenges: "Daily Challenges",
        freeChallengesVal: "Curated sprint library",
        proChallengesVal: "+ Custom AI challenge generator",
        pwaOffline: "Installable Standalone PWA",
        freePwaVal: "Included",
        proPwaVal: "Included",
      },
      checkoutTitle: "Upgrade & Checkout Readiness",
      checkoutSubtitle:
        "Hosted payment checkout keeps card processing completely outside IDEA WORLD.",
      checkoutSignInFirst: "Sign in or create a FREE account first to initiate a PRO checkout session.",
      checkoutGoToProfile: "Go to Profile Account Setup",
      checkoutBtn: "Continue to Hosted Checkout",
      checkoutCheckingBtn: "Checking Payment Provider...",
      checkoutAlreadyPro: "Your account is already active on the PRO plan.",
      checkoutNotConfiguredTitle: "Payment Provider Integration Ready",
      checkoutProvidersLabel: "Supported hosted providers",
      checkoutSecurityNote:
        "IDEA WORLD never collects card numbers directly and verifies upgrades solely via signed server webhooks.",
      signedInToast: "Signed in successfully.",
      registeredToast: "Account created on the FREE plan.",
      signedOutToast: "Signed out.",
    },
  },
  ar: {
    brand: "عالم الأفكار",
    nav: {
      dashboard: "لوحة التحكم",
      generator: "مولّد الأفكار",
      builder: "بناء المشاريع",
      challenges: "التحديات اليومية",
      discover: "اكتشف المشاريع",
      profile: "الملف الشخصي",
      upgrade: "الترقية إلى PRO",
      install: "تثبيت التطبيق",
      settings: "الإعدادات",
    },
    topBar: {
      newIdea: "توليد فكرة",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      switchLang: "English",
    },
    dashboard: {
      heroEyebrow: "استوديو بناء المشاريع الإبداعية",
      heroTitle: "حوّل أفكارك الخام إلى مشاريع حقيقية مكتملة.",
      heroSubtitle:
        "أدخل أدواتك المتاحة، وميزانيتك، ومهاراتك، ووقت فراغك لتوليد خطط مشاريع عملية ومتابعة تنفيذها خطوة بخطوة حتى الإطلاق.",
      primaryCta: "تشغيل مولّد الأفكار",
      secondaryCta: "فتح بناء المشاريع",
      kpis: {
        activeProjects: "المشاريع النشطة",
        savedIdeas: "الأفكار المحفوظة",
        stepsCompleted: "الخطوات المنجزة",
        challengeStreak: "التحديات المكتملة",
      },
      activeFeedTitle: "متابعة المشاريع النشطة",
      activeFeedSubtitle: "أنجز الخطوة التالية مباشرة أو انتقل إلى مساحة العمل الكاملة.",
      viewAllProjects: "كل المشاريع",
      openInBuilder: "فتح في البناء",
      nextStep: "الخطوة التالية",
      noProjectsTitle: "لا توجد مشاريع نشطة بعد",
      noProjectsBody:
        "ولّد فكرة تناسب أدواتك أو انسخ مخطط مشروع من صفحة الاستكشاف للبدء فوراً.",
      createFirstProject: "توليد أول فكرة",
      todayChallengeTitle: "تحدي اليوم الإبداعي",
      goToChallenges: "كل التحديات",
      savedLibraryTitle: "الأفكار المفضلة المحفوظة",
      viewAllSaved: "إدارة في الملف الشخصي",
      noSavedBody: "احفظ الأفكار التي تعجبك من المولّد أو صفحة الاستكشاف لتجدها هنا.",
    },
    generator: {
      title: "مولّد الأفكار",
      subtitle:
        "أدخل أدواتك المتوفرة، وميزانيتك، ومهاراتك، ووقتك الأسبوعي للحصول على أفكار مشاريع واقعية مع خطة عمل مفصلة.",
      toolsLabel: "الأدوات والمعدات المتاحة",
      toolsPlaceholder: "أضف أداة مخصصة (مثل: كاوية لحام، آيباد)...",
      addTool: "إضافة",
      skillsLabel: "مهاراتك ونقاط قوتك",
      skillsPlaceholder: "أضف مهارة مخصصة (مثل: الرسم الرقمي، بايثون)...",
      addSkill: "إضافة",
      budgetLabel: "الميزانية المتاحة",
      timeLabel: "الوقت المتاح للتنفيذ",
      hoursPerWeek: "ساعات أسبوعياً",
      timeframeLabel: "المدة المستهدفة",
      categoryLabel: "المجال المفضل",
      focusLabel: "موضوع أو مشكلة ترغب بالتركيز عليها (اختياري)",
      focusPlaceholder: "مثال: تنظيم أسلاك المكتب، تطبيق لتعليم الأطفال، زراعة ذكية في الشرفة...",
      generateBtn: "توليد أفكار المشاريع",
      generatingBtn: "جاري ابتكار الأفكار...",
      loadDefaults: "تحميل إعدادات ملفي",
      resultsTitle: "مخططات المشاريع المقترحة",
      resultsEmptyTitle: "حدّد إمكانياتك لتوليد أفكار مناسبة",
      resultsEmptyBody:
        "اختر أداة أو مهارة واحدة على الأقل ثم اضغط على توليد أفكار المشاريع للحصول على 3 خطط عملية متكاملة.",
      fitLabel: "لماذا تناسب إمكانياتك",
      toolsNeeded: "الأدوات",
      materialsNeeded: "المواد والمتطلبات",
      stepPlan: "خطة التنفيذ",
      saveIdea: "حفظ في المفضلة",
      savedIdea: "محفوظة",
      startProject: "ابدأ بناء المشروع",
      inspectPlan: "عرض الخطة كاملة",
      hoursUnit: "ساعة",
      retry: "إعادة المحاولة",
    },
    builder: {
      title: "بناء المشاريع",
      subtitle: "أدر المراحل، وحدّد المخرجات المنجزة خطوة بخطوة، وتابع المواد والميزانية.",
      newProjectBtn: "مشروع جديد مخصص",
      projectListTitle: "مشاريعك",
      emptyTitle: "ابدأ مشروعك الأول",
      emptyBody: "أنشئ مشروعاً مخصصاً أو حوّل أي فكرة محفوظة إلى خطة بناء تفاعلية.",
      statusLabel: "المرحلة",
      statuses: {
        planning: "تخطيط",
        in_progress: "قيد التنفيذ",
        testing: "تجربة ومراجعة",
        completed: "مكتمل",
      },
      completionLabel: "نسبة الإنجاز",
      budgetLabel: "متابعة الميزانية",
      spentLabel: "المصروف",
      targetLabel: "المخصص",
      deadlineLabel: "تاريخ الإنجاز المستهدف",
      exportMarkdown: "تصدير الخطة (.md)",
      deleteProject: "حذف",
      confirmDeleteTitle: "حذف هذا المشروع؟",
      confirmDeleteBody: "سيتم حذف جميع الخطوات والملاحظات وسجل التقدم لهذا المشروع نهائياً.",
      confirmDeleteBtn: "تأكيد الحذف",
      cancel: "إلغاء",
      stepsTitle: "خطة التنفيذ خطوة بخطوة",
      addStepTitle: "إضافة خطوة تنفيذية",
      stepTitlePlaceholder: "عنوان الخطوة (مثل: تصميم النموذج الأولي)",
      stepDescPlaceholder: "ما المطلوب تنفيذه في هذه الخطوة؟",
      stepDeliverablePlaceholder: "المخرج الملموس (مثل: 3 شاشات تفاعلية)",
      stepHoursPlaceholder: "الساعات",
      addStepBtn: "إضافة خطوة",
      expandStepBtn: "تفصيل الخطوة",
      expandingStepBtn: "جاري التفصيل...",
      subtasksTitle: "مهام فرعية مقترحة",
      tipLabel: "نصيحة عملية",
      notesPlaceholder: "أضف ملاحظات التنفيذ أو الروابط أو القياسات...",
      materialsTitle: "قائمة الأدوات والمواد",
      addMaterialPlaceholder: "أضف مادة أو أداة...",
      addMaterialBtn: "إضافة",
      createModalTitle: "إنشاء مشروع مخصص",
      projectTitleLabel: "اسم المشروع",
      projectTaglineLabel: "وصف مختصر",
      projectCategoryLabel: "التصنيف",
      projectBudgetLabel: "الميزانية المستهدفة",
      createProjectSubmit: "إنشاء المشروع",
      moveUp: "تحريك للأعلى",
      moveDown: "تحريك للأسفل",
      removeStep: "حذف الخطوة",
    },
    challenges: {
      title: "التحديات اليومية",
      subtitle: "نمِّ عادتك الإبداعية عبر تحديات عملية مركزة خلال 30 إلى 90 دقيقة.",
      generateChallengeBtn: "توليد تحدٍ مخصص",
      generatingChallengeBtn: "جاري التوليد...",
      filterAll: "كل المجالات",
      domains: {
        design: "تصميم",
        build: "بناء",
        research: "بحث",
        launch: "إطلاق",
      },
      featuredLabel: "تحدي اليوم المميز",
      minutesUnit: "دقيقة",
      acceptBtn: "قبول التحدي",
      acceptedStatus: "قيد التنفيذ",
      completedStatus: "مكتمل",
      reflectionLabel: "ملخص الحل والملاحظات",
      reflectionPlaceholder: "وثّق ما أنجزته أو صممته أو تعلمته خلال هذا التحدي...",
      linkLabel: "رابط النتيجة (اختياري)",
      linkPlaceholder: "https://...",
      completeBtn: "تحديد كمكتمل",
      updateNoteBtn: "حفظ الملاحظات",
      hintsTitle: "تلميحات البداية",
      deliverableLabel: "المخرج المطلوب",
      completedCountLabel: "المكتمل",
    },
    discover: {
      title: "اكتشف المشاريع",
      subtitle: "تصفح مخططات مشاريع ملهمة مع قوائم المواد الكاملة وخطط التنفيذ التفصيلية.",
      searchPlaceholder: "ابحث عن مشروع أو أداة أو مادة...",
      categories: {
        all: "كل المشاريع",
        tech: "تقنية وتطبيقات",
        hardware: "إلكترونيات وعتاد",
        craft: "تصميم وحرف",
        sustainability: "استدامة وبيئة",
        media: "إعلام ونشر",
      },
      byAuthor: "إعداد",
      viewBlueprint: "عرض المخطط",
      cloneToBuilder: "ابدأ في البناء",
      saveFavorite: "حفظ",
      savedFavorite: "محفوظ",
      emptySearch: "لا توجد مشاريع مطابقة لبحثك الحالي.",
      resetFilters: "إعادة ضبط الفلاتر",
    },
    profile: {
      title: "الملف الشخصي",
      subtitle: "هويتك الإبداعية، مكتبة الأفكار المحفوظة، وسجل التحديات المنجزة.",
      editProfile: "تعديل الملف",
      saveProfile: "حفظ التغييرات",
      cancelEdit: "إلغاء",
      nameLabel: "الاسم",
      roleLabel: "التخصص الإبداعي",
      locationLabel: "المدينة / الدولة",
      bioLabel: "نبذة تعريفية",
      weeklyHoursLabel: "ساعات العمل الأسبوعية",
      myTools: "أدواتي الأساسية",
      mySkills: "مهاراتي الرئيسية",
      stats: {
        totalProjects: "إجمالي المشاريع",
        completedProjects: "المشاريع المكتملة",
        savedIdeas: "الأفكار المحفوظة",
        challengesDone: "التحديات المنجزة",
      },
      tabSaved: "الأفكار المحفوظة",
      tabProjects: "مشاريعي",
      tabChallenges: "سجل التحديات",
      removeFavorite: "إزالة",
      noSavedYet: "لم تحفظ أي فكرة بعد. جرّب مولّد الأفكار أو صفحة الاستكشاف لحفظ المخططات.",
      noChallengesYet: "اقبل تحدياً يومياً وأكمله لبناء سجلك الإبداعي.",
    },
    settings: {
      title: "الإعدادات",
      subtitle: "اضبط لغة الواجهة، والقيود الافتراضية للمولّد، والنسخ الاحتياطي لبياناتك.",
      appearanceSection: "اللغة والحركة",
      languageLabel: "لغة الواجهة",
      languageDesc: "التبديل الفوري بين العربية (RTL) والإنجليزية (LTR).",
      englishOption: "English (LTR)",
      arabicOption: "العربية (RTL)",
      reducedMotionLabel: "تقليل الحركة",
      reducedMotionDesc: "تقليل التأثيرات الحركية لتصفح أسرع وأكثر هدوءاً.",
      highContrastLabel: "حدود عالية التباين",
      highContrastDesc: "تعزيز وضوح حدود البطاقات والعناصر على الخلفية الكحلية.",
      workspaceSection: "الإعدادات الافتراضية للمولّد",
      currencyLabel: "عملة العرض",
      defaultBudgetLabel: "الميزانية الافتراضية",
      defaultTimeframeLabel: "المدة الافتراضية",
      dailyReminderLabel: "بطاقة التحدي اليومي",
      dailyReminderDesc: "عرض تحدي اليوم غير المكتمل في لوحة التحكم الرئيسية.",
      dataSection: "إدارة البيانات والنسخ الاحتياطي",
      exportJson: "تصدير نسخة احتياطية (JSON)",
      importJson: "استيراد نسخة احتياطية",
      resetWorkspace: "إعادة ضبط مساحة العمل",
      resetConfirmTitle: "إعادة ضبط جميع البيانات؟",
      resetConfirmBody:
        "سيؤدي هذا إلى استعادة المشروع التجريبي الافتراضي ومسح أفكارك المحفوظة ومشاريعك المخصصة وسجل التحديات.",
      resetConfirmBtn: "تأكيد إعادة الضبط",
      importSuccess: "تم استيراد النسخة الاحتياطية بنجاح.",
      importError: "ملف غير صالح. يرجى اختيار ملف JSON مُصدّر من عالم الأفكار.",
    },
    modal: {
      close: "إغلاق",
      overview: "نظرة عامة",
      fitReason: "ملاءمة الإمكانيات",
      toolsRequired: "الأدوات المطلوبة",
      materialsList: "المواد والمكونات",
      executionPlan: "خطة العمل خطوة بخطوة",
      deliverable: "المخرج",
      estimatedHours: "الوقت المقدر",
    },
    toasts: {
      ideaSaved: "تم حفظ الفكرة في المفضلة.",
      ideaRemoved: "تمت إزالة الفكرة من المفضلة.",
      projectStarted: "تمت إضافة المشروع إلى صفحة بناء المشاريع.",
      projectCreated: "تم إنشاء المشروع المخصص بنجاح.",
      projectDeleted: "تم حذف المشروع.",
      stepCompleted: "تم تحديث تقدم المشروع.",
      challengeAccepted: "تم قبول التحدي! وثّق نتيجتك عند الانتهاء.",
      challengeCompleted: "تم إكمال التحدي بنجاح.",
      profileSaved: "تم تحديث الملف الشخصي.",
      exportedMarkdown: "تم تنزيل خطة المشروع بصيغة Markdown.",
      exportedBackup: "تم تنزيل النسخة الاحتياطية.",
      workspaceReset: "تمت استعادة الإعدادات والبيانات الافتراضية.",
    },
    pwa: {
      installButton: "تثبيت التطبيق",
      installSuccessToast: "أصبح تطبيق عالم الأفكار جاهزاً على جهازك.",
      offlineBanner: "وضع عدم الاتصال — مشاريعك المحفوظة ومساحة العمل متاحة محلياً.",
      pageTitle: "تثبيت تطبيق عالم الأفكار",
      pageSubtitle:
        "ثبّت تطبيق عالم الأفكار كتطبيق ويب تقدمي (PWA) يعمل في وضع مستقل على أندرويد وويندوز وآيفون دون أشرطة المتصفح.",
      statusInstalled: "يعمل الآن في الوضع المستقل كتطبيق مثبّت",
      statusReady: "جاهز للتثبيت المباشر بنقرة واحدة",
      statusBrowser: "التثبيت اليدوي متاح عبر المتصفح",
      installNowBtn: "تثبيت عالم الأفكار الآن",
      swActiveLabel: "خدمة العمل دون اتصال نشطة",
      swPendingLabel: "جاري تهيئة خدمة العمل",
      standaloneModeLabel: "وضع العرض: تطبيق مستقل",
      browserModeLabel: "وضع العرض: نافذة متصفح",
      platformAndroidTitle: "أندرويد (Chrome / Edge)",
      platformAndroidSubtitle: "تثبيت مباشر على الشاشة الرئيسية",
      platformAndroidSteps: [
        "اضغط على زر تثبيت عالم الأفكار أعلاه عند ظهوره، أو افتح قائمة كروم (⋮) أعلى الشاشة.",
        "اختر تثبيت التطبيق (Install app) أو الإضافة إلى الشاشة الرئيسية.",
        "أكّد التثبيت ليفتح عالم الأفكار بملء الشاشة كتطبيق مستقل.",
      ],
      platformWindowsTitle: "ويندوز (Edge / Chrome)",
      platformWindowsSubtitle: "نافذة تطبيق سطح مكتب وتثبيت في شريط المهام",
      platformWindowsSteps: [
        "اضغط على تثبيت عالم الأفكار أعلاه أو أيقونة التثبيت في شريط العنوان بالمتصفح.",
        "أكّد خيار التثبيت (Install) في النافذة المنبثقة.",
        "افتح التطبيق لاحقاً من قائمة ابدأ أو شريط المهام مباشرة.",
      ],
      platformIOSTitle: "آيفون وآيباد (Safari)",
      platformIOSSubtitle: "الإضافة إلى الشاشة الرئيسية بوضع مستقل",
      platformIOSSteps: [
        "افتح عالم الأفكار باستخدام متصفح Safari على iOS أو iPadOS.",
        "اضغط على زر المشاركة (Share) أسفل الشاشة في آيفون أو أعلى الشريط في آيباد.",
        "مرّر للأسفل واختر إضافة إلى الشاشة الرئيسية (Add to Home Screen) ثم اضغط إضافة.",
      ],
      iosNote: "في أجهزة آيفون وآيباد يجب تنفيذ خيار الإضافة إلى الشاشة الرئيسية يدوياً من قائمة المشاركة في Safari.",
    },
    membership: {
      freePlanName: "FREE (مجاني)",
      proPlanName: "PRO (احترافي)",
      activePlanLabel: "حالة العضوية",
      currentQuotaLabel: "الرصيد اليومي للتوليد",
      unlimitedLabel: "غير محدود",
      remainingTodayLabel: "محاولات متبقية اليوم",
      deepModeLabel: "وضع المخطط العميق (7 خطوات + خطة مخاطر)",
      deepModeDesc:
        "يوسّع كل فكرة لتشمل مراحل تنفيذ أعمق وإدارة المخاطر وقوائم تحقق للإطلاق.",
      deepModeProHint: "يتطلب خطة PRO — يتم التحقق من الصلاحية عبر الخادم.",
      proRequiredAction: "هذه الميزة مخصصة لحسابات PRO فقط.",
      upgradeCta: "الترقية إلى PRO",
      accountCardTitle: "الحساب وحالة العضوية",
      accountCardSubtitle:
        "يبدأ كل حساب جديد على الخطة المجانية FREE تلقائياً، وتُحفظ حالة العضوية وتُفحص عبر الخادم.",
      guestModeNotice:
        "تتصفح حالياً كزائر ضمن حدود خطة FREE. سجّل الدخول أو أنشئ حساباً مجانياً لحفظ حالة عضويتك.",
      signInTab: "تسجيل الدخول",
      registerTab: "إنشاء حساب FREE",
      nameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "8 أحرف على الأقل",
      signInBtn: "تسجيل الدخول",
      registerBtn: "إنشاء حساب مجاني",
      signOutBtn: "تسجيل الخروج",
      signedInAs: "مسجل الدخول باسم",
      freeAutoAssignNote: "يتم تعيين الخطة المجانية FREE تلقائياً عند إنشاء أي حساب جديد.",
      upgradePageTitle: "خطط العضوية FREE و PRO",
      upgradePageSubtitle:
        "قارن الفروقات بين الخطة المجانية وخطة PRO. يتحقق الخادم من حالة عضويتك مع كل طلب.",
      planComparisonTitle: "مقارنة الخطط",
      featureCol: "الميزة",
      freeCol: "خطة FREE",
      proCol: "خطة PRO",
      freeSummary: "مساحة العمل الإبداعية الأساسية كاملة لتوليد الأفكار وبناء المشاريع وتتبع التحديات.",
      proSummary: "توليد غير محدود للأفكار، ووضع المخطط العميق من 7 خطوات، وتفصيل المهام، وتحديات مخصصة.",
      features: {
        dailyIdeas: "توليد الأفكار اليومي بالذكاء الاصطناعي",
        freeDailyVal: "3 مرات يومياً",
        proDailyVal: "غير محدود",
        blueprintDepth: "عمق مخطط المشروع",
        freeDepthVal: "خطة من 5 خطوات",
        proDepthVal: "وضع المخطط العميق (7 خطوات)",
        projectBuilder: "بناء المشاريع وتصدير Markdown",
        freeBuilderVal: "متاح بالكامل",
        proBuilderVal: "متاح بالكامل",
        aiBreakdown: "تفصيل الخطوات لمهام فرعية بالذكاء الاصطناعي",
        freeBreakdownVal: "حسابات PRO فقط",
        proBreakdownVal: "متاح",
        dailyChallenges: "التحديات اليومية",
        freeChallengesVal: "مكتبة التحديات اليومية",
        proChallengesVal: "+ مولّد تحديات مخصصة بالذكاء الاصطناعي",
        pwaOffline: "تثبيت التطبيق والعمل دون اتصال (PWA)",
        freePwaVal: "متاح",
        proPwaVal: "متاح",
      },
      checkoutTitle: "الترقية وبوابة الدفع",
      checkoutSubtitle:
        "تتم معالجة المدفوعات عبر بوابة دفع خارجية مستضافة دون جمع أي بيانات بطاقات داخل التطبيق.",
      checkoutSignInFirst: "يرجى تسجيل الدخول أو إنشاء حساب FREE أولاً قبل بدء الترقية إلى PRO.",
      checkoutGoToProfile: "الانتقال إلى إعداد الحساب في الملف الشخصي",
      checkoutBtn: "المتابعة إلى بوابة الدفع المستضافة",
      checkoutCheckingBtn: "جاري التحقق من مزود الدفع...",
      checkoutAlreadyPro: "حسابك مفعّل بالفعل على خطة PRO.",
      checkoutNotConfiguredTitle: "تكامل الدفع جاهز للربط",
      checkoutProvidersLabel: "مزودو الدفع المستضاف المدعومون",
      checkoutSecurityNote:
        "لا يجمع تطبيق عالم الأفكار أرقام البطاقات نهائياً، ويتم تفعيل الترقية حصرياً عبر توقيع الخادم (Webhook) من مزود الدفع.",
      signedInToast: "تم تسجيل الدخول بنجاح.",
      registeredToast: "تم إنشاء الحساب على الخطة المجانية FREE.",
      signedOutToast: "تم تسجيل الخروج.",
    },
  },
};
