"use client"

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Check,
  X,
  Mail,
  Users,
  Save,
  FileText,
  Inbox,
  Calendar,
  User,
  Phone,
  AtSign,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Trash2,
} from 'lucide-react'
import type { RequestStatus, Student, StudentStatusUpdateResponse } from '@/lib/api-utils'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { Textarea } from '../ui/Textarea'
import { RequestPaymentFields } from './RequestPaymentFields'
import { openWhatsAppGroup, WHATSAPP_GROUP_LINK } from '@/utils/whatsapp'

interface RequestsTableProps {
  requests: Student[]
  onUpdateStatus: (
    id: string,
    status: RequestStatus,
    customMessage?: string,
  ) => Promise<StudentStatusUpdateResponse>
  onUpdateNotes: (id: string, notes: string) => Promise<void>
  onUpdatePayment: (id: string, totalAmount: number, paidAmount: number) => Promise<void>
  onSendEmail: (id: string, message: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

type PendingAction = {
  student: Student
  status: Extract<RequestStatus, 'accepted' | 'rejected'>
}

type LoadingAction = 'accept' | 'reject' | 'email' | 'notes' | 'delete'

type LoadingState = {
  id: string
  action: LoadingAction
}

const PAGE_SIZE = 10

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, totalItems)
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dark-border bg-dark-card/60 px-4 py-3">
      <p className="text-xs text-slate-400">
        عرض <span className="font-medium text-slate-200">{start}–{end}</span> من{' '}
        <span className="font-medium text-slate-200">{totalItems}</span> طلب
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={14} />
          السابق
        </button>

        {pages.map((page, index) => {
          const prev = pages[index - 1]
          const showEllipsis = prev !== undefined && page - prev > 1

          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-xs text-slate-600">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={[
                  'min-w-[2rem] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary-500/15 text-primary-400 ring-1 ring-primary-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {page}
              </button>
            </span>
          )
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          التالي
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  )
}

const statusAccent: Record<RequestStatus, string> = {
  pending: 'border-r-amber-400/70',
  accepted: 'border-r-emerald-400/70',
  rejected: 'border-r-red-400/70',
}

const statusGlow: Record<RequestStatus, string> = {
  pending: 'from-amber-500/5',
  accepted: 'from-emerald-500/5',
  rejected: 'from-red-500/5',
}

function formatStatusFeedback(result: StudentStatusUpdateResponse, status: RequestStatus) {
  if (status !== 'accepted' && status !== 'rejected') return null

  if (result.emailSent) {
    return { message: 'تم تحديث الحالة وإرسال البريد بنجاح', type: 'success' as const }
  }

  if (result.emailError) {
    return {
      message: `تم تحديث الحالة، لكن فشل إرسال البريد: ${result.emailError}`,
      type: 'error' as const,
    }
  }

  return { message: 'تم تحديث الحالة بنجاح', type: 'success' as const }
}

type ActionTone = 'accept' | 'reject' | 'email' | 'delete' | 'notes'

const actionToneStyles: Record<ActionTone, { idle: string; active: string; spinner: string }> = {
  accept: {
    idle: 'text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-300',
    active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
    spinner: 'border-emerald-400/30 border-t-emerald-300',
  },
  reject: {
    idle: 'text-red-400/80 hover:bg-red-500/10 hover:text-red-300',
    active: 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30',
    spinner: 'border-red-400/30 border-t-red-300',
  },
  email: {
    idle: 'text-sky-400/80 hover:bg-sky-500/10 hover:text-sky-300',
    active: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
    spinner: 'border-sky-400/30 border-t-sky-300',
  },
  delete: {
    idle: 'text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-300',
    active: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
    spinner: 'border-rose-400/30 border-t-rose-300',
  },
  notes: {
    idle: 'text-violet-400/80 hover:bg-violet-500/10 hover:text-violet-300',
    active: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
    spinner: 'border-violet-400/30 border-t-violet-300',
  },
}

function RequestActionButton({
  tone,
  label,
  icon,
  loading,
  disabled,
  dimmed,
  title,
  onClick,
}: {
  tone: ActionTone
  label: string
  icon: ReactNode
  loading?: boolean
  disabled?: boolean
  dimmed?: boolean
  title?: string
  onClick: () => void
}) {
  const styles = actionToneStyles[tone]

  return (
    <button
      type="button"
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        'flex min-w-[4.25rem] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-40',
        dimmed ? 'opacity-35' : '',
        loading ? styles.active : styles.idle,
      ].join(' ')}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {loading ? (
          <span className={`h-3.5 w-3.5 animate-spin rounded-full border-2 ${styles.spinner}`} />
        ) : (
          icon
        )}
      </span>
      <span className="leading-none">{label}</span>
    </button>
  )
}

function InfoCell({
  icon,
  label,
  value,
  dir,
}: {
  icon: ReactNode
  label: string
  value: string
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <div className="min-w-0 rounded-xl border border-dark-border/60 bg-dark/50 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="truncate text-sm text-slate-200" dir={dir}>
        {value}
      </p>
    </div>
  )
}

function RequestCard({
  student,
  programLabel,
  hasNotes,
  feedback,
  expanded,
  isLoading,
  onToggle,
  onOpenNotesModal,
  onOpenEmailModal,
  onOpenStatusModal,
  onOpenDeleteModal,
  onUpdatePayment,
}: {
  student: Student
  programLabel: string
  hasNotes: boolean
  feedback: { message: string; type: 'success' | 'error' } | null
  expanded: boolean
  isLoading: (action: LoadingAction) => boolean
  onToggle: () => void
  onOpenNotesModal: () => void
  onOpenEmailModal: () => void
  onOpenStatusModal: (status: PendingAction['status']) => void
  onOpenDeleteModal: () => void
  onUpdatePayment: (id: string, totalAmount: number, paidAmount: number) => Promise<void>
}) {
  const isAccepted = student.status === 'accepted'
  const isRejected = student.status === 'rejected'
  const isPending = student.status === 'pending'
  const initial = student.name.trim().charAt(0) || '?'

  return (
    <article
      className={[
        'group relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all duration-300',
        'hover:border-dark-border/80 hover:shadow-lg hover:shadow-black/20',
        `border-r-4 ${statusAccent[student.status]}`,
      ].join(' ')}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-l ${statusGlow[student.status]} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
      />

      <div className={`relative ${expanded ? 'p-4 sm:p-5' : 'p-4'}`}>
        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={`flex w-full flex-wrap items-start justify-between gap-3 text-right transition-colors hover:opacity-90 ${
            expanded ? 'mb-4' : ''
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 text-base font-bold text-primary-400 ring-1 ring-primary-500/20">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-white">{student.name}</h3>
                <Badge status={student.status} />
                {hasNotes && !expanded && (
                  <span className="h-2 w-2 rounded-full bg-violet-400" title="يوجد ملاحظات" />
                )}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                <span>{student.age} سنة</span>
                <span className="hidden text-dark-border sm:inline">•</span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen size={12} className="text-primary-400/70" />
                  {programLabel}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-dark-border/60 bg-dark/40 px-2.5 py-1.5 text-xs text-slate-400">
              <Calendar size={13} className="text-slate-500" />
              {new Date(student.createdAt).toLocaleDateString('ar-EG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <ChevronDown
              size={18}
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {expanded && (
          <>
        {/* Contact grid */}
        <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCell icon={<User size={11} />} label="ولي الأمر" value={student.parentName} />
          <InfoCell
            icon={<AtSign size={11} />}
            label="البريد"
            value={student.email || '—'}
            dir="ltr"
          />
          <InfoCell
            icon={<Phone size={11} />}
            label="واتساب"
            value={student.phone}
            dir="ltr"
          />
          <InfoCell icon={<BookOpen size={11} />} label="البرنامج" value={programLabel} />
        </div>

        <RequestPaymentFields student={student} onSave={onUpdatePayment} />

        {/* Actions */}
        <div className="rounded-xl border border-dark-border/70 bg-dark/30 p-3">
          <p className="mb-2.5 text-[11px] font-medium text-slate-500">الإجراءات</p>

          <div className="flex flex-wrap items-start gap-2">
            <div className="inline-flex min-w-[16rem] flex-1 overflow-hidden rounded-xl border border-dark-border bg-dark-card/80 p-1 sm:max-w-2xl">
              <RequestActionButton
                tone="accept"
                label="قبول"
                icon={<Check size={15} strokeWidth={2.5} />}
                loading={isLoading('accept')}
                disabled={!student.email || !isPending}
                dimmed={isRejected || isAccepted}
                title={
                  !student.email
                    ? 'لا يوجد بريد إلكتروني'
                    : isAccepted
                      ? 'تم القبول'
                      : isRejected
                        ? 'غير متاح بعد الرفض'
                        : 'قبول وإرسال بريد'
                }
                onClick={() => onOpenStatusModal('accepted')}
              />
              <div className="my-1.5 w-px self-stretch bg-dark-border/80" />
              <RequestActionButton
                tone="reject"
                label="رفض"
                icon={<X size={15} strokeWidth={2.5} />}
                loading={isLoading('reject')}
                disabled={!student.email || !isPending}
                dimmed={isAccepted || isRejected}
                title={
                  !student.email
                    ? 'لا يوجد بريد إلكتروني'
                    : isRejected
                      ? 'تم الرفض'
                      : isAccepted
                        ? 'غير متاح بعد القبول'
                        : 'رفض وإرسال بريد'
                }
                onClick={() => onOpenStatusModal('rejected')}
              />
              <div className="my-1.5 w-px self-stretch bg-dark-border/80" />
              <RequestActionButton
                tone="email"
                label="بريد"
                icon={<Mail size={15} strokeWidth={2.5} />}
                loading={isLoading('email')}
                disabled={!student.email}
                title={student.email ? 'كتابة وإرسال بريد مخصص' : 'لا يوجد بريد إلكتروني'}
                onClick={onOpenEmailModal}
              />
              <div className="my-1.5 w-px self-stretch bg-dark-border/80" />
              <RequestActionButton
                tone="delete"
                label="حذف"
                icon={<Trash2 size={15} strokeWidth={2.5} />}
                loading={isLoading('delete')}
                title="حذف الطلب نهائياً"
                onClick={onOpenDeleteModal}
              />
              <div className="my-1.5 w-px self-stretch bg-dark-border/80" />
              <RequestActionButton
                tone="notes"
                label="ملاحظات"
                icon={
                  <span className="relative">
                    <FileText size={15} strokeWidth={2.5} />
                    {hasNotes && (
                      <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-dark-card" />
                    )}
                  </span>
                }
                loading={isLoading('notes')}
                title={hasNotes ? 'عرض أو تعديل ملاحظات الأدمن' : 'إضافة ملاحظات أدمن'}
                onClick={onOpenNotesModal}
              />
            </div>

            {isAccepted && WHATSAPP_GROUP_LINK && (
              <button
                type="button"
                title={`إضافة ${student.phone} لمجموعة الواتساب`}
                onClick={() => openWhatsAppGroup()}
                className="inline-flex h-[3.25rem] min-w-[3.25rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dark-border bg-dark-card/80 px-3 text-slate-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <Users size={15} />
                <span className="text-[10px] font-medium">واتساب</span>
              </button>
            )}

          </div>

          {feedback && (
            <p
              className={`mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
              }`}
            >
              {feedback.message}
            </p>
          )}
        </div>
          </>
        )}
      </div>
    </article>
  )
}

export function RequestsTable({
  requests,
  onUpdateStatus,
  onUpdateNotes,
  onUpdatePayment,
  onSendEmail,
  onDelete,
}: RequestsTableProps) {
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [editingEmailMessages, setEditingEmailMessages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<LoadingState | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null)
  const [pendingNotes, setPendingNotes] = useState<Student | null>(null)
  const [pendingEmail, setPendingEmail] = useState<Student | null>(null)
  const [feedback, setFeedback] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedRequests = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return requests.slice(start, start + PAGE_SIZE)
  }, [requests, safePage])

  const requestsKey = useMemo(() => requests.map((r) => r.id).join(','), [requests])

  useEffect(() => {
    setCurrentPage(1)
  }, [requestsKey])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const isLoading = (id: string, action: LoadingAction) =>
    loading?.id === id && loading.action === action

  const getProgramLabel = (student: Student) => student.program?.name ?? student.programId

  const getNotes = (student: Student) => editingNotes[student.id] ?? student.adminNotes ?? ''

  const getEmailMessage = (student: Student) => editingEmailMessages[student.id] ?? ''

  const showFeedback = (id: string, message: string, type: 'success' | 'error') => {
    setFeedback({ id, message, type })
    setTimeout(() => setFeedback(null), 5000)
  }

  const handleStatus = async (student: Student, status: RequestStatus) => {
    const action = status === 'accepted' ? 'accept' : 'reject'
    setLoading({ id: student.id, action })

    try {
      const result = await onUpdateStatus(student.id, status)
      setPendingAction(null)

      const statusFeedback = formatStatusFeedback(result, status)
      if (statusFeedback) {
        showFeedback(student.id, statusFeedback.message, statusFeedback.type)
      }
    } catch (err) {
      showFeedback(
        student.id,
        err instanceof Error ? err.message : 'فشل تحديث الحالة',
        'error',
      )
    } finally {
      setLoading(null)
    }
  }

  const openStatusModal = (student: Student, status: PendingAction['status']) => {
    setPendingAction({ student, status })
  }

  const confirmStatusChange = () => {
    if (!pendingAction) return
    void handleStatus(pendingAction.student, pendingAction.status)
  }

  const handleSaveNotes = async (id: string) => {
    setLoading({ id, action: 'notes' })
    try {
      await onUpdateNotes(id, editingNotes[id] ?? '')
      setPendingNotes(null)
      showFeedback(id, 'تم حفظ الملاحظات', 'success')
    } catch (err) {
      showFeedback(id, err instanceof Error ? err.message : 'فشل حفظ الملاحظات', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleSendEmail = async (student: Student) => {
    if (!student.email) return

    const message = getEmailMessage(student).trim()
    if (!message) {
      showFeedback(student.id, 'اكتب نص الرسالة قبل الإرسال', 'error')
      return
    }

    setLoading({ id: student.id, action: 'email' })
    try {
      await onSendEmail(student.id, message)
      setPendingEmail(null)
      showFeedback(student.id, 'تم إرسال البريد بنجاح', 'success')
    } catch (err) {
      showFeedback(
        student.id,
        err instanceof Error ? err.message : 'فشل إرسال البريد',
        'error',
      )
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return

    setLoading({ id: pendingDelete.id, action: 'delete' })
    try {
      await onDelete(pendingDelete.id)
      setPendingDelete(null)
    } catch (err) {
      showFeedback(
        pendingDelete.id,
        err instanceof Error ? err.message : 'فشل حذف الطلب',
        'error',
      )
    } finally {
      setLoading(null)
    }
  }

  const openNotesModal = (student: Student) => {
    setEditingNotes((prev) => {
      if (prev[student.id] !== undefined) return prev
      return { ...prev, [student.id]: student.adminNotes ?? '' }
    })
    setPendingNotes(student)
  }

  const openEmailModal = (student: Student) => {
    if (!student.email) return
    setPendingEmail(student)
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-dark-border bg-dark-card/50 px-6 py-16 text-center">
        <div className="mb-4 rounded-2xl bg-dark-border/40 p-4">
          <Inbox size={32} className="text-slate-500" />
        </div>
        <p className="text-base font-medium text-slate-300">لا توجد طلبات حالياً</p>
        <p className="mt-1 text-sm text-slate-500">ستظهر طلبات التسجيل الجديدة هنا</p>
      </div>
    )
  }

  return (
    <>
      <Modal
        open={!!pendingAction}
        onClose={() => !loading && setPendingAction(null)}
        title={
          pendingAction?.status === 'accepted'
            ? 'تأكيد قبول الطلب'
            : 'تأكيد رفض الطلب'
        }
        description={
          pendingAction
            ? pendingAction.status === 'accepted'
              ? `هل تريد قبول طلب "${pendingAction.student.name}" وإرسال بريد التأكيد الافتراضي؟`
              : `هل تريد رفض طلب "${pendingAction.student.name}" وإرسال بريد الإشعار الافتراضي؟`
            : undefined
        }
        confirmLabel={pendingAction?.status === 'accepted' ? 'قبول الطلب' : 'رفض الطلب'}
        variant={pendingAction?.status === 'accepted' ? 'success' : 'danger'}
        loading={
          !!pendingAction &&
          loading?.id === pendingAction.student.id &&
          (loading.action === 'accept' || loading.action === 'reject')
        }
        onConfirm={confirmStatusChange}
      />

      <Modal
        open={!!pendingDelete}
        onClose={() => !loading && setPendingDelete(null)}
        title="تأكيد حذف الطلب"
        description={
          pendingDelete
            ? `هل أنت متأكد من حذف طلب "${pendingDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : undefined
        }
        confirmLabel="حذف الطلب"
        variant="danger"
        loading={!!pendingDelete && isLoading(pendingDelete.id, 'delete')}
        onConfirm={handleDelete}
      />

      <Modal
        open={!!pendingNotes}
        onClose={() => !loading && setPendingNotes(null)}
        title={pendingNotes ? `ملاحظات الأدمن - ${pendingNotes.name}` : 'ملاحظات الأدمن'}
        description="اكتب ملاحظاتك الداخلية هنا ملاحظات المتابعة."
        confirmLabel="حفظ الملاحظات"
        variant="success"
        loading={!!pendingNotes && isLoading(pendingNotes.id, 'notes')}
        onConfirm={() => pendingNotes && void handleSaveNotes(pendingNotes.id)}
      >
        {pendingNotes && (
          <Textarea
            id={`admin-notes-${pendingNotes.id}`}
            value={getNotes(pendingNotes)}
            onChange={(e) =>
              setEditingNotes((prev) => ({ ...prev, [pendingNotes.id]: e.target.value }))
            }
            rows={6}
            placeholder="مثال: دفع مقدم 3000 جنيه - المتبقي 2000 جنيه - آخر متابعة يوم الخميس..."
          />
        )}
      </Modal>

      <Modal
        open={!!pendingEmail}
        onClose={() => !loading && setPendingEmail(null)}
        title={pendingEmail ? `إرسال بريد - ${pendingEmail.name}` : 'إرسال بريد'}
        description="اكتب رسالة البريد التي ستُرسل لولي الأمر. هذه الرسالة منفصلة عن ملاحظات الأدمن الداخلية."
        confirmLabel="إرسال البريد"
        variant="success"
        loading={!!pendingEmail && isLoading(pendingEmail.id, 'email')}
        onConfirm={() => pendingEmail && void handleSendEmail(pendingEmail)}
      >
        {pendingEmail && (
          <Textarea
            id={`email-message-${pendingEmail.id}`}
            value={getEmailMessage(pendingEmail)}
            onChange={(e) =>
              setEditingEmailMessages((prev) => ({
                ...prev,
                [pendingEmail.id]: e.target.value,
              }))
            }
            rows={6}
            placeholder={`مرحباً ${pendingEmail.parentName}،\n\nنود إبلاغكم بخصوص طلب تسجيل ${pendingEmail.name}...`}
          />
        )}
      </Modal>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500">
          <span>
            {requests.length} طلب
            {totalPages > 1 && ` · صفحة ${safePage} من ${totalPages}`}
          </span>
          <span className="hidden sm:inline">مرتبة من الأحدث</span>
        </div>

        {paginatedRequests.map((student) => (
          <RequestCard
            key={student.id}
            student={student}
            programLabel={getProgramLabel(student)}
            hasNotes={Boolean(getNotes(student).trim())}
            feedback={feedback?.id === student.id ? feedback : null}
            expanded={expandedIds.has(student.id)}
            isLoading={(action) => isLoading(student.id, action)}
            onToggle={() => toggleExpanded(student.id)}
            onOpenNotesModal={() => openNotesModal(student)}
            onOpenEmailModal={() => openEmailModal(student)}
            onOpenStatusModal={(status) => openStatusModal(student, status)}
            onOpenDeleteModal={() => setPendingDelete(student)}
            onUpdatePayment={onUpdatePayment}
          />
        ))}

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={requests.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}
