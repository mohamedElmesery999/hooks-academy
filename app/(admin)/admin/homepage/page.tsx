'use client'

import { AdminShell } from '@/components/admin/AdminShell'
import { ContentManager } from '@/components/admin/ContentManager'
import { FadeIn } from '@/components/ui/FadeIn'

export default function HomepageContentAdmin() {
  return (
    <AdminShell>
      <FadeIn>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">إدارة الشاشة الرئيسية</h2>
          <p className="mt-1 text-sm text-slate-400">
            أضف فيديوهات يوتيوب وصور آراء الطلاب اللي تظهر في الصفحة الرئيسية.
          </p>
        </div>
        <ContentManager />
      </FadeIn>
    </AdminShell>
  )
}
