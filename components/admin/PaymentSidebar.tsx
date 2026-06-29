'use client'

import { Banknote, CircleDollarSign, Wallet } from 'lucide-react'
import type { Student } from '@/lib/api-utils'
import {
  formatEgp,
  sumPaidAmounts,
  sumRemainingAmounts,
  sumTotalAmounts,
  toAmount,
} from '@/lib/payments'

interface PaymentSidebarProps {
  students: Student[]
  filterLabel?: string
}

export function PaymentSidebar({ students, filterLabel = 'كل الطلبات' }: PaymentSidebarProps) {
  const totalExpected = sumTotalAmounts(students)
  const totalPaid = sumPaidAmounts(students)
  const totalRemaining = sumRemainingAmounts(students)
  const paidPercent = totalExpected > 0 ? Math.min(100, Math.round((totalPaid / totalExpected) * 100)) : 0
  const withPayments = students.filter(
    (s) => toAmount(s.totalAmount) > 0 || toAmount(s.paidAmount) > 0,
  ).length

  return (
    <aside className="overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-b from-dark-card to-dark shadow-lg shadow-primary-500/5">
      <div className="border-b border-primary-500/15 bg-primary-500/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/20 ring-1 ring-primary-500/30">
            <Banknote size={22} className="text-primary-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">ملخص المدفوعات</h3>
            <p className="text-xs text-slate-400">{filterLabel}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400/90">
            <Wallet size={16} />
            <span className="text-xs font-medium">المدفوع</span>
          </div>
          <p className="text-2xl font-bold text-emerald-300">{formatEgp(totalPaid)}</p>
        </div>

        <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-400/90">
            <CircleDollarSign size={16} />
            <span className="text-xs font-medium">المتبقي</span>
          </div>
          <p className="text-2xl font-bold text-sky-300">{formatEgp(totalRemaining)}</p>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark/50 p-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>الإجمالي المتوقع</span>
            <span className="font-medium text-slate-300">{formatEgp(totalExpected)}</span>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">نسبة التحصيل</span>
              <span className="font-semibold text-primary-300">{paidPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-dark-border">
              <div
                className="h-full rounded-full bg-gradient-to-l from-primary-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          {withPayments} طلب بمدفوعات من أصل {students.length}
        </p>
      </div>
    </aside>
  )
}
