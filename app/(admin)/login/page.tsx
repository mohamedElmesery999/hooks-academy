"use client"

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, Lock } from 'lucide-react'
import { loginAdmin } from '@/lib/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const schema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

type FormData = z.infer<typeof schema>

/** Keep the welcome splash visible after a successful login. */
const WELCOME_DURATION_MS = 2200

function safeRedirectPath(from: string | null) {
  if (!from || !from.startsWith('/') || from.startsWith('//')) return '/admin'
  return from
}

function WelcomeSplash() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_60%)]" />
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.35 }}
      >
        <motion.img
          src="/logo.png"
          alt="Hooks Academy"
          className="h-28 w-28 rounded-2xl object-cover shadow-lg shadow-primary-500/20"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.p
          className="relative mt-1 bg-gradient-to-l from-primary-300 via-sky-300 to-violet-300 bg-clip-text text-center text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.35)] sm:text-4xl"
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.03, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          Welcome Back Ya basha
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-2 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-primary-400/70 to-transparent"
          />
        </motion.p>
        <motion.p
          className="text-sm text-slate-400"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        >
          جاري الدخول...
        </motion.p>
      </motion.div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)

    const success = await loginAdmin(data.email, data.password)

    if (!success) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      return
    }

    const next = safeRedirectPath(searchParams.get('from'))
    setShowWelcome(true)

    window.setTimeout(() => {
      router.replace(next)
      router.refresh()
    }, WELCOME_DURATION_MS)
  }

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <WelcomeSplash key="welcome" />
      ) : (
        <motion.div
          key="form"
          className="relative flex h-full flex-1 items-center justify-center overflow-hidden bg-dark px-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_60%)]" />

          <div className="relative w-full max-w-lg">
            <div className="mb-6 text-center">
              <img
                src="/logo.png"
                alt="Hooks Academy"
                className="mx-auto mb-3 h-40 w-40 rounded-xl object-cover"
              />
              <h1 className="text-2xl font-bold text-white">لوحة تحكم الأدمن</h1>
              <p className="mt-1.5 text-sm text-slate-400">سجّل دخولك لإدارة طلبات التسجيل</p>
            </div>

            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="hooks@gmail.com"
                  dir="ltr"
                  className="text-left"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  id="password"
                  label="كلمة المرور"
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  className="text-left"
                  error={errors.password?.message}
                  {...register('password')}
                />

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" loading={isSubmitting} className="mt-4 w-full bg-primary-500/10">
                  <LogIn size={18} />
                  تسجيل الدخول
                </Button>
              </form>
            </Card>

            <p className="mt-4 flex items-center justify-center gap-2 text-lg text-slate-500">
              <Lock size={12} />
              هذه الصفحة للمسؤولين فقط
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-dark">
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
