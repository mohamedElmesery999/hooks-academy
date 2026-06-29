import { Clock, CheckCircle, XCircle, LayoutGrid } from 'lucide-react'
import type { RequestStatus } from '@/lib/api-utils'
import { Card } from '../ui/Card'
import { FadeIn } from '../ui/FadeIn'

export type StatsFilter = 'all' | RequestStatus

interface StatsCardsProps {
  total: number
  pending: number
  accepted: number
  rejected: number
  activeFilter: StatsFilter
  onFilterChange: (filter: StatsFilter) => void
}

const stats: {
  key: StatsFilter
  label: string
  icon: typeof Clock
  color: string
  bg: string
  activeRing: string
}[] = [
  {
    key: 'all',
    label: 'الكل',
    icon: LayoutGrid,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    activeRing: 'ring-primary-500/50',
  },
  {
    key: 'pending',
    label: 'قيد الانتظار',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    activeRing: 'ring-amber-500/50',
  },
  {
    key: 'accepted',
    label: 'مقبول',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    activeRing: 'ring-emerald-500/50',
  },
  {
    key: 'rejected',
    label: 'مرفوض',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    activeRing: 'ring-red-500/50',
  },
]

export function StatsCards({
  total,
  pending,
  accepted,
  rejected,
  activeFilter,
  onFilterChange,
}: StatsCardsProps) {
  const values: Record<StatsFilter, number> = { all: total, pending, accepted, rejected }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const isActive = activeFilter === stat.key

        return (
          <FadeIn key={stat.key} delay={i * 0.1}>
            <button
              type="button"
              onClick={() => onFilterChange(stat.key)}
              className="w-full text-right"
            >
              <Card
                className={`cursor-pointer transition-all hover:border-white/10 ${
                  isActive ? `ring-2 ${stat.activeRing} border-transparent` : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{values[stat.key]}</p>
                    <p className={`text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          </FadeIn>
        )
      })}
    </div>
  )
}
