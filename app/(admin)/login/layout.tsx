import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'تسجيل الدخول',
  description: 'تسجيل دخول إدارة Hooks Academy',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
