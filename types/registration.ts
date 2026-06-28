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
