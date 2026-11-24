import type {
  CurrencyCode,
  DailyChallenge,
  DiscoverProject,
  Language,
  UserProject,
  WorkspaceState,
} from "../types/ideaWorld";

export const STUDIO_IMAGES = {
  heroStudio: "/src/assets/images/hero_idea_studio_1795459794482.jpg",
  hardwareSynth: "/src/assets/images/project_hardware_synth_1795459795101.jpg",
  botanicalSensor: "/src/assets/images/project_botanical_sensor_1795459795651.jpg",
  editorialZine: "/src/assets/images/project_editorial_zine_1795459796033.jpg",
  creatorAvatar: "/src/assets/images/avatar_creator_portrait_1795459795429.jpg",
} as const;

export const PRESET_TOOLS: { key: string; en: string; ar: string }[] = [
  { key: "laptop", en: "Laptop / PC", ar: "حاسوب محمول" },
  { key: "smartphone", en: "Smartphone Camera", ar: "كاميرا الهاتف" },
  { key: "figma", en: "Figma / Design Suite", ar: "فيجما / برامج التصميم" },
  { key: "vscode", en: "Code Editor", ar: "محرر برمجي" },
  { key: "arduino", en: "Arduino / ESP32", ar: "أردوينو / ESP32" },
  { key: "printer3d", en: "3D Printer", ar: "طابعة ثلاثية الأبعاد" },
  { key: "handtools", en: "Basic Hand Tools", ar: "أدوات يدوية أساسية" },
  { key: "notebook", en: "Sketchbook & Pens", ar: "دفتر رسم وأقلام" },
];

export const PRESET_SKILLS: { key: string; en: string; ar: string }[] = [
  { key: "uiux", en: "UI/UX Design", ar: "تصميم الواجهات" },
  { key: "webdev", en: "Web Development", ar: "تطوير الويب" },
  { key: "electronics", en: "Electronics & IoT", ar: "إلكترونيات وإنترنت الأشياء" },
  { key: "writing", en: "Writing & Storytelling", ar: "الكتابة والسرد" },
  { key: "video", en: "Photography & Video", ar: "التصوير والمونتاج" },
  { key: "craft", en: "Physical Prototyping", ar: "النمذجة اليدوية" },
  { key: "marketing", en: "Marketing & Community", ar: "التسويق وبناء المجتمع" },
  { key: "research", en: "Product Research", ar: "بحث المنتجات" },
];

export const BUDGET_PRESETS: { value: string; en: string; ar: string }[] = [
  { value: "$0", en: "$0 (Zero Cost)", ar: "0$ (بدون تكلفة)" },
  { value: "$25", en: "Up to $25", ar: "حتى 25$" },
  { value: "$75", en: "Up to $75", ar: "حتى 75$" },
  { value: "$200", en: "Up to $200", ar: "حتى 200$" },
  { value: "$500+", en: "$500+ Studio Build", ar: "500$+ مشروع متكامل" },
];

export const TIMEFRAME_PRESETS: { value: string; en: string; ar: string }[] = [
  { value: "Weekend (2 days)", en: "Weekend Sprint (2 days)", ar: "عطلة نهاية أسبوع (يومان)" },
  { value: "2 weeks", en: "2 Weeks", ar: "أسبوعان" },
  { value: "1 month", en: "1 Month", ar: "شهر واحد" },
  { value: "3 months", en: "3 Months", ar: "3 أشهر" },
];

export const CURRENCY_META: Record<CurrencyCode, { symbol: string; rateFromUsd: number }> = {
  USD: { symbol: "$", rateFromUsd: 1 },
  SAR: { symbol: "﷼", rateFromUsd: 3.75 },
  AED: { symbol: "د.إ", rateFromUsd: 3.67 },
  EUR: { symbol: "€", rateFromUsd: 0.92 },
};

export function formatBudgetAmount(usdAmount: number, currency: CurrencyCode): string {
  const meta = CURRENCY_META[currency];
  const converted = Math.round(usdAmount * meta.rateFromUsd);
  return `${meta.symbol}${converted.toLocaleString()}`;
}

export const DISCOVER_PROJECTS: DiscoverProject[] = [
  {
    id: "disc-hardware-dial",
    categoryKey: "hardware",
    imageUrl: STUDIO_IMAGES.hardwareSynth,
    estimatedCostUsd: 48,
    estimatedHours: 16,
    titleEn: "Tactile Focus Dial & Desk Timer",
    titleAr: "قرص التركيز اللمسي ومؤقت المكتب",
    taglineEn: "A rotary desktop controller for Pomodoro sprints and audio levels.",
    taglineAr: "وحدة تحكم مكتبية بقرص دوار لجلسات التركيز وضبط الصوت.",
    summaryEn:
      "Build a physical anodized-look desk companion using an ESP32 microcontroller, rotary encoder, and crisp OLED display to keep deep work sessions distraction-free.",
    summaryAr:
      "اصنع أداة مكتبية ملموسة باستخدام متحكم ESP32 ومشفر دوار وشاشة OLED صغيرة لإدارة جلسات العمل العميق بعيداً عن مشتتات الشاشة.",
    authorEn: "Tariq Al-Mansoor",
    authorAr: "طارق المنصور",
    difficultyEn: "Intermediate",
    difficultyAr: "متوسط",
    toolsEn: ["Laptop / PC", "Arduino / ESP32", "3D Printer", "Soldering Iron"],
    toolsAr: ["حاسوب محمول", "أردوينو / ESP32", "طابعة ثلاثية الأبعاد", "كاوية لحام"],
    materialsEn: ["ESP32-S3 board", "EC11 rotary encoder", "0.96\" OLED screen", "Matte filament & aluminum knob"],
    materialsAr: ["لوحة ESP32-S3", "مفتاح دوار EC11", "شاشة OLED 0.96 بوصة", "خام طباعة مطفي ومقبض معدني"],
    stepsEn: [
      {
        title: "Breadboard Circuit & Pin Mapping",
        description: "Connect the EC11 encoder and I2C OLED display to the ESP32 on a solderless breadboard.",
        estimatedHours: 2,
        deliverable: "Working breadboard wiring diagram",
      },
      {
        title: "Firmware State Machine",
        description: "Write non-blocking timer and rotary acceleration code with focus/break presets.",
        estimatedHours: 4,
        deliverable: "Flashed firmware handling 25/50m timers",
      },
      {
        title: "Slanted Enclosure CAD",
        description: "Model an ergonomic 15-degree angled housing with recessed screen bezel.",
        estimatedHours: 4,
        deliverable: "Printable STL enclosure files",
      },
      {
        title: "Print, Solder & Final Assembly",
        description: "3D print the shell, solder short silicone wires, and mount the weighted base.",
        estimatedHours: 4,
        deliverable: "Assembled desktop unit",
      },
      {
        title: "USB-HID Shortcuts Integration",
        description: "Add optional media play/pause and mute actions when double-clicked.",
        estimatedHours: 2,
        deliverable: "Tested plug-and-play controller",
      },
    ],
    stepsAr: [
      {
        title: "توصيل الدائرة على لوحة التجارب",
        description: "توصيل المفتاح الدوار وشاشة OLED عبر I2C مع لوحة ESP32 واختبار القراءات.",
        estimatedHours: 2,
        deliverable: "دائرة تجريبية عاملة ومخطط توصيل",
      },
      {
        title: "برمجة منطق المؤقت والقرص",
        description: "كتابة شيفرة برمجية سلسة لضبط مدد التركيز والاستراحة دون تعليق.",
        estimatedHours: 4,
        deliverable: "برنامج ثابت يدعم جلسات 25 و50 دقيقة",
      },
      {
        title: "تصميم الهيكل المائل ثلاثي الأبعاد",
        description: "نمذجة غلاف مائل بزاوية 15 درجة لسهولة الرؤية والاستخدام على المكتب.",
        estimatedHours: 4,
        deliverable: "ملفات STL جاهزة للطباعة",
      },
      {
        title: "الطباعة واللحام والتجميع",
        description: "طباعة الهيكل وتثبيت الأسلاك الداخلية وإضافة ثقل في القاعدة للثبات.",
        estimatedHours: 4,
        deliverable: "جهاز مكتبي مكتمل التجميع",
      },
      {
        title: "إضافة اختصارات USB الذكية",
        description: "تفعيل التحكم في الصوت وكتم الميكروفون عند النقر المزدوج على القرص.",
        estimatedHours: 2,
        deliverable: "وحدة تحكم جاهزة للاستخدام اليومي",
      },
    ],
  },
  {
    id: "disc-botanical-monitor",
    categoryKey: "sustainability",
    imageUrl: STUDIO_IMAGES.botanicalSensor,
    estimatedCostUsd: 35,
    estimatedHours: 12,
    titleEn: "Smart Terrarium Microclimate Log",
    titleAr: "مراقب المناخ المصغر للحدائق الزجاجية",
    taglineEn: "Capacitive moisture sensing for healthy indoor glass ecosystems.",
    taglineAr: "استشعار رطوبة التربة والحفاظ على توازن النباتات المنزلية.",
    summaryEn:
      "Pair an architectural glass terrarium with a corrosion-resistant capacitive soil sensor that logs humidity cycles and alerts you only when misting is needed.",
    summaryAr:
      "ادمج حوض نباتات زجاجياً أنيقاً مع حساس رطوبة سعوي مقاوم للتآكل لتتبع دورة الرطوبة وتنبيهك فقط عند الحاجة للري.",
    authorEn: "Lina Haddad",
    authorAr: "لينا حداد",
    difficultyEn: "Beginner",
    difficultyAr: "مبتدئ",
    toolsEn: ["Laptop / PC", "Arduino / ESP32", "Basic Hand Tools"],
    toolsAr: ["حاسوب محمول", "أردوينو / ESP32", "أدوات يدوية أساسية"],
    materialsEn: ["Glass terrarium vessel", "Activated charcoal & moss", "Capacitive moisture probe", "Low-power microcontroller"],
    materialsAr: ["وعاء زجاجي هندسي", "فحم نشط وطحالب", "حساس رطوبة سعوي", "متحكم منخفض الطاقة"],
    stepsEn: [
      {
        title: "Layer Substrate & Drainage",
        description: "Build pebble drainage, charcoal filter layer, and organic soil inside the glass vessel.",
        estimatedHours: 2,
        deliverable: "Prepared terrarium habitat",
      },
      {
        title: "Calibrate Moisture Probe",
        description: "Record dry-air and saturated-soil analog values to map 0–100% moisture.",
        estimatedHours: 2,
        deliverable: "Calibration lookup table",
      },
      {
        title: "Sleep-Mode Telemetry Script",
        description: "Configure deep-sleep wake cycles every 2 hours to maximize battery life.",
        estimatedHours: 4,
        deliverable: "Battery-efficient sensor firmware",
      },
      {
        title: "Local Web Log & Threshold Alert",
        description: "Display a clean 14-day moisture curve and gentle refill reminder.",
        estimatedHours: 4,
        deliverable: "Live habitat log page",
      },
    ],
    stepsAr: [
      {
        title: "تجهيز طبقات التربة والتصريف",
        description: "ترتيب الحصى والفحم النشط والتربة العضوية داخل الحوض الزجاجي ثم زراعة السرخس.",
        estimatedHours: 2,
        deliverable: "بيئة نباتية جاهزة ومتوازنة",
      },
      {
        title: "معايرة حساس الرطوبة",
        description: "قياس القيم في الهواء الجاف والتربة الرطبة لتحويل القراءة إلى نسبة مئوية دقيقة.",
        estimatedHours: 2,
        deliverable: "جدول معايرة دقيق",
      },
      {
        title: "برمجة وضع توفير الطاقة",
        description: "ضبط المتحكم للاستيقاظ كل ساعتين لأخذ القراءة وإطالة عمر البطارية.",
        estimatedHours: 4,
        deliverable: "برمجية استشعار موفرة للطاقة",
      },
      {
        title: "سجل القراءات والتنبيه اللطيف",
        description: "عرض منحنى الرطوبة لمدة 14 يوماً وإرسال تنبيه عند انخفاضها عن الحد المطلوب.",
        estimatedHours: 4,
        deliverable: "لوحة متابعة حيوية للحوض",
      },
    ],
  },
  {
    id: "disc-editorial-zine",
    categoryKey: "craft",
    imageUrl: STUDIO_IMAGES.editorialZine,
    estimatedCostUsd: 22,
    estimatedHours: 14,
    titleEn: "Hand-Bound Local Craft Zine & Field Guide",
    titleAr: "كتيّب يدوي مُجلّد لتوثيق الحرف المحلية",
    taglineEn: "Editorial micro-publication printed on textured cotton stock.",
    taglineAr: "إصدار مطبوع محدود يوثق الحرف والقصص البصرية.",
    summaryEn:
      "Design, photograph, and stitch a 24-page pocket field guide celebrating neighborhood artisans or personal creative experiments using tactile paper and modular grids.",
    summaryAr:
      "صمّم وصوّر وخِط دليلاً ميدانياً من 24 صفحة يوثق الحرفيين المحليين أو تجاربك الإبداعية على ورق فاخر بشبكة تصميم متقنة.",
    authorEn: "Nadia Kareem",
    authorAr: "نادية كريم",
    difficultyEn: "Beginner",
    difficultyAr: "مبتدئ",
    toolsEn: ["Figma / Design Suite", "Smartphone Camera", "Sketchbook & Pens", "Basic Hand Tools"],
    toolsAr: ["فيجما / برامج التصميم", "كاميرا الهاتف", "دفتر رسم وأقلام", "أدوات يدوية أساسية"],
    materialsEn: ["Textured 120gsm paper", "Linen bookbinding thread", "Heavy cover card stock", "Bone folder & awl"],
    materialsAr: ["ورق قطني 120 جم", "خيط كتان للتجليد", "ورق غلاف سميك", "مثقاب ورق ومسطرة طي"],
    stepsEn: [
      {
        title: "Curate 4 Micro-Stories & Photo Essay",
        description: "Interview or document 4 focused subjects with consistent natural-light framing.",
        estimatedHours: 4,
        deliverable: "Edited text + 16 curated photographs",
      },
      {
        title: "Modular Page Grid & Typography",
        description: "Set up A5 spread margins, clean typographic hierarchy, and bilingual captions.",
        estimatedHours: 4,
        deliverable: "Print-ready imposed PDF",
      },
      {
        title: "Test Print & Paper Swatch Check",
        description: "Print a proof copy to verify ink density, margin trim, and readability.",
        estimatedHours: 2,
        deliverable: "Annotated physical proof",
      },
      {
        title: "Pamphlet Stitch Binding",
        description: "Score, punch 5-hole spine stations, and hand-stitch an edition of 15 copies.",
        estimatedHours: 4,
        deliverable: "15 finished hand-bound zines",
      },
    ],
    stepsAr: [
      {
        title: "جمع القصص والصور الميدانية",
        description: "إجراء 4 مقابلات قصيرة وتصوير تفاصيل العمل بإضاءة طبيعية متناسقة.",
        estimatedHours: 4,
        deliverable: "نصوص محررة و16 صورة مختارة",
      },
      {
        title: "تأسيس الشبكة التصميمية والخطوط",
        description: "إعداد هوامش مقاس A5 وتنسيق العناوين والتعليقات بنظام بصري متوازن.",
        estimatedHours: 4,
        deliverable: "ملف PDF جاهز للطباعة",
      },
      {
        title: "طباعة نسخة تجريبية ومراجعتها",
        description: "فحص وضوح النصوص وتباين الصور على الورق المختار قبل الطباعة النهائية.",
        estimatedHours: 2,
        deliverable: "نسخة تجريبية مصححة",
      },
      {
        title: "الطي والتخريم والخياطة اليدوية",
        description: "ثقب الكعب بـ 5 نقاط وخياطة 15 نسخة محدودة بخيط الكتان.",
        estimatedHours: 4,
        deliverable: "15 نسخة مجلّدة يدوياً",
      },
    ],
  },
  {
    id: "disc-offline-study-deck",
    categoryKey: "tech",
    imageUrl: STUDIO_IMAGES.heroStudio,
    estimatedCostUsd: 0,
    estimatedHours: 10,
    titleEn: "Offline Bilingual Micro-Learning Cards",
    titleAr: "منصة بطاقات تعلم ثنائية اللغة دون إنترنت",
    taglineEn: "Zero-cost progressive web tool for spaced-repetition study.",
    taglineAr: "أداة ويب مجانية للمراجعة المتباعدة وحفظ المفردات.",
    summaryEn:
      "Build a fast, keyboard-driven flashcard studio in React and IndexedDB that lets students import CSV decks and study completely offline.",
    summaryAr:
      "طوّر تطبيق بطاقات تعليمية سريع يعمل دون اتصال بالإنترنت مع اختصارات لوحة المفاتيح واستيراد الجداول.",
    authorEn: "Omar Al-Sharif",
    authorAr: "عمر الشريف",
    difficultyEn: "Beginner",
    difficultyAr: "مبتدئ",
    toolsEn: ["Laptop / PC", "Code Editor"],
    toolsAr: ["حاسوب محمول", "محرر برمجي"],
    materialsEn: ["Open-source UI icons", "Sample bilingual CSV vocabulary pack"],
    materialsAr: ["أيقونات مفتوحة المصدر", "ملف مفردات تجريبي ثنائي اللغة"],
    stepsEn: [
      {
        title: "Design Card Flip & Queue Logic",
        description: "Model Leitner box intervals (1, 3, 7 days) cleanly in TypeScript.",
        estimatedHours: 3,
        deliverable: "Spaced repetition scheduler module",
      },
      {
        title: "Local Storage & CSV Importer",
        description: "Parse pasted or uploaded CSV rows into persistent browser decks.",
        estimatedHours: 3,
        deliverable: "Working deck import/export",
      },
      {
        title: "Keyboard Shortcuts & RTL Support",
        description: "Wire Space to flip and 1–3 keys to grade recall difficulty.",
        estimatedHours: 2,
        deliverable: "Accessible study player",
      },
      {
        title: "Package & Share With Study Group",
        description: "Deploy static build and share 2 starter decks with peers.",
        estimatedHours: 2,
        deliverable: "Live web tool URL",
      },
    ],
    stepsAr: [
      {
        title: "تصميم خوارزمية التكرار المتباعد",
        description: "بناء منطق المراجعة على فترات (يوم، 3 أيام، 7 أيام) بلغة TypeScript.",
        estimatedHours: 3,
        deliverable: "وحدة جدولة البطاقات",
      },
      {
        title: "الحفظ المحلي واستيراد CSV",
        description: "تمكين المستخدم من لصق أو رفع ملفات الجداول وحفظها في المتصفح.",
        estimatedHours: 3,
        deliverable: "ميزة استيراد وتصدير المجموعات",
      },
      {
        title: "اختصارات المفاتيح ودعم العربية",
        description: "ربط زر المسافة بقلب البطاقة والأرقام 1-3 بتقييم التذكر.",
        estimatedHours: 2,
        deliverable: "مشغل دراسة مريح وسريع",
      },
      {
        title: "النشر والمشاركة مع الزملاء",
        description: "رفع التطبيق المجاني ومشاركة مجموعتي تعلم جاهزتين.",
        estimatedHours: 2,
        deliverable: "رابط أداة ويب فعالة",
      },
    ],
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "chal-01",
    titleEn: "One-Page Problem Teardown",
    titleAr: "تحليل مشكلة في صفحة واحدة",
    domain: "research",
    durationMinutes: 35,
    promptEn:
      "Pick one everyday friction point you experienced this morning. Sketch or write 3 distinct ways to eliminate it using only tools you already own.",
    promptAr:
      "اختر عقبة يومية واجهتك هذا الصباح. ارسم أو اكتب 3 حلول مختلفة لتبسيطها باستخدام الأدوات التي تمتلكها حالياً فقط.",
    deliverableEn: "3-solution comparison note with one chosen prototype direction",
    deliverableAr: "مذكرة مقارنة بين 3 حلول مع اختيار اتجاه واحد للتنفيذ",
    hintsEn: [
      "Focus on a 5-minute annoyance rather than a massive industry problem.",
      "Compare cost, build time, and durability for each of the 3 options.",
    ],
    hintsAr: [
      "ركّز على مشكلة يومية بسيطة وملموسة بدلاً من فكرة عامة واسعة.",
      "قارن بين التكلفة ووقت التنفيذ وسهولة الاستخدام لكل حل.",
    ],
  },
  {
    id: "chal-02",
    titleEn: "60-Minute Cardboard / Wireframe Prototype",
    titleAr: "نموذج أولي خلال 60 دقيقة",
    domain: "build",
    durationMinutes: 60,
    promptEn:
      "Build the ugliest working version of a physical stand, desk organizer, or interactive 3-screen UI flow in under an hour—no polishing allowed.",
    promptAr:
      "اصنع أبسط نسخة أولية قابلة للاختبار لحامل مكتب أو منظم أو واجهة من 3 شاشات خلال ساعة واحدة دون انشغال بالتفاصيل الجمالية.",
    deliverableEn: "1 functional rough prototype tested once in real use",
    deliverableAr: "نموذج أولي عملي مجرب مرة واحدة على الأقل",
    hintsEn: [
      "Set a visible 60-minute timer before starting.",
      "Use cardboard, tape, sticky notes, or unstyled HTML components.",
    ],
    hintsAr: [
      "اضبط مؤقتاً لـ 60 دقيقة قبل أن تبدأ.",
      "استخدم الكرتون أو الملاحظات اللاصقة أو مكونات برمجية بسيطة.",
    ],
  },
  {
    id: "chal-03",
    titleEn: "Bilingual Micro-Copy Audit",
    titleAr: "صياغة واجهة ثنائية اللغة بوضوح",
    domain: "design",
    durationMinutes: 40,
    promptEn:
      "Take a product idea you love and design its core onboarding card in both English and Arabic so every headline stays balanced without text wrapping awkwardly.",
    promptAr:
      "اختر فكرة منتج تحبها وصمّم بطاقة التعريف الأساسية باللغتين العربية والإنجليزية بحيث يبدو العنوان متزناً وواضحاً في الاتجاهين.",
    deliverableEn: "Bilingual hero card layout with clear primary action",
    deliverableAr: "تصميم بطاقة تعريف متوازنة باللغتين مع زر إجراء واضح",
    hintsEn: [
      "Keep primary button labels to 2–3 crisp words.",
      "Test RTL alignment for icons and directional arrows.",
    ],
    hintsAr: [
      "اجعل نص الزر الرئيسي مختصراً من كلمتين إلى ثلاث كلمات.",
      "راجع اتجاه الأيقونات والأسهم في النسخة العربية.",
    ],
  },
  {
    id: "chal-04",
    titleEn: "5-User Feedback Sprint",
    titleAr: "جولة تقييم مع 5 مستخدمين",
    domain: "launch",
    durationMinutes: 45,
    promptEn:
      "Show your current project sketch or Idea World plan to 2–5 friends or peers. Ask only: 'What feels confusing?' and 'Would you use this weekly?'",
    promptAr:
      "اعرض مخطط مشروعك الحالي على 2 إلى 5 أشخاص واسألهم سؤالين فقط: ما الجزء غير الواضح؟ وهل ستستخدم هذا أسبوعياً؟",
    deliverableEn: "Summary of top 3 insights and 1 concrete change to make next",
    deliverableAr: "ملخص أهم 3 ملاحظات وتعديل عملي واحد ستنفذه لاحقاً",
    hintsEn: [
      "Listen silently without defending your design.",
      "Turn the most repeated confusion into your very next task.",
    ],
    hintsAr: [
      "استمع للملاحظات دون الدفاع عن التصميم.",
      "حوّل أكثر نقطة التباس تكررت إلى مهمتك التنفيذية القادمة.",
    ],
  },
  {
    id: "chal-05",
    titleEn: "Zero-Budget Bill of Materials",
    titleAr: "قائمة مواد بميزانية صفرية",
    domain: "build",
    durationMinutes: 30,
    promptEn:
      "Audit your desk, drawer, or open-source software bookmarks to assemble a full project kit without buying a single new item.",
    promptAr:
      "افحص أدراج مكتبك أو أدواتك البرمجية المجانية لتجميع متطلبات مشروع كامل دون شراء أي قطعة جديدة.",
    deliverableEn: "Inventory list of 6+ reused tools/materials mapped to a project",
    deliverableAr: "قائمة جرد من 6 عناصر متوفرة مسبقاً ومربوطة بفكرة مشروع",
    hintsEn: [
      "Look at spare USB cables, glass jars, scrap wood, or free tiers.",
      "Eliminate every dependency that requires shipping.",
    ],
    hintsAr: [
      "استفد من الأسلاك الفائضة أو البرمجيات المجانية أو الخامات المعاد تدويرها.",
      "استبعد أي متطلب يحتاج شراءً أو شحناً خارجياً.",
    ],
  },
];

export function getInitialWorkspaceState(lang: Language = "en"): WorkspaceState {
  const now = new Date().toISOString();
  const sampleProject: UserProject = {
    id: "proj-sample-desk-companion",
    title: lang === "ar" ? "لوحة تنظيم العادات والتركيز" : "Modular Desk Focus Companion",
    tagline:
      lang === "ar"
        ? "مساحة ويب خفيفة لإدارة جلسات العمل والمهام اليومية."
        : "Minimal distraction-free focus sprint & daily output log.",
    summary:
      lang === "ar"
        ? "مشروع تفاعلي منظم يساعدك على جدولة 3 مهام يومية رئيسية مع مؤقت هادئ وتوثيق الإنجاز."
        : "A clean personal productivity build designed to structure three high-impact daily tasks with calm sprint timers.",
    category: "Tech & Apps",
    status: "in_progress",
    budgetTarget: 25,
    budgetSpent: 10,
    targetDate: "2026-12-15",
    toolsRequired: ["Laptop / PC", "Figma / Design Suite", "Code Editor"],
    materials: [
      { id: "mat-1", name: "Icon & typography tokens", acquired: true },
      { id: "mat-2", name: "Local storage persistence schema", acquired: true },
      { id: "mat-3", name: "Custom domain or static host", acquired: false },
    ],
    steps: [
      {
        id: "step-1",
        title: lang === "ar" ? "تحديد التدفق الأساسي للمستخدم" : "Define Core 3-Task Workflow",
        description:
          lang === "ar"
            ? "رسم شاشة واحدة تجمع المهام الثلاث والمؤقت دون قوائم مشتتة."
            : "Sketch a single calm screen combining top 3 daily priorities and a sprint timer.",
        estimatedHours: 2,
        deliverable: lang === "ar" ? "مخطط واجهة مبدئي" : "Annotated single-screen wireframe",
        completed: true,
        notes: "Kept layout to 2 columns with generous whitespace.",
      },
      {
        id: "step-2",
        title: lang === "ar" ? "بناء المكونات التفاعلية والحفظ المحلي" : "Build Interactive Timer & Persistence",
        description:
          lang === "ar"
            ? "برمجة مؤقت التركيز وحفظ سجل الجلسات تلقائياً في المتصفح."
            : "Implement start/pause countdown state and automatic localStorage history.",
        estimatedHours: 4,
        deliverable: lang === "ar" ? "نموذج ويب تفاعلي عامل" : "Working browser prototype",
        completed: false,
        notes: "",
      },
      {
        id: "step-3",
        title: lang === "ar" ? "اختبار الاستخدام اليومي والإطلاق" : "Run 3-Day Real Usage Test & Polish",
        description:
          lang === "ar"
            ? "استخدام الأداة لثلاثة أيام متتالية وتبسيط أي خطوة متكررة."
            : "Use the tool across three workdays and trim friction from task entry.",
        estimatedHours: 3,
        deliverable: lang === "ar" ? "إصدار جاهز للاستخدام المستمر" : "Polished v1 release",
        completed: false,
        notes: "",
      },
    ],
    createdAt: now,
    updatedAt: now,
    imageUrl: STUDIO_IMAGES.heroStudio,
  };

  return {
    profile: {
      name: "Abdullah Fareez",
      role: "Creative Builder & Product Maker",
      bio: "Exploring the intersection of thoughtful software, tactile hardware, and practical bilingual design.",
      location: "Riyadh / Remote",
      avatarUrl: STUDIO_IMAGES.creatorAvatar,
      tools: ["Laptop / PC", "Figma / Design Suite", "Code Editor", "Sketchbook & Pens"],
      skills: ["UI/UX Design", "Web Development", "Product Research"],
      weeklyHours: 8,
    },
    settings: {
      language: lang,
      currency: "USD",
      defaultBudget: "$75",
      defaultTimeframe: "2 weeks",
      reducedMotion: false,
      highContrastBorders: false,
      dailyReminder: true,
    },
    savedIdeas: [
      {
        id: "idea-seed-bilingual-zine",
        title: "Neighborhood Craft & Architecture Zine",
        tagline: "A pocket-sized bilingual booklet documenting local design details.",
        summary:
          "Photograph architectural facades and artisan studios in your city, pair them with short bilingual essays, and bind a crisp 20-page physical zine.",
        category: "Craft & Design",
        difficulty: "Beginner",
        estimatedCost: "$20",
        estimatedHours: 12,
        fitReason: "Uses your smartphone camera, design software, and sketchbook with minimal material spend.",
        toolsRequired: ["Smartphone Camera", "Figma / Design Suite", "Sketchbook & Pens"],
        materials: ["120gsm matte paper", "Linen thread", "Cardstock cover"],
        steps: [
          {
            title: "Select 5 Neighborhood Landmarks",
            description: "Walk and shortlist five spaces with distinctive textures or craft heritage.",
            estimatedHours: 3,
            deliverable: "Location map & shot list",
          },
          {
            title: "Golden-Hour Photo Walk",
            description: "Capture consistent vertical and detail frames using natural light.",
            estimatedHours: 3,
            deliverable: "20 edited photographs",
          },
          {
            title: "Bilingual Grid Layout",
            description: "Design balanced Arabic and English spreads in Figma.",
            estimatedHours: 4,
            deliverable: "Print-ready A5 booklet PDF",
          },
          {
            title: "Print & Saddle-Stitch",
            description: "Print at a local print shop and hand-bind 10 copies.",
            estimatedHours: 2,
            deliverable: "10 finished booklets",
          },
        ],
        createdAt: now,
        source: "custom",
        imageUrl: STUDIO_IMAGES.editorialZine,
      },
    ],
    generatedIdeas: [],
    projects: [sampleProject],
    activeProjectId: sampleProject.id,
    challengeProgress: {
      "chal-01": {
        challengeId: "chal-01",
        status: "completed",
        reflectionNote: "Sketched a magnetic cable dock using scrap walnut and brass pins.",
        updatedAt: now,
      },
    },
    customChallenges: [],
  };
}
