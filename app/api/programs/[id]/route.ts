import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { updateProgramSchema } from '@/lib/validations/programs'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const program = await prisma.programs.findUnique({
      where: { id },
      include: { _count: { select: { students: true } } },
    })

    if (!program) {
      return errorResponse('البرنامج غير موجود', 404)
    }

    return jsonResponse(program)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const data = updateProgramSchema.parse(body)

    const program = await prisma.programs.update({
      where: { id },
      data,
    })

    return jsonResponse(program)
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('البرنامج غير موجود', 404)
    }
    return handleApiError(err)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    await prisma.programs.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('البرنامج غير موجود', 404)
    }
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2003') {
      return errorResponse('لا يمكن حذف البرنامج لوجود طلاب مسجلين فيه', 409)
    }
    return handleApiError(err)
  }
}
