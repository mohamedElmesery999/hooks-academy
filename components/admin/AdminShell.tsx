'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, MonitorSmartphone } from 'lucide-react'
import { logoutAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

const tabs = [
  {
    href: '/admin',
    label: 'طلبات التسجيل',
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === '/admin',
  },
  {
    href: '/admin/homepage',
    label: 'إدارة الشاشة الرئيسية',
    icon: MonitorSmartphone,
    match: (pathname: string) => pathname.startsWith('/admin/homepage'),
  },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAdmin()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-dark-border bg-dark-card">
        <div className="mx-auto flex max-w-11xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Hooks Academy" className="h-9 w-9 rounded-lg object-cover" />
              <div>
                <h1 className="text-lg font-bold text-white">لوحة التحكم</h1>
                <p className="text-xs text-slate-400">Hooks Academy Admin</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut size={14} />
              خروج
            </Button>
          </div>

          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = tab.match(pathname)
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary-500/15 text-primary-400 ring-1 ring-primary-500/30'
                      : 'bg-dark text-slate-400 ring-1 ring-dark-border hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-11xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}
