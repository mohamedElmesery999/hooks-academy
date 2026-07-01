'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminLoggedIn } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let active = true

    isAdminLoggedIn().then((authenticated) => {
      if (!active) return

      if (authenticated) {
        setAllowed(true)
        return
      }

      router.replace('/login')
    })

    return () => {
      active = false
    }
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <p className="text-slate-400">جاري التحقق من الجلسة...</p>
      </div>
    )
  }

  return <>{children}</>
}
