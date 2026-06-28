export const siteConfig = {
  name: 'Hooks Academy',
  nameAr: 'أكاديمية هوكس',
  description:
    'أكاديمية تعليمية متخصصة في تقديم محتوى تفاعلي وممتع يبني مهارات التفكير والإبداع والبرمجة لدى الأطفال من 8 إلى 15 سنة.',
  descriptionEn:
    'An interactive educational academy building creativity, coding, and future skills for children aged 8 to 15.',
  locale: 'ar_EG',
  language: 'ar',
  email: 'info@hooksacademy.com',
  keywords: [
    'Hooks Academy',
    'أكاديمية هوكس',
    'تعليم الأطفال',
    'برمجة للأطفال',
    'روبوتات',
    'Scratch',
    'Python',
    'تعليم تفاعلي',
    'دورات أطفال',
    'أكاديمية تعليمية',
  ],
} as const

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export const publicRoutes = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/services', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/content', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/register', changeFrequency: 'monthly' as const, priority: 0.8 },
]
