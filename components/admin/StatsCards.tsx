import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { FadeIn } from '../ui/FadeIn'

interface StatsCardsProps {
  pending: number
  accepted: number
  rejected: number
}

const stats = [
  { key: 'pending' as const, label: 'قيد الانتظار', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'accepted' as const, label: 'مقبول', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'rejected' as const, label: 'مرفوض', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
]

export function StatsCards({ pending, accepted, rejected }: StatsCardsProps) {
  const values = { pending, accepted, rejected }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <FadeIn key={stat.key} delay={i * 0.1}>
          <Card>
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{values[stat.key]}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      ))}
    </div>
  )
}
