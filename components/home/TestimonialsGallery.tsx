'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ZoomIn } from 'lucide-react'
import { HOME_TESTIMONIALS } from '@/types/registration'
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

type Testimonial = (typeof HOME_TESTIMONIALS)[number]

export function TestimonialsGallery() {
  const [selected, setSelected] = useState<Testimonial | null>(null)

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
      <StaggerContainer className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {HOME_TESTIMONIALS.map((item) => (
          <StaggerItem key={item.id}>
            <button
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
          </StaggerItem>
        ))}
      </StaggerContainer>

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

              <div className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-dark-card shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-primary-500/15">
                <div className="relative shrink-0 border-b border-white/5 bg-gradient-to-l from-primary-500/10 via-dark-card to-accent-purple/10 px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-purple text-sm font-bold text-white shadow-lg shadow-primary-500/20">
                      {selected.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-white">{selected.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <MessageCircle size={12} className="text-emerald-400" />
                        <span>{selected.role}</span>
                        <span className="text-slate-600">•</span>
                        <span>محادثة واتساب</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="إغلاق"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#0a0d12] p-3 sm:p-4">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark shadow-inner">
                    <Image
                      src={selected.image}
                      alt={selected.alt}
                      width={720}
                      height={1280}
                      className="mx-auto h-auto max-h-[calc(92vh-7.5rem)] w-full object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
