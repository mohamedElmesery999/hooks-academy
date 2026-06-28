import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'المحتوى التعليمي',
  description:
    'استكشف دورات Hooks Academy: Scratch، Python، روبوتات، تصميم، إنجليزي، ورياضيات — للأطفال من 8 إلى 15 سنة.',
  path: '/content',
})

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
