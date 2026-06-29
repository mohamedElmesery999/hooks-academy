import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { sendStudentStatusEmail, isSmtpConfigured } from '@/lib/email'
import { updateStudentStatusSchema } from '@/lib/validations/students'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status, sendEmail, customMessage } = updateStudentStatusSchema.parse(body)

    const existing = await prisma.students.findUnique({ where: { id } })

    if (!existing) {
      return errorResponse('الطالب غير موجود', 404)
    }

    const student = await prisma.students.update({
      where: { id },
      data: { status },
      include: { program: true },
    })

    let emailSent = false
    let emailError: string | undefined

    const shouldSendEmail =
      sendEmail &&
      (status === 'accepted' || status === 'rejected') &&
      Boolean(student.email)

    if (shouldSendEmail) {
      if (!isSmtpConfigured()) {
        console.warn('SMTP not configured — status updated without sending email')
      } else {
        try {
          await sendStudentStatusEmail({
            to: student.email,
            studentName: student.name,
            parentName: student.parentName,
            status,
            customMessage: customMessage?.trim() || undefined,
          })
          emailSent = true
        } catch (err) {
          emailError =
            err instanceof Error ? err.message : 'فشل إرسال البريد الإلكتروني'
          console.error('Failed to send status email:', err)
        }
      }
    }

    return jsonResponse({ ...student, emailSent, emailError })
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2025') {
      return errorResponse('الطالب غير موجود', 404)
    }
    return handleApiError(err)
  }
}
