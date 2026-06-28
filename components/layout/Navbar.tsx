"use client"
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'
import Image from 'next/image'

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/services', label: 'الخدمات' },
  { to: '/content', label: 'المحتوى' },
  { to: '/register', label: 'سجّل الآن' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-dark-border/60 bg-dark/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Hooks Academy" width={40} height={40} className="rounded-lg object-cover w-10 h-10" />
          <span className="hidden text-lg font-bold text-white sm:block">Hooks Academy</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              as={link.to === '/' ? undefined : link.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                link.to === '/' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/register">
            <Button size="sm">ابدأ التعلّم</Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-dark-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((link) => (
                  <Link
                  key={link.to}
                  href={link.to}
                  as={link.to === '/' ? undefined : link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    link.to === '/' ? 'text-primary-400 bg-primary-500/10' : 'text-slate-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
