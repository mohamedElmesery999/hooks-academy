import type { Student } from '@/lib/api-utils'

export function toAmount(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

export function calculateRemaining(total: number, paid: number): number {
  return Math.max(0, total - paid)
}

export function formatEgp(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function sumTotalAmounts(students: Pick<Student, 'totalAmount'>[]): number {
  return students.reduce((sum, student) => sum + toAmount(student.totalAmount), 0)
}

export function sumPaidAmounts(students: Pick<Student, 'paidAmount'>[]): number {
  return students.reduce((sum, student) => sum + toAmount(student.paidAmount), 0)
}

export function sumRemainingAmounts(
  students: Pick<Student, 'totalAmount' | 'paidAmount'>[],
): number {
  return students.reduce(
    (sum, student) =>
      sum + calculateRemaining(toAmount(student.totalAmount), toAmount(student.paidAmount)),
    0,
  )
}
