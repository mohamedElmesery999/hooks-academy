import type { RequestStatus } from '../../types/registration'

const styles: Record<RequestStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const labels: Record<RequestStatus, string> = {
  pending: 'قيد الانتظار',
  accepted: 'مقبول',
  rejected: 'مرفوض',
}

export function Badge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
