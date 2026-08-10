import { cookies } from 'next/headers'
import { errorResponse } from '@/lib/api-response'
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-session'

/** Returns an error response if not authenticated, otherwise null. */
export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!isValidAdminSession(token)) {
    return errorResponse('غير مصرح', 401)
  }

  return null
}
