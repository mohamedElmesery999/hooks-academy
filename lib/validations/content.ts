import { z } from 'zod'

export const createVideoSchema = z.object({
  title: z.string().min(2, 'عنوان الفيديو مطلوب'),
  url: z.string().min(1, 'رابط الفيديو مطلوب'),
  startSeconds: z.number().int().min(0).optional().nullable(),
})

export const createTestimonialSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  role: z.string().min(1).default('طالبة'),
  alt: z.string().optional(),
})
