"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, CheckCircle, UserRound, Phone } from 'lucide-react'
import { registerStudentSchema } from '@/lib/validations/students'
import { usePrograms, useRegisterStudent } from '@/lib/hooks/api'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/ui/FadeIn'

const schema = registerStudentSchema

type FormData = z.infer<typeof schema>

export default function Register() {
  const [submitted, setSubmitted] = useState(false)

  const {
    data: programs = [],
    isLoading: programsLoading,
    isError: programsError,
  } = usePrograms()

  const registerMutation = useRegisterStudent({
    onSuccess: () => setSubmitted(true),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const programOptions = programs.map((p) => ({ value: p.id, label: p.name }))

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">تم إرسال طلبك بنجاح!</h2>
          <p className="mb-6 text-slate-400">
            تم استلام طلب تسجيل {getValues('student_name')}. سيتواصل معكم فريق Hooks Academy قريباً.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              registerMutation.reset()
            }}
            variant="secondary"
          >
            تسجيل طالب آخر
          </Button>
        </motion.div>
      </div>
    )
  }

  const error =
    programsError
      ? 'تعذر تحميل البرامج المتاحة. يرجى المحاولة لاحقاً.'
      : registerMutation.error?.message ?? null

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.1)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(192,38,211,0.06)_0%,_transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <FadeIn className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-400">
            للأطفال من 8 إلى 15 سنة
          </span>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">تسجيل طالب جديد</h1>
          <p className="mx-auto max-w-xl text-base text-slate-400">
            املأ النموذج وسيتواصل معكم فريق الأكاديمية لتأكيد التسجيل.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="overflow-hidden border-dark-border/80 p-0 shadow-2xl shadow-black/25">
            <div className="border-b border-dark-border/80 bg-gradient-to-l from-primary-500/[0.07] to-accent-purple/[0.05] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400">
                  <UserRound size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-white">نموذج التسجيل</h2>
                  <p className="text-sm text-slate-500">جميع الحقول المميزة بـ * مطلوبة</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6 sm:p-8">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-primary-400">
                  معلومات الطالب
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Input
                    id="student_name"
                    label="اسم الطالب *"
                    placeholder="محمد أحمد"
                    error={errors.student_name?.message}
                    {...register('student_name')}
                  />
                  <Input
                    id="parent_name"
                    label="اسم ولي الأمر *"
                    placeholder="أحمد محمد"
                    error={errors.parent_name?.message}
                    {...register('parent_name')}
                  />
                  <Input
                    id="age"
                    label="العمر *"
                    type="number"
                    min={8}
                    max={15}
                    placeholder="10"
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary-400">
                  <Phone size={15} />
                  بيانات التواصل والبرنامج
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="md:col-span-2 lg:col-span-1">
                    <Input
                      id="email"
                      label="البريد الإلكتروني *"
                      type="email"
                      placeholder="parent@example.com"
                      dir="ltr"
                      className="text-left"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                  <Input
                    id="phone"
                    label="رقم الواتساب *"
                    hint="للانضمام للمجموعة عند القبول"
                    hintInline
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="text-left"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className="md:col-span-2 lg:col-span-1">
                    <Select
                      id="program"
                      label="البرنامج المطلوب *"
                      options={programOptions}
                      disabled={programsLoading || programOptions.length === 0}
                      error={errors.program?.message}
                      {...register('program')}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <Textarea
                  id="notes"
                  label="ملاحظات (اختياري)"
                  placeholder="أي معلومات إضافية..."
                  error={errors.notes?.message}
                  {...register('notes')}
                />
              </section>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="border-t border-dark-border/80 pt-6 flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  loading={registerMutation.isPending}
                  className="w-full sm:w-auto sm:min-w-[220px] mx-auto"
                >
                  <Send size={18} />
                  إرسال الطلب
                </Button>
              </div>
            </form>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
