import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { registerStudentSchema } from '@/lib/validations/students'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerStudentSchema.parse(body)

    const program = await prisma.programs.findUnique({ where: { id: data.program } })
    if (!program) {
      return errorResponse('البرنامج المختار غير متاح', 400)
    }

    const student = await prisma.students.create({
      data: {
        name: data.student_name,
        parentName: data.parent_name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        programId: data.program,
        notes: data.notes,
        status: 'pending',
      },
      include: { program: true },
    })

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
