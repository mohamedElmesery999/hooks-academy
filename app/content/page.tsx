"use client"
import Link from 'next/link'
import { Clock, BarChart3 } from 'lucide-react'
import { COURSES } from '@/types/registration'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

const courseColors: Record<string, string> = {
  scratch: 'from-violet-500 to-purple-600',
  python: 'from-sky-500 to-blue-600',
  robot: 'from-emerald-500 to-teal-600',
  design: 'from-pink-500 to-rose-600',
  english: 'from-amber-500 to-orange-600',
  math: 'from-cyan-500 to-blue-500',
}

export default function Content() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <FadeIn className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">المحتوى التعليمي</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          دورات وبرامج متنوعة تناسب كل الأعمار والمستويات من 8 إلى 15 سنة.
        </p>
      </FadeIn>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course) => (
          <StaggerItem key={course.id}>
            <Card hover className="flex h-full flex-col">
              <div className={`mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br ${courseColors[course.image] ?? 'from-primary-500 to-primary-600'}`}>
                <span className="text-4xl font-bold text-white/90">{course.title.charAt(0)}</span>
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium text-primary-400">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{course.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">{course.description}</p>
              <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 size={14} />
                  {course.level}
                </span>
                <span>{course.ageRange}</span>
              </div>
              <Link href="/register">
                <Button size="sm" className="w-full">سجّل في هذه الدورة</Button>
              </Link>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
