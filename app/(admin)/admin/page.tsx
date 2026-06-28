"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw } from 'lucide-react'
import type { RequestStatus } from '@/lib/api-utils'
import { useSendStudentEmail, useStudents, useUpdateStudent, useUpdateStudentStatus } from '@/lib/hooks/api'
import { logoutAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { StatsCards } from '@/components/admin/StatsCards'
import { RequestsTable } from '@/components/admin/RequestsTable'

type FilterStatus = 'all' | RequestStatus

export default function Dashboard() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterStatus>('all')

  const { data: students = [], isLoading, isError, refetch, isFetching } = useStudents()
  const updateStatus = useUpdateStudentStatus()
  const updateStudent = useUpdateStudent()
  const sendEmail = useSendStudentEmail()

  const handleUpdateStatus = async (id: string, status: RequestStatus, customMessage?: string) => {
    return updateStatus.mutateAsync({ id, status, customMessage, sendEmail: true })
  }

  const handleUpdateNotes = async (id: string, notes: string) => {
    await updateStudent.mutateAsync({ id, payload: { adminNotes: notes } })
  }

  const handleSendEmail = async (id: string, message: string) => {
    await sendEmail.mutateAsync({ id, message })
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  const filtered =
    filter === 'all' ? students : students.filter((student) => student.status === filter)

  const stats = {
    pending: students.filter((student) => student.status === 'pending').length,
    accepted: students.filter((student) => student.status === 'accepted').length,
    rejected: students.filter((student) => student.status === 'rejected').length,
  }

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'accepted', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-dark-border bg-dark-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Hooks Academy" className="h-9 w-9 rounded-lg object-cover" />
            <div>
              <h1 className="text-lg font-bold text-white">لوحة التحكم</h1>
              <p className="text-xs text-slate-400">Hooks Academy Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => refetch()} loading={isFetching}>
              <RefreshCw size={14} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut size={14} />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <FadeIn className="mb-8">
          <StatsCards {...stats} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">طلبات التسجيل</h2>
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-dark-border bg-dark-card p-12 text-center">
              <p className="text-slate-400">جاري تحميل الطلبات...</p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-12 text-center">
              <p className="mb-4 text-red-400">تعذر تحميل الطلبات</p>
              <Button size="sm" variant="secondary" onClick={() => refetch()}>
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <RequestsTable
              requests={filtered}
              onUpdateStatus={handleUpdateStatus}
              onUpdateNotes={handleUpdateNotes}
              onSendEmail={handleSendEmail}
            />
          )}
        </FadeIn>
      </div>
    </div>
  )
}
