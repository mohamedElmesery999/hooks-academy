const AUTH_KEY = 'hooks_admin_session'

export const ADMIN_EMAIL = 'hooks@gmail.com'
export const ADMIN_PASSWORD = 'hooks@2026'

export function loginAdmin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(AUTH_KEY)
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}
