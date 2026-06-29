'use client'

import { useEffect, useState } from 'react'
import { Calculator, Save } from 'lucide-react'
import type { Student } from '@/lib/api-utils'
import { calculateRemaining, formatEgp, toAmount } from '@/lib/payments'

type PaymentDraft = {
  totalAmount: string
  paidAmount: string
}

interface RequestPaymentFieldsProps {
  student: Student
  onSave: (id: string, totalAmount: number, paidAmount: number) => Promise<void>
}

function toDraft(student: Student): PaymentDraft {
  return {
    totalAmount: student.totalAmount != null ? String(student.totalAmount) : '',
    paidAmount: student.paidAmount != null ? String(student.paidAmount) : '',
  }
}

const inputClass =
  'w-full min-w-0 rounded-lg border border-dark-border bg-dark px-2.5 py-2 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20'

const fieldLabelClass = 'mb-1 block text-[10px] text-slate-500'

export function RequestPaymentFields({ student, onSave }: RequestPaymentFieldsProps) {
  const [draft, setDraft] = useState<PaymentDraft>(() => toDraft(student))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(toDraft(student))
    setError(null)
    setSaved(false)
  }, [student.id, student.totalAmount, student.paidAmount])

  const total = toAmount(draft.totalAmount)
  const paid = toAmount(draft.paidAmount)
  const remaining = calculateRemaining(total, paid)
  const paidExceedsTotal = paid > total && total > 0

  const handleSave = async () => {
    if (paidExceedsTotal) {
      setError('المبلغ المدفوع لا يمكن أن يكون أكبر من الإجمالي')
      return
    }

    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      await onSave(student.id, total, paid)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حفظ المدفوعات')
    } finally {
      setSaving(false)
    }
  }

  const feedback = paidExceedsTotal
    ? 'المدفوع أكبر من الإجمالي'
    : error
      ? error
      : saved
        ? 'تم الحفظ'
        : null

  const feedbackTone = paidExceedsTotal
    ? 'text-amber-400'
    : error
      ? 'text-red-400'
      : 'text-emerald-400'

  return (
    <div className="mb-4 rounded-xl border border-dark-border/70 bg-dark/30 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex shrink-0 items-center gap-1.5 self-center pe-1 text-slate-500">
          <Calculator size={14} className="text-primary-400" />
          <span className="text-[11px] font-medium whitespace-nowrap">المدفوعات</span>
        </div>

        <label className="min-w-[5.5rem] flex-1">
          <span className={fieldLabelClass}>الإجمالي</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={draft.totalAmount}
            onChange={(e) => setDraft((prev) => ({ ...prev, totalAmount: e.target.value }))}
            placeholder="5000"
            className={inputClass}
          />
        </label>

        <label className="min-w-[5.5rem] flex-1">
          <span className={fieldLabelClass}>المدفوع</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={draft.paidAmount}
            onChange={(e) => setDraft((prev) => ({ ...prev, paidAmount: e.target.value }))}
            placeholder="3000"
            className={inputClass}
          />
        </label>

        <div className="min-w-[5.5rem] flex-1">
          <span className={fieldLabelClass}>المتبقي</span>
          <div className="flex min-h-[2.5rem] items-center rounded-lg border border-primary-500/20 bg-primary-500/5 px-2.5 py-2">
            <p className="truncate text-sm font-semibold text-primary-300">{formatEgp(remaining)}</p>
          </div>
        </div>

        <button
          type="button"
          disabled={saving || paidExceedsTotal}
          onClick={() => void handleSave()}
          title="حفظ المدفوعات"
          className="inline-flex h-[2.5rem] shrink-0 items-center gap-1.5 self-end rounded-lg border border-dark-border bg-dark-card px-4 text-xs font-medium text-slate-300 transition-all hover:border-primary-500/40 hover:bg-primary-500/10 hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500/30 border-t-slate-300" />
          ) : (
            <Save size={14} />
          )}
          حفظ
        </button>

        {feedback && (
          <p className={`w-full text-end text-[10px] ${feedbackTone}`}>{feedback}</p>
        )}
      </div>
    </div>
  )
}
