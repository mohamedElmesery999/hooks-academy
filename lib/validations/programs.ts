import { z } from 'zod'

export const createProgramSchema = z.object({
  name: z.string().min(1, 'اسم البرنامج مطلوب'),
  description: z.string().min(1, 'وصف البرنامج مطلوب'),
})

export const updateProgramSchema = createProgramSchema.partial()
