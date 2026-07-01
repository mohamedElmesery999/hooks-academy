export const ADMIN_SESSION_COOKIE = 'hooks_admin_session'

const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? 'hooks@gmail.com',
    password: process.env.ADMIN_PASSWORD ?? 'hooks@2026',
  }
}

export function getSessionToken() {
  return process.env.ADMIN_SESSION_SECRET ?? 'hooks-admin-session'
}

export function isValidAdminSession(value: string | undefined) {
  return value === getSessionToken()
}

export function validateAdminCredentials(email: string, password: string) {
  const admin = getAdminCredentials()
  return email === admin.email && password === admin.password
}

export function getAdminSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: getSessionToken(),
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  }
}
