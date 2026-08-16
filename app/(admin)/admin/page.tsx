"use client"

import { useEffect, useState } from 'react'
import type { RequestStatus } from '@/lib/api-utils'
import {
  useSendStudentEmail,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
  useUpdateStudentStatus,
  useCycles,
  useOpenNextCycle,
} from '@/lib/hooks/api'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { Modal } from '@/components/ui/Modal'
import { AdminShell } from '@/components/admin/AdminShell'
import { StatsCards, type StatsFilter } from '@/components/admin/StatsCards'
import { PaymentSidebar } from '@/components/admin/PaymentSidebar'
import { RequestsTable } from '@/components/admin/RequestsTable'
import { CycleTabs } from '@/components/admin/CycleTabs'

export default function Dashboard() {
  const [filter, setFilter] = useState<StatsFilter>('all')
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [confirmNewCycle, setConfirmNewCycle] = useState(false)

  const { data: cycles = [], isLoading: cyclesLoading } = useCycles()
  const openNextCycle = useOpenNextCycle()

  useEffect(() => {
    if (!cycles.length) return
    const stillExists = cycles.some((cycle) => cycle.id === activeCycleId)
    if (!activeCycleId || !stillExists) {
      const openCycle = cycles.find((cycle) => cycle.status === 'open') ?? cycles[cycles.length - 1]
      setActiveCycleId(openCycle.id)
    }
  }, [cycles, activeCycleId])

  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = useStudents({ cycleId: activeCycleId ?? undefined })
  const updateStatus = useUpdateStudentStatus()
  const updateStudent = useUpdateStudent()
  const sendEmail = useSendStudentEmail()
  const deleteStudent = useDeleteStudent()

  const handleUpdateStatus = async (id: string, status: RequestStatus, customMessage?: string) => {
    return updateStatus.mutateAsync({ id, status, customMessage, sendEmail: true })
  }

  const handleUpdateNotes = async (id: string, notes: string) => {
    await updateStudent.mutateAsync({ id, payload: { adminNotes: notes } })
  }

  const handleUpdatePayment = async (id: string, totalAmount: number, paidAmount: number) => {
    await updateStudent.mutateAsync({ id, payload: { totalAmount, paidAmount } })
  }

  const handleSendEmail = async (id: string, message: string) => {
    await sendEmail.mutateAsync({ id, message })
  }

  const handleDelete = async (id: string) => {
    await deleteStudent.mutateAsync(id)
  }

  const handleOpenNextCycle = async () => {
    const result = await openNextCycle.mutateAsync()
    setActiveCycleId(result.next.id)
    setFilter('all')
    setConfirmNewCycle(false)
  }

  const filtered =
    filter === 'all' ? students : students.filter((student) => student.status === filter)

  const stats = {
    total: students.length,
    pending: students.filter((student) => student.status === 'pending').length,
    accepted: students.filter((student) => student.status === 'accepted').length,
    rejected: students.filter((student) => student.status === 'rejected').length,
  }

  const filterLabels: Record<StatsFilter, string> = {
    all: 'الكل',
    pending: 'قيد الانتظار',
    accepted: 'مقبول',
    rejected: 'مرفوض',
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const activeFilterLabel = `${activeCycle?.name ?? 'الدورة'} · ${filterLabels[filter]}`
  const openCycle = cycles.find((cycle) => cycle.status === 'open')

  return (
    <AdminShell>
      <FadeIn className="mb-4">
        {cyclesLoading ? (
          <p className="text-sm text-slate-500">جاري تحميل الدورات...</p>
        ) : (
          <CycleTabs
            cycles={cycles}
            activeCycleId={activeCycleId}
            onSelect={(id) => {
              setActiveCycleId(id)
              setFilter('all')
            }}
            onOpenNext={() => setConfirmNewCycle(true)}
            opening={openNextCycle.isPending}
          />
        )}
      </FadeIn>

      <FadeIn className="mb-8">
        <StatsCards
          {...stats}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </FadeIn>

      <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
        <FadeIn delay={0.1} className="w-full shrink-0 lg:sticky lg:top-6 lg:w-80">
          <PaymentSidebar students={filtered} filterLabel={activeFilterLabel} />
        </FadeIn>

        <FadeIn delay={0.2} className="min-w-0 flex-1">
          <h2 className="mb-6 text-xl font-semibold text-white">
            طلبات التسجيل
            {activeCycle ? (
              <span className="ms-2 text-base font-normal text-slate-400">
                {activeCycle.name}
                {activeCycle.status === 'closed' ? ' (منتهية)' : ''}
              </span>
            ) : null}
          </h2>

          {isLoading || cyclesLoading ? (
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
              onUpdatePayment={handleUpdatePayment}
              onSendEmail={handleSendEmail}
              onDelete={handleDelete}
            />
          )}
        </FadeIn>
      </div>

      <Modal
        open={confirmNewCycle}
        onClose={() => !openNextCycle.isPending && setConfirmNewCycle(false)}
        title="تأكيد إنهاء الدورة"
        description={
          openCycle
            ? `هل أنت متأكد من إنهاء "${openCycle.name}" وفتح دورة جديدة؟ الطلبات الجديدة هتروح للدورة الجديدة، والدورة الحالية هتفضل ظاهرة للمراجعة.`
            : 'هل أنت متأكد من فتح دورة جديدة للطلبات القادمة؟'
        }
        confirmLabel="إنهاء الدورة"
        cancelLabel="إلغاء"
        variant="danger"
        loading={openNextCycle.isPending}
        onConfirm={() => void handleOpenNextCycle()}
      />
    </AdminShell>
  )
}
