"use client"

import { useState } from 'react'
import { Check, X, Mail, Users, Save } from 'lucide-react'
import type { RequestStatus, Student, StudentStatusUpdateResponse } from '@/lib/api-utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { openWhatsAppGroup, WHATSAPP_GROUP_LINK } from '@/utils/whatsapp'

interface RequestsTableProps {
  requests: Student[]
  onUpdateStatus: (
    id: string,
    status: RequestStatus,
    customMessage?: string,
  ) => Promise<StudentStatusUpdateResponse>
  onUpdateNotes: (id: string, notes: string) => Promise<void>
  onSendEmail: (id: string, message: string) => Promise<void>
}

export function RequestsTable({
  requests,
  onUpdateStatus,
  onUpdateNotes,
  onSendEmail,
}: RequestsTableProps) {
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null)

  const getProgramLabel = (student: Student) => student.program?.name ?? student.programId

  const getNotes = (student: Student) => editingNotes[student.id] ?? student.adminNotes ?? ''

  const showFeedback = (id: string, message: string, type: 'success' | 'error') => {
    setFeedback({ id, message, type })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleStatus = async (student: Student, status: RequestStatus) => {
    setLoadingId(student.id)

    try {
      const result = await onUpdateStatus(student.id, status, getNotes(student))

      if (status === 'accepted' || status === 'rejected') {
        if (result.emailSent) {
          showFeedback(student.id, 'تم تحديث الحالة وإرسال البريد بنجاح', 'success')
        } else if (result.emailError) {
          showFeedback(student.id, `تم تحديث الحالة، لكن فشل إرسال البريد: ${result.emailError}`, 'error')
        } else {
          showFeedback(student.id, 'تم تحديث الحالة', 'success')
        }
      }
    } catch (err) {
      showFeedback(
        student.id,
        err instanceof Error ? err.message : 'فشل تحديث الحالة',
        'error',
      )
    } finally {
      setLoadingId(null)
    }
  }

  const handleSaveNotes = async (id: string) => {
    setLoadingId(id)
    try {
      await onUpdateNotes(id, editingNotes[id] ?? '')
      showFeedback(id, 'تم حفظ الملاحظات', 'success')
    } catch (err) {
      showFeedback(id, err instanceof Error ? err.message : 'فشل حفظ الملاحظات', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const handleSendEmail = async (student: Student) => {
    if (!student.email) return

    setLoadingId(student.id)
    try {
      await onSendEmail(student.id, getNotes(student))
      showFeedback(student.id, 'تم إرسال البريد بنجاح', 'success')
    } catch (err) {
      showFeedback(
        student.id,
        err instanceof Error ? err.message : 'فشل إرسال البريد',
        'error',
      )
    } finally {
      setLoadingId(null)
    }
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-border bg-dark-card p-12 text-center">
        <p className="text-slate-400">لا توجد طلبات حالياً</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-dark-border">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-dark-border bg-dark-card text-slate-400">
            <th className="px-4 py-3 text-right font-medium">الطالب</th>
            <th className="px-4 py-3 text-right font-medium">العمر</th>
            <th className="px-4 py-3 text-right font-medium">ولي الأمر</th>
            <th className="px-4 py-3 text-right font-medium">البريد</th>
            <th className="px-4 py-3 text-right font-medium">واتساب</th>
            <th className="px-4 py-3 text-right font-medium">البرنامج</th>
            <th className="px-4 py-3 text-right font-medium">الحالة</th>
            <th className="px-4 py-3 text-right font-medium">التاريخ</th>
            <th className="px-4 py-3 text-right font-medium">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((student) => (
            <tr key={student.id} className="border-b border-dark-border/50 hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-medium text-white">{student.name}</td>
              <td className="px-4 py-3 text-slate-300">{student.age}</td>
              <td className="px-4 py-3 text-slate-300">{student.parentName}</td>
              <td className="px-4 py-3 text-slate-300" dir="ltr">{student.email || '—'}</td>
              <td className="px-4 py-3 text-slate-300" dir="ltr">{student.phone}</td>
              <td className="px-4 py-3 text-slate-300">{getProgramLabel(student)}</td>
              <td className="px-4 py-3"><Badge status={student.status} /></td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(student.createdAt).toLocaleDateString('ar-EG')}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant="success"
                    loading={loadingId === student.id}
                    disabled={!student.email}
                    onClick={() => handleStatus(student, 'accepted')}
                    title={student.email ? 'قبول وإرسال بريد' : 'لا يوجد بريد إلكتروني'}
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={loadingId === student.id}
                    disabled={!student.email}
                    onClick={() => handleStatus(student, 'rejected')}
                    title={student.email ? 'رفض وإرسال بريد' : 'لا يوجد بريد إلكتروني'}
                  >
                    <X size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    title={student.email ? 'إرسال بريد مخصص' : 'لا يوجد بريد إلكتروني'}
                    disabled={!student.email}
                    loading={loadingId === student.id}
                    onClick={() => handleSendEmail(student)}
                  >
                    <Mail size={14} />
                  </Button>
                  {student.status === 'accepted' && WHATSAPP_GROUP_LINK && (
                    <Button
                      size="sm"
                      variant="secondary"
                      title={`إضافة ${student.phone} لمجموعة الواتساب`}
                      onClick={() => openWhatsAppGroup()}
                    >
                      <Users size={14} />
                    </Button>
                  )}
                </div>
                <div className="mt-2 flex gap-1">
                  <input
                    type="text"
                    placeholder="رسالة بريد مخصصة..."
                    defaultValue={student.adminNotes ?? ''}
                    onChange={(e) =>
                      setEditingNotes((prev) => ({ ...prev, [student.id]: e.target.value }))
                    }
                    className="flex-1 rounded-lg border border-dark-border bg-dark px-2 py-1 text-xs text-slate-300 outline-none focus:border-primary-500"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveNotes(student.id)}
                    title="حفظ الملاحظات"
                  >
                    <Save size={14} />
                  </Button>
                </div>
                {feedback?.id === student.id && (
                  <p
                    className={`mt-2 text-xs ${
                      feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {feedback.message}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
