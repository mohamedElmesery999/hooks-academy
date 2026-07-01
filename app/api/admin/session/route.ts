import { cookies } from 'next/headers'
import { jsonResponse } from '@/lib/api-response'
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-session'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  return jsonResponse({ authenticated: isValidAdminSession(session) })
}
