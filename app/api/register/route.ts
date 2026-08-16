import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { sendNewRegistrationNotification, isSmtpConfigured } from '@/lib/email'
import { registerStudentSchema } from '@/lib/validations/students'
import { ensureOpenCycle } from '@/lib/cycles'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerStudentSchema.parse(body)

    const program = await prisma.programs.findUnique({ where: { id: data.program } })
    if (!program) {
      return errorResponse('البرنامج المختار غير متاح', 400)
    }

    const cycle = await ensureOpenCycle()

    const student = await prisma.students.create({
      data: {
        name: data.student_name,
        parentName: data.parent_name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        programId: data.program,
        cycleId: cycle.id,
        notes: data.notes,
        status: 'pending',
      },
      include: { program: true },
    })

    if (isSmtpConfigured()) {
      try {
        await sendNewRegistrationNotification({
          studentName: student.name,
          parentName: student.parentName,
          age: student.age,
          email: student.email,
          phone: student.phone,
          programName: student.program.name,
          notes: student.notes,
        })
      } catch (err) {
        console.error('Failed to send manager registration notification:', err)
      }
    }

    return jsonResponse(
      {
        id: student.id,
        student_name: student.name,
        parent_name: student.parentName,
        age: student.age,
        email: student.email,
        phone: student.phone,
        program: student.programId,
        notes: student.notes,
        status: student.status,
        created_at: student.createdAt.toISOString(),
      },
      201,
    )
  } catch (err) {
    return handleApiError(err)
  }
}
