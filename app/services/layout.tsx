import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'الخدمات',
  description:
    'برامج تعليمية متنوعة من Hooks Academy: برمجة، روبوتات، تصميم، لغات، ورياضيات — مصممة لتنمية مهارات الأطفال.',
  path: '/services',
})

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
