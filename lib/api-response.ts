import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => issue.message).join(', ')
    return errorResponse(message, 400)
  }

  console.error(err)
  return errorResponse('حدث خطأ في الخادم', 500)
}
