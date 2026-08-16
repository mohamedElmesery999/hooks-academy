import { prisma } from '@/lib/db'
import { errorResponse, handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { createStudentSchema } from '@/lib/validations/students'
import { ensureOpenCycle } from '@/lib/cycles'
import type { RequestStatus } from '@/lib/generated/prisma/client'

export async function GET(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as RequestStatus | null
    const cycleId = searchParams.get('cycleId')

    const students = await prisma.students.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(cycleId ? { cycleId } : {}),
      },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    })

    return jsonResponse(students)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const data = createStudentSchema.parse(body)

    const program = await prisma.programs.findUnique({ where: { id: data.programId } })
    if (!program) {
      return errorResponse('البرنامج غير موجود', 404)
    }

    const cycle = await ensureOpenCycle()

    const student = await prisma.students.create({
      data: {
        name: data.name,
        parentName: data.parentName,
        age: data.age,
        email: data.email,
        phone: data.phone,
        programId: data.programId,
        cycleId: cycle.id,
        notes: data.notes,
        status: data.status ?? 'pending',
      },
      include: { program: true },
    })

    return jsonResponse(student, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
