"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
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

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)

    const success = loginAdmin(data.email, data.password)

    if (!success) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      return
    }

    router.push('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Hooks Academy" className="mx-auto mb-4 h-16 w-16 rounded-xl object-cover" />
          <h1 className="text-2xl font-bold text-white">لوحة تحكم الأدمن</h1>
          <p className="mt-2 text-sm text-slate-400">سجّل دخولك لإدارة طلبات التسجيل</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              <LogIn size={18} />
              تسجيل الدخول
            </Button>
          </form>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock size={12} />
          هذه الصفحة للمسؤولين فقط
        </p>
      </motion.div>
    </div>
  )
}
