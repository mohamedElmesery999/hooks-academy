"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Award,
  Bot,
  Braces,
  Code,
  Code2,
  Cpu,
  FileText,
  Globe,
  Laptop,
  Monitor,
  Palette,
  Presentation,
  Rocket,
  Share2,
  Sparkles,
  Table,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { LEARNING_PATH } from '@/types/registration'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'

const iconMap: Record<string, LucideIcon> = {
  Award,
  Bot,
  Braces,
  Code,
  Code2,
  Cpu,
  FileText,
  Globe,
  Laptop,
  Monitor,
  Palette,
  Presentation,
  Rocket,
  Share2,
  Sparkles,
  Table,
  Trophy,
}

export default function Content() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(192,38,211,0.08)_0%,transparent_45%)]" />

      <div className="page-container max-w-7xl sm:py-20">
        <FadeIn className="mb-10 text-center sm:mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-base font-medium text-primary-400 sm:text-sm"
          >
            <Sparkles size={16} />
            رحلة تعلّم متكاملة
          </motion.span>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
            ماذا سيتعلّم{' '}
            <span className="text-primary-400">الطالب؟</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-lg">
            من أساسيات الحاسوب و ICDL إلى البرمجة وبناء موقع شخصي — مسار واضح
            خطوة بخطوة حتى يصل الطالب لإنجاز حقيقي يفتخر به.
          </p>
        </FadeIn>

        <div className="relative space-y-6 sm:space-y-14">
          <div
            aria-hidden
            className="absolute top-8 bottom-8 hidden w-px bg-gradient-to-b from-primary-500/50 via-accent-purple/40 to-emerald-500/50 sm:block start-8"
          />

          {LEARNING_PATH.map((phase, phaseIndex) => {
            const PhaseIcon = iconMap[phase.icon] ?? Monitor
            const isFinal = phaseIndex === LEARNING_PATH.length - 1

            return (
              <FadeIn key={phase.id} delay={phaseIndex * 0.12}>
                <motion.article
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 32 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className={`relative rounded-2xl border border-dark-border/80 bg-dark-card/80 p-4 backdrop-blur-sm sm:rounded-3xl sm:p-8 ${
                    isFinal ? 'overflow-hidden ring-1 ring-emerald-500/20' : ''
                  }`}
                >
                  {isFinal && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-primary-500/10"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                    <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-center sm:pt-1">
                      <motion.div
                        whileHover={{ scale: 1.06 }}
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${phase.gradient} shadow-lg ${phase.glow} sm:h-16 sm:w-16`}
                      >
                        <PhaseIcon size={28} className="text-white" />
                        <motion.span
                          className="absolute -inset-1 rounded-2xl border border-white/20"
                          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </motion.div>
                      <span className="rounded-full border border-dark-border bg-dark/60 px-3 py-1 text-sm font-bold text-slate-400 sm:text-xs sm:text-center">
                        المرحلة {phase.step}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-base font-semibold text-primary-400 sm:text-sm">{phase.subtitle}</p>
                      <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{phase.title}</h2>
                      <p className="mb-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:mb-6 sm:text-base">
                        {phase.description}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {phase.topics.map((topic, topicIndex) => {
                          const TopicIcon = iconMap[topic.icon] ?? Sparkles

                          return (
                            <motion.div
                              key={topic.id}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.45,
                                delay: phaseIndex * 0.08 + topicIndex * 0.07,
                              }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              className="group rounded-xl border border-dark-border/70 bg-dark/50 p-3.5 transition-colors hover:border-primary-500/40 hover:bg-dark-card sm:rounded-2xl sm:p-4"
                            >
                              <div className="mb-2.5 flex items-center gap-3 sm:mb-3">
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${phase.gradient} opacity-90 transition-opacity group-hover:opacity-100 sm:h-10 sm:w-10`}
                                >
                                  <TopicIcon size={20} className="text-white" />
                                </div>
                                <h3 className="text-base font-semibold text-white sm:text-base">{topic.title}</h3>
                              </div>
                              <p className="text-sm leading-relaxed text-slate-400 sm:text-sm">
                                {topic.subtitle}
                              </p>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.3} className="mt-10 sm:mt-16">
          <motion.div
            whileInView={{ scale: [0.98, 1] }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-l from-primary-500/10 via-dark-card to-accent-purple/10 p-6 text-center sm:rounded-3xl sm:p-10"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_65%)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">
              <Globe size={40} className="mx-auto mb-4 text-primary-400" />
              <h2 className="mb-3 text-xl font-bold text-white sm:text-3xl">
                من الصفر إلى موقعك الشخصي
              </h2>
              <p className="mx-auto mb-6 max-w-xl text-base text-slate-400 sm:mb-8">
                كل طالب ينهي الرحلة ومعه مشروع Portfolio حقيقي — دليل على ما تعلّمه
                وإنجاز يفتخر به أمام عائلته.
              </p>
              <Link href="/register">
                <Button size="lg">ابدأ رحلة التعلّم</Button>
              </Link>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  )
}
