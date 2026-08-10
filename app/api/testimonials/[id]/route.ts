import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { deleteUploadedFile } from '@/lib/uploads'

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const { id } = await context.params
    const existing = await prisma.home_testimonials.findUnique({ where: { id } })

    if (!existing) {
      return errorResponse('الرأي غير موجود', 404)
    }

    await prisma.home_testimonials.delete({ where: { id } })
    await deleteUploadedFile(existing.imageUrl)

    return jsonResponse({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
