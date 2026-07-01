import { prisma } from '@/lib/db'
import { handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { createProgramSchema } from '@/lib/validations/programs'

export async function GET() {
  try {
    const programs = await prisma.programs.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { students: true } } },
    })

    return jsonResponse(programs)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const data = createProgramSchema.parse(body)

    const program = await prisma.programs.create({ data })

    return jsonResponse(program, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
