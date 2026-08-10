export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export interface RegistrationRequest {
  id: string
  student_name: string
  age: number
  parent_name: string
  email: string
  phone: string
  program: string
  notes: string | null
  status: RequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface RegistrationFormData {
  student_name: string
  age: number
  parent_name: string
  email: string
  phone: string
  program: string
  notes?: string
}

export const PROGRAMS = [
  { value: 'programming', label: 'برمجة للأطفال' },
] as const

export const SERVICES = [
  {
    id: 'programming',
    title: 'برمجة للأطفال',
    description: 'تعلّم أساسيات البرمجة بلغة Scratch و Python بطريقة ممتعة وتفاعلية.',
    icon: 'Code2',
    color: 'from-violet-500 to-purple-600',
    available: true,
  },
  {
    id: 'robotics',
    title: 'روبوتات وإلكترونيات',
    description: 'بناء وبرمجة روبوتات حقيقية وتطوير مهارات التفكير الهندسي.',
    icon: 'Bot',
    color: 'from-sky-500 to-blue-600',
    available: false,
  },
  {
    id: 'design',
    title: 'تصميم وإبداع',
    description: 'تصميم جرافيك، رسوم متحركة، ومحتوى رقمي إبداعي.',
    icon: 'Palette',
    color: 'from-pink-500 to-rose-600',
    available: false,
  },
  {
    id: 'english',
    title: 'لغة إنجليزية',
    description: 'تعلّم الإنجليزية من خلال ألعاب وأنشطة تفاعلية تناسب كل عمر.',
    icon: 'Languages',
    color: 'from-emerald-500 to-teal-600',
    available: false,
  },
  {
    id: 'math',
    title: 'رياضيات ممتعة',
    description: 'فهم الرياضيات بطريقة عملية وممتعة بعيداً عن الحفظ الممل.',
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-600',
    available: false,
  },
  {
    id: 'summer',
    title: 'معسكر صيفي',
    description: 'برنامج صيفي متكامل يجمع بين التعلّم والمرح والأنشطة الجماعية.',
    icon: 'Sun',
    color: 'from-yellow-400 to-amber-500',
    available: false,
  },
] as const

export interface LearningTopic {
  id: string
  title: string
  subtitle: string
  icon: string
}

export interface LearningPhase {
  id: string
  step: number
  title: string
  subtitle: string
  description: string
  icon: string
  gradient: string
  glow: string
  topics: readonly LearningTopic[]
}

export const LEARNING_PATH = [
  {
    id: 'ict',
    step: 1,
    title: 'أساسيات ICT و ICDL',
    subtitle: 'الخطوة الأولى — فهم العالم الرقمي',
    description:
      'يبدأ الطالب برحلة ICT و ICDL ليتعرّف على الحاسوب، مكوّناته، وبرامج Microsoft Office الأساسية.',
    icon: 'Monitor',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-500/25',
    topics: [
      { id: 'ict', title: 'ICT & ICDL', subtitle: 'مفاهيم تقنية المعلومات والشهادة الدولية', icon: 'Award' },
      { id: 'word', title: 'Microsoft Word', subtitle: 'كتابة وتنسيق المستندات والتقارير', icon: 'FileText' },
      { id: 'excel', title: 'Microsoft Excel', subtitle: 'جداول البيانات والحسابات الذكية', icon: 'Table' },
      { id: 'powerpoint', title: 'Microsoft PowerPoint', subtitle: 'عروض تقديمية احترافية ومؤثرة', icon: 'Presentation' },
      { id: 'computer', title: 'ما هو الحاسوب؟', subtitle: 'كيف يعمل الجهاز ودوره في حياتنا', icon: 'Laptop' },
      { id: 'hardware', title: 'Software & Hardware', subtitle: 'الفرق بين البرمجيات والعتاد', icon: 'Cpu' },
    ],
  },
  {
    id: 'programming',
    step: 2,
    title: 'عالم البرمجة',
    subtitle: 'الخطوة الثانية — من الصفر إلى الكود',
    description:
      'بعد إتقان الأساسيات، ينتقل الطالب لتعلّم بناء صفحات الويب بلغات HTML و CSS و JavaScript.',
    icon: 'Code2',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/25',
    topics: [
      { id: 'html', title: 'HTML', subtitle: 'هيكل وبناء صفحات الويب', icon: 'Code' },
      { id: 'css', title: 'CSS', subtitle: 'الألوان، التنسيق، والتصميم الجذاب', icon: 'Palette' },
      { id: 'js', title: 'JavaScript', subtitle: 'الحركة، التفاعل، والمنطق البرمجي', icon: 'Braces' },
    ],
  },
  {
    id: 'portfolio',
    step: 3,
    title: 'مشروعك الشخصي',
    subtitle: 'الخطوة الأخيرة — إنجاز حقيقي',
    description:
      'في النهاية يبني كل طالب موقع Portfolio شخصي يعرّف به عن نفسه ومهاراته — مشروع حقيقي يفتخر به!',
    icon: 'Rocket',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
    topics: [
      { id: 'profile-web', title: 'موقع Portfolio شخصي', subtitle: 'صفحة ويب كاملة من تصميم الطالب', icon: 'Globe' },
      { id: 'deploy', title: 'نشر المشروع', subtitle: 'مشاركة العمل مع العائلة والأصدقاء', icon: 'Share2' },
      { id: 'certificate', title: 'شهادة إنجاز', subtitle: 'تقدير للطالب على إتمام الرحلة', icon: 'Trophy' },
    ],
  },
] as const satisfies readonly LearningPhase[]

export const COURSES = [
  {
    id: 1,
    title: 'مغامرة Scratch',
    ageRange: '8 - 10 سنوات',
    duration: '8 أسابيع',
    level: 'مبتدئ',
    description: 'رحلة في عالم البرمجة المرئية مع إنشاء ألعاب وقصص تفاعلية.',
    image: 'scratch',
    tags: ['برمجة', 'ألعاب'],
  },
  {
    id: 2,
    title: 'Python للصغار',
    ageRange: '11 - 13 سنة',
    duration: '10 أسابيع',
    level: 'متوسط',
    description: 'تعلّم لغة Python من الصفر مع مشاريع عملية مثل الآلات الحاسبة والألعاب.',
    image: 'python',
    tags: ['برمجة', 'Python'],
  },
  {
    id: 3,
    title: 'عالم الروبوتات',
    ageRange: '10 - 14 سنة',
    duration: '12 أسبوع',
    level: 'متوسط',
    description: 'بناء روبوتات ذكية وبرمجتها لحل تحديات حقيقية.',
    image: 'robot',
    tags: ['روبوتات', 'هندسة'],
  },
  {
    id: 4,
    title: 'مصمم المستقبل',
    ageRange: '9 - 12 سنة',
    duration: '6 أسابيع',
    level: 'مبتدئ',
    description: 'تعلّم أساسيات التصميم الجرافيكي وإنشاء شعارات وملصقات.',
    image: 'design',
    tags: ['تصميم', 'إبداع'],
  },
  {
    id: 5,
    title: 'English Adventure',
    ageRange: '8 - 15 سنة',
    duration: '8 أسابيع',
    level: 'جميع المستويات',
    description: 'تعلّم الإنجليزية من خلال مغامرات وألعاب ومحادثات يومية.',
    image: 'english',
    tags: ['إنجليزي', 'محادثة'],
  },
  {
    id: 6,
    title: 'رياضيات باللعب',
    ageRange: '8 - 11 سنة',
    duration: '8 أسابيع',
    level: 'مبتدئ',
    description: 'حل مسائل رياضية بطريقة ممتعة مع ألعاب وتحديات جماعية.',
    image: 'math',
    tags: ['رياضيات', 'ألعاب'],
  },
] as const
