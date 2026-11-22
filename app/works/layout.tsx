import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'أعمال الطلاب',
  description:
    'مشاريع ومواقع Portfolio حقيقية صمّمها طلاب Hooks Academy بعد إتمام رحلة البرمجة.',
  path: '/works',
})

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
