import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'لوحة الإدارة',
  description: 'لوحة إدارة Hooks Academy',
  path: '/admin',
  noIndex: true,
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>Admin Layout</h1>
      {children}
    </div>
  )
}
