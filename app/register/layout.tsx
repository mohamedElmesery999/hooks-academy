import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'التسجيل',
  description:
    'سجّل طفلك في Hooks Academy وانضم لبرامجنا التفاعلية في البرمجة والإبداع والتفكير.',
  path: '/register',
})

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
