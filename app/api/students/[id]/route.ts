import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { updateStudentSchema } from '@/lib/validations/students'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const student = await prisma.students.findUnique({
      where: { id },
      include: { program: true },
    })

    if (!student) {
      return errorResponse('الطالب غير موجود', 404)
    }

    return jsonResponse(student)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const data = updateStudentSchema.parse(body)

    if (data.programId) {
      const program = await prisma.programs.findUnique({ where: { id: data.programId } })
      if (!program) {
        return errorResponse('البرنامج غير موجود', 404)
      }
    }

    const student = await prisma.students.update({
      where: { id },
      data,
      include: { program: true },
    })

    return jsonResponse(student)
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('الطالب غير موجود', 404)
    }
    return handleApiError(err)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    await prisma.students.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('الطالب غير موجود', 404)
    }
    return handleApiError(err)
  }
}
