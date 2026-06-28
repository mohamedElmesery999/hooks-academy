"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
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
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <FadeIn className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">تسجيل طالب جديد</h1>
        <p className="text-lg text-slate-400">
          املأ النموذج وسيتواصل معكم فريق الأكاديمية لتأكيد التسجيل.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="student_name"
                label="اسم الطالب *"
                placeholder="محمد أحمد"
                error={errors.student_name?.message}
                {...register('student_name')}
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

            <Input
              id="parent_name"
              label="اسم ولي الأمر *"
              placeholder="أحمد محمد"
              error={errors.parent_name?.message}
              {...register('parent_name')}
            />

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

            <Input
              id="phone"
              label="رقم الواتساب (للانضمام للمجموعة عند القبول) *"
              placeholder="01xxxxxxxxx"
              dir="ltr"
              className="text-left"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Select
              id="program"
              label="البرنامج المطلوب *"
              options={programOptions}
              disabled={programsLoading || programOptions.length === 0}
              error={errors.program?.message}
              {...register('program')}
            />

            <Textarea
              id="notes"
              label="ملاحظات (اختياري)"
              placeholder="أي معلومات إضافية..."
              error={errors.notes?.message}
              {...register('notes')}
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={registerMutation.isPending}
              className="w-full"
            >
              <Send size={18} />
              إرسال الطلب
            </Button>
          </form>
        </Card>
      </FadeIn>
    </div>
  )
}
