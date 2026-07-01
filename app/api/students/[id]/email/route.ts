import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { sendStudentCustomEmail } from '@/lib/email'
import { sendStudentEmailSchema } from '@/lib/validations/email'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await context.params
    const body = await request.json()
    const { message, subject } = sendStudentEmailSchema.parse(body)

    const student = await prisma.students.findUnique({
      where: { id },
      include: { program: true },
    })

    if (!student) {
      return errorResponse('الطالب غير موجود', 404)
    }

    if (!student.email) {
      return errorResponse('لا يوجد بريد إلكتروني لهذا الطالب', 400)
    }

    const customMessage = message?.trim() ?? ''

    if (!customMessage) {
      return errorResponse('نص الرسالة مطلوب', 400)
    }

    await sendStudentCustomEmail({
      to: student.email,
      studentName: student.name,
      parentName: student.parentName,
      message: customMessage,
      status: student.status,
      subject,
    })

    return jsonResponse({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message.includes('SMTP')) {
      return errorResponse(err.message, 503)
    }
    return handleApiError(err)
  }
}
