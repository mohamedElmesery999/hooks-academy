import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const { id } = await context.params
    await prisma.home_videos.delete({ where: { id } })
    return jsonResponse({ success: true })
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('الفيديو غير موجود', 404)
    }
    return handleApiError(err)
  }
}
