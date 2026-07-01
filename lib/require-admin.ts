import { cookies } from 'next/headers'
import { errorResponse } from '@/lib/api-response'
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-session'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!isValidAdminSession(session)) {
    return errorResponse('غير مصرح — يرجى تسجيل الدخول', 401)
  }

  return null
}
