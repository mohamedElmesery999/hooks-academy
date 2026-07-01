import { NextResponse } from 'next/server'
import { z } from 'zod'
import { errorResponse, handleApiError } from '@/lib/api-response'
import {
  getAdminSessionCookieOptions,
  validateAdminCredentials,
} from '@/lib/admin-session'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    if (!validateAdminCredentials(email, password)) {
      return errorResponse('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401)
    }

    const response = NextResponse.json({ success: true })
    const cookie = getAdminSessionCookieOptions()
    response.cookies.set(cookie)

    return response
  } catch (err) {
    return handleApiError(err)
  }
}
