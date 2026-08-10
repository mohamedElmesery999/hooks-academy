export function extractYouTubeId(input: string): string | null {
  const value = input.trim()
  if (!value) return null

  if (/^[\w-]{11}$/.test(value)) return value

  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && /^[\w-]{11}$/.test(id) ? id : null
    }

    const v = url.searchParams.get('v')
    if (v && /^[\w-]{11}$/.test(v)) return v

    const embedMatch = url.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)
    if (embedMatch) return embedMatch[1]
  } catch {
    return null
  }

  return null
}

export function extractYouTubeStartSeconds(input: string): number | null {
  try {
    const url = new URL(input.trim())
    const t = url.searchParams.get('t')
    if (!t) return null

    if (/^\d+$/.test(t)) return Number(t)

    const match = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
    if (!match) return null

    const hours = Number(match[1] ?? 0)
    const minutes = Number(match[2] ?? 0)
    const seconds = Number(match[3] ?? 0)
    return hours * 3600 + minutes * 60 + seconds
  } catch {
    return null
  }
}
