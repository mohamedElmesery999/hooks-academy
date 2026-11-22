'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import type { StudentWork } from '@/lib/api-utils'
import { useStudentWorks } from '@/lib/hooks/api'

export function WorksGallery() {
  const { data: works = [], isLoading } = useStudentWorks()
  const [selected, setSelected] = useState<StudentWork | null>(null)

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

  if (isLoading) {
    return <p className="text-center text-slate-400">جاري تحميل الأعمال...</p>
  }

  if (works.length === 0) {
    return <p className="text-center text-slate-400">لا توجد أعمال بعد</p>
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <button
              type="button"
              onClick={() => setSelected(work)}
              className="relative block aspect-[16/10] w-full overflow-hidden"
            >
              <Image
                src={work.imageUrl}
                alt={work.title ?? work.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-70" />
            </button>

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{work.name}</p>
                {work.title && (
                  <p className="truncate text-xs text-slate-500">{work.title}</p>
                )}
              </div>
              {work.liveUrl && (
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-500/15 px-3 py-1.5 text-xs font-medium text-primary-300 transition-colors hover:bg-primary-500/25 hover:text-primary-200"
                >
                  <ExternalLink size={13} />
                  زيارة
                </a>
              )}
            </div>
          </motion.div>
        ))}
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
              aria-label={selected.title ?? selected.name}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative z-10 flex w-full max-w-4xl flex-col"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-dark-card p-3 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-primary-500/15 sm:p-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute end-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-dark/80 text-slate-300 backdrop-blur-sm transition-colors hover:bg-dark hover:text-white"
                  aria-label="إغلاق"
                >
                  <X size={16} />
                </button>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark">
                  <Image
                    src={selected.imageUrl}
                    alt={selected.title ?? selected.name}
                    width={1280}
                    height={800}
                    className="mx-auto h-auto max-h-[calc(85vh-5rem)] w-full object-contain"
                    priority
                  />
                </div>

                <div className="flex flex-col items-center gap-2 px-2 py-3 text-center sm:flex-row sm:justify-between sm:text-start">
                  <div>
                    <p className="text-base font-semibold text-white">{selected.name}</p>
                    {selected.title && (
                      <p className="text-sm text-slate-400">{selected.title}</p>
                    )}
                  </div>
                  {selected.liveUrl && (
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-400"
                    >
                      <ExternalLink size={15} />
                      زيارة الموقع
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
