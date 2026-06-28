import { z } from 'zod'

export const sendStudentEmailSchema = z.object({
  message: z.string().optional(),
  subject: z.string().optional(),
})
