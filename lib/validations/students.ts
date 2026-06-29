import { z } from 'zod'

export const registerStudentSchema = z.object({
  student_name: z.string().min(2, 'اسم الطالب مطلوب (حرفين على الأقل)'),
  age: z
    .number({ error: 'العمر مطلوب' })
    .int()
    .min(8, 'الحد الأدنى 8 سنوات')
    .max(15, 'الحد الأقصى 15 سنة'),
  parent_name: z.string().min(2, 'اسم ولي الأمر مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z
    .string()
    .min(10, 'رقم الهاتف غير صحيح')
    .regex(/^[\d+\s-]+$/, 'رقم الهاتف غير صحيح'),
  program: z.string().min(1, 'يرجى اختيار البرنامج'),
  notes: z.string().optional(),
})

export const createStudentSchema = z.object({
  name: z.string().min(2),
  parentName: z.string().min(2),
  age: z.number().int().min(8).max(15),
  email: z.string().email(),
  phone: z.string().min(10),
  programId: z.string().uuid(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'rejected']).optional(),
})

export const updateStudentSchema = z
  .object({
    name: z.string().min(2),
    parentName: z.string().min(2),
    age: z.number().int().min(8).max(15),
    email: z.string().email(),
    phone: z.string().min(10),
    programId: z.string().uuid(),
    notes: z.string().nullable(),
    adminNotes: z.string().nullable(),
    totalAmount: z.number().nonnegative().nullable(),
    paidAmount: z.number().nonnegative().nullable(),
    status: z.enum(['pending', 'accepted', 'rejected']),
  })
  .partial()
  .refine(
    (data) => {
      if (data.totalAmount == null || data.paidAmount == null) return true
      return data.paidAmount <= data.totalAmount
    },
    { message: 'المبلغ المدفوع لا يمكن أن يكون أكبر من الإجمالي', path: ['paidAmount'] },
  )

export const updateStudentStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
  sendEmail: z.boolean().optional().default(true),
  customMessage: z.string().optional(),
})
