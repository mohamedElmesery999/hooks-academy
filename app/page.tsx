"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Users, BookOpen, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/FadeIn'

const features = [
  {
    icon: Sparkles,
    title: 'تعلّم تفاعلي',
    description: 'دروس ممتعة تجمع بين اللعب والتعلّم لتحفيز الإبداع.',
  },
  {
    icon: Users,
    title: 'مجموعات صغيرة',
    description: 'اهتمام فردي لكل طالب في مجموعات محدودة العدد.',
  },
  {
    icon: BookOpen,
    title: 'محتوى متنوع',
    description: 'برمجة، روبوتات، تصميم، لغات، ورياضيات.',
  },
  {
    icon: Trophy,
    title: 'شهادات وإنجازات',
    description: 'مكافآت وشهادات تحفّز الطلاب على الاستمرار.',
  },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(192,38,211,0.08)_0%,_transparent_50%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:py-28">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-right"
          >
            <span className="mb-4 inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-400">
              للأطفال من 8 إلى 15 سنة
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              اكتشف عالم{' '}
              <span className="gradient-text">المستقبل</span>
              <br />
              مع Hooks Academy
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0 mx-auto">
              أكاديمية تعليمية متخصصة في تقديم محتوى تفاعلي وممتع يبني مهارات التفكير
              والإبداع والبرمجة لدى الأطفال.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link href="/register">
                <Button size="lg">سجّل طفلك الآن</Button>
              </Link>
              <Link href="/content">
                <Button size="lg" variant="secondary">
                  استكشف المحتوى
                  <ArrowLeft size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex-shrink-0"
          >
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent-orange/20 via-primary-500/20 to-accent-purple/20 blur-2xl" />
            <motion.img
              src="/logo.png"
              alt="Hooks Academy"
              className="relative h-64 w-64 rounded-3xl object-cover shadow-2xl sm:h-80 sm:w-80"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">لماذا Hooks Academy؟</h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            نؤمن أن التعلّم يجب أن يكون مغامرة ممتعة، لذلك صممنا برامجنا لتناسب عقول الأطفال الفضولية.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card hover className="h-full text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
                  <feature.icon size={28} className="text-primary-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-y border-dark-border bg-dark-card/50 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold text-white">جاهز تبدأ المغامرة؟</h2>
            <p className="mb-8 text-slate-400">سجّل طفلك الآن وانضم لعائلة Hooks Academy</p>
            <Link href="/register">
              <Button size="lg">ابدأ التسجيل</Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
