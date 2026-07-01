export async function loginAdmin(email: string, password: string): Promise<boolean> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return response.ok
}

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST' })
}

export async function isAdminLoggedIn(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/session', { cache: 'no-store' })
    if (!response.ok) return false

    const data = (await response.json()) as { authenticated?: boolean }
    return Boolean(data.authenticated)
  } catch {
    return false
  }
}
