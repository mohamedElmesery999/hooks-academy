'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { StudentWork } from '@/lib/api-utils'
import { useStudentWorks } from '@/lib/hooks/api'

function hostname(url?: string | null) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function cardsOf(scroller: HTMLElement) {
  return [...scroller.querySelectorAll<HTMLElement>('[data-card]')]
}

/** أقرب كارت لحافة البداية (اليمين في الصفحة العربية). */
function indexAtStart(scroller: HTMLElement) {
  const edge = scroller.getBoundingClientRect().right
  let best = 0
  let bestDist = Infinity
  cardsOf(scroller).forEach((card, i) => {
    const dist = Math.abs(card.getBoundingClientRect().right - edge)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  return best
}

export function WorksGallery() {
  const { data: works = [], isLoading } = useStudentWorks()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cards = cardsOf(scroller)
    if (cards.length === 0) return

    const view = scroller.getBoundingClientRect()
    const first = cards[0].getBoundingClientRect()
    const last = cards[cards.length - 1].getBoundingClientRect()
    const pad = 8

    setCanPrev(first.right > view.right + pad)
    setCanNext(last.left < view.left - pad)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateArrows()
    scroller.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)

    return () => {
      scroller.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows, works.length])

  const scrollByCard = (delta: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cards = cardsOf(scroller)
    if (cards.length === 0) return

    const next = Math.max(0, Math.min(cards.length - 1, indexAtStart(scroller) + delta))
    cards[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  if (isLoading) {
    return <p className="text-center text-slate-400">جاري تحميل الأعمال...</p>
  }

  if (works.length === 0) {
    return <p className="text-center text-slate-400">لا توجد أعمال بعد</p>
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        aria-label="الأعمال السابقة"
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-border bg-dark-card text-white shadow-lg transition-all hover:border-primary-500/60 hover:bg-primary-500 disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollerRef}
        dir="rtl"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            scrollByCard(1)
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            scrollByCard(-1)
          }
        }}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-4 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {works.map((work, i) => {
          const host = hostname(work.liveUrl)

          const content = (
            <>
              <div className="flex items-center gap-2 border-b border-dark-border bg-dark/70 px-5 py-3.5">
                <span className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                </span>
                {host && (
                  <span
                    dir="ltr"
                    className="ms-auto truncate rounded-md bg-dark px-3 py-1 text-xs text-slate-300"
                  >
                    {host}
                  </span>
                )}
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark">
                <div className="absolute inset-x-0 top-0 h-[235%] transition-transform duration-[4500ms] ease-linear group-hover:-translate-y-[57.5%]">
                  <Image
                    src={work.imageUrl}
                    alt={work.title ?? work.name}
                    fill
                    sizes="(max-width: 640px) 86vw, 520px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-dark/35 opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100" />
                {work.liveUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex scale-90 items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-white opacity-0 shadow-xl shadow-primary-500/40 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ExternalLink size={18} />
                      زيارة الموقع المباشر
                    </span>
                  </div>
                )}
                {work.liveUrl && (
                  <span className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-dark/80 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm ring-1 ring-emerald-400/30">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    مباشر
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 px-5 py-5">
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-white">{work.name}</p>
                  {work.title && (
                    <p className="mt-1 truncate text-sm text-slate-400">{work.title}</p>
                  )}
                </div>
                {work.liveUrl && (
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 text-slate-500 transition-all duration-300 group-hover:rotate-45 group-hover:text-primary-300"
                  />
                )}
              </div>
            </>
          )

          const shell = (
            <>
              <div className="overflow-hidden rounded-2xl bg-dark-card [clip-path:inset(0_round_1rem)]">
                {content}
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-dark-border transition-shadow duration-300 group-hover:ring-primary-500/70" />
            </>
          )

          const cardClass =
            'group relative block rounded-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/25'

          return (
            <motion.div
              key={work.id}
              data-card
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.08 }}
              className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)]"
            >
              {work.liveUrl ? (
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {shell}
                </a>
              ) : (
                <div className={cardClass}>{shell}</div>
              )}
            </motion.div>
          )
        })}
      </div>

      <button
        type="button"
        aria-label="الأعمال التالية"
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dark-border bg-dark-card text-white shadow-lg transition-all hover:border-primary-500/60 hover:bg-primary-500 disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  )
}
