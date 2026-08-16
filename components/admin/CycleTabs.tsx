'use client'

import { Plus, Lock, Unlock } from 'lucide-react'
import type { Cycle } from '@/lib/api-utils'
import { Button } from '@/components/ui/Button'

interface CycleTabsProps {
  cycles: Cycle[]
  activeCycleId: string | null
  onSelect: (cycleId: string) => void
  onOpenNext: () => void
  opening?: boolean
}

export function CycleTabs({
  cycles,
  activeCycleId,
  onSelect,
  onOpenNext,
  opening,
}: CycleTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {cycles.map((cycle) => {
        const active = cycle.id === activeCycleId
        const isOpen = cycle.status === 'open'

        return (
          <button
            key={cycle.id}
            type="button"
            onClick={() => onSelect(cycle.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-primary-500/15 text-primary-400 ring-1 ring-primary-500/30'
                : 'bg-dark-card text-slate-400 ring-1 ring-dark-border hover:bg-white/5 hover:text-white'
            }`}
          >
            {isOpen ? <Unlock size={14} /> : <Lock size={14} />}
            {cycle.name}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                active ? 'bg-primary-500/20 text-primary-300' : 'bg-white/5 text-slate-500'
              }`}
            >
              {cycle._count?.students ?? 0}
            </span>
            {isOpen && (
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] text-emerald-400">
                جارية
              </span>
            )}
          </button>
        )
      })}

      <Button type="button" size="sm" variant="secondary" loading={opening} onClick={onOpenNext}>
        <Plus size={14} />
        إنهاء الدورة وفتح دورة جديدة
      </Button>
    </div>
  )
}
