'use client'

import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'success' | 'danger'
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  loading,
  variant = 'success',
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, loading])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="إغلاق"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => !loading && onClose()}
              className="absolute end-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="mb-2 pe-8 text-lg font-bold text-white">{title}</h2>
            {description && (
              <p className="mb-4 text-sm leading-relaxed text-slate-400">{description}</p>
            )}
            {children}

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant={variant === 'danger' ? 'danger' : 'success'}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
