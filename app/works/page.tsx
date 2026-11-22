"use client"
import { motion } from 'framer-motion'
import { Rocket, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { WorksGallery } from '@/components/home/WorksGallery'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'

export default function Works() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(192,38,211,0.08)_0%,transparent_45%)]" />

      <div className="page-container max-w-7xl sm:py-20">
        <FadeIn className="mb-10 text-center sm:mb-14">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-base font-medium text-primary-400 sm:text-sm"
          >
            <Sparkles size={16} />
            إبداعات طلابنا
          </motion.span>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
            أعمال{' '}
            <span className="text-primary-400">الطلاب</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-lg">
            مواقع ومشاريع Portfolio حقيقية صمّمها طلاب Hooks Academy بأنفسهم بعد إتمام رحلة
            البرمجة. اضغط على أي عمل لمشاهدته أو زيارة الموقع.
          </p>
        </FadeIn>

        <WorksGallery />

        <FadeIn delay={0.2} className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-l from-primary-500/10 via-dark-card to-accent-purple/10 p-6 text-center sm:rounded-3xl sm:p-10">
            <Rocket size={40} className="mx-auto mb-4 text-primary-400" />
            <h2 className="mb-3 text-xl font-bold text-white sm:text-3xl">
              عايز طفلك يبقى عنده مشروعه الخاص؟
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-base text-slate-400 sm:mb-8">
              سجّل الآن وانضم لرحلة البرمجة في Hooks Academy، وخلّي طفلك ينهي الدورة ومعه موقع
              حقيقي يفتخر بيه.
            </p>
            <Link href="/register">
              <Button size="lg" variant="success">
                ابدأ التسجيل
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
