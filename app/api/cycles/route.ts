import { prisma } from '@/lib/db'
import { handleApiError, jsonResponse } from '@/lib/api-response'
import { requireAdmin } from '@/lib/require-admin'
import { closeOpenCycleAndStartNext, ensureOpenCycle } from '@/lib/cycles'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    await ensureOpenCycle()

    const cycles = await prisma.cycles.findMany({
      orderBy: { number: 'asc' },
      include: { _count: { select: { students: true } } },
    })

    return jsonResponse(cycles)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST() {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const result = await closeOpenCycleAndStartNext()
    return jsonResponse(result, 201)
  } catch (err) {
    return handleApiError(err)
  }
}
