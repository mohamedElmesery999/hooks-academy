import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminLoggedIn } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  if (!isAdminLoggedIn()) {
    router.push('/admin/login')
    return null
  }

  return <>{children}</>
}
