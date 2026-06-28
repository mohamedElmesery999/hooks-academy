"use client"
import Link from 'next/link'
import {
  Code2, Bot, Palette, Languages, Calculator, Sun,
  type LucideIcon,
} from 'lucide-react'
import { SERVICES } from '@/types/registration'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

const iconMap: Record<string, LucideIcon> = {
  Code2, Bot, Palette, Languages, Calculator, Sun,
}

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <FadeIn className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">خدماتنا</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          برامج تعليمية متنوعة مصممة خصيصاً لتنمية مهارات الأطفال في مختلف المجالات.
        </p>
      </FadeIn>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = iconMap[service.icon] ?? Code2
          return (
            <StaggerItem key={service.id}>
              <Card hover={service.available} className={`group relative h-full ${!service.available ? 'opacity-75' : ''}`}>
                {!service.available && (
                  <span className="absolute left-4 top-4 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
                    قريباً
                  </span>
                )}
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${service.color} p-3 ${!service.available ? 'grayscale-[30%]' : ''}`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{service.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{service.description}</p>
                {service.available && (
                  <Link href="/register">
                    <Button size="sm" variant="secondary" className="group-hover:border-primary-500/50">
                      سجّل الآن
                    </Button>
                  </Link>
                )}
              </Card>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </div>
  )
}
