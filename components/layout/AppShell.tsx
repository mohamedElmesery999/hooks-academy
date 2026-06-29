'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'
  const isAdmin = pathname.startsWith('/admin')

  if (isLogin) {
    return (
      <main className="flex h-svh flex-1 flex-col overflow-hidden">
        {children}
      </main>
    )
  }

  if (isAdmin) {
    return <main className="flex flex-1 flex-col">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  )
}
