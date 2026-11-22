'use client'

import { AdminShell } from '@/components/admin/AdminShell'
import { WorksManager } from '@/components/admin/WorksManager'
import { FadeIn } from '@/components/ui/FadeIn'

export default function WorksAdmin() {
  return (
    <AdminShell>
      <FadeIn>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">أعمال الطلاب</h2>
          <p className="mt-1 text-sm text-slate-400">
            أضف مشاريع ومواقع Portfolio الطلاب اللي تظهر في صفحة «أعمال الطلاب».
          </p>
        </div>
        <WorksManager />
      </FadeIn>
    </AdminShell>
  )
}
