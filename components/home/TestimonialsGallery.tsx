'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { HOME_TESTIMONIALS } from '@/types/registration'

type Testimonial = (typeof HOME_TESTIMONIALS)[number]

const PAGE_SIZE = 4

export function TestimonialsGallery() {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Testimonial | null>(null)

  const totalPages = Math.max(1, Math.ceil(HOME_TESTIMONIALS.length / PAGE_SIZE))

  const visible = useMemo(() => {
    const start = page * PAGE_SIZE
    return HOME_TESTIMONIALS.slice(start, start + PAGE_SIZE)
  }, [page])

  const goPrev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1))
  const goNext = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1))

  useEffect(() => {
    if (!selected) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  return (
    <>
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={goNext}
            aria-label="التالي"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dark-border bg-dark-card text-slate-300 transition-colors hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-primary-400 sm:h-12 sm:w-12"
          >
            <ChevronRight size={22} />
          </button>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
              >
                {visible.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className="group relative w-full overflow-hidden rounded-2xl border border-dark-border bg-dark-card text-start transition-all hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80" />
                      <span className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-dark/70 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <ZoomIn size={14} />
                      </span>
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                      <p className="truncate text-xs text-slate-500">{item.role}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="السابق"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dark-border bg-dark-card text-slate-300 transition-colors hover:border-primary-500/50 hover:bg-primary-500/10 hover:text-primary-400 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`صفحة ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page ? 'w-6 bg-primary-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.button
              type="button"
              aria-label="إغلاق"
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.alt}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative z-10 flex w-full max-w-[26rem] flex-col"
            >
              <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-primary-500/20 via-transparent to-accent-purple/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-dark-card p-3 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-primary-500/15 sm:p-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute end-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-dark/80 text-slate-300 backdrop-blur-sm transition-colors hover:bg-dark hover:text-white"
                  aria-label="إغلاق"
                >
                  <X size={16} />
                </button>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark shadow-inner">
                  <Image
                    src={selected.image}
                    alt={selected.alt}
                    width={720}
                    height={1280}
                    className="mx-auto h-auto max-h-[calc(92vh-2rem)] w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
