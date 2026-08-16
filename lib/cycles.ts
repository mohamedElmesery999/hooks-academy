import { prisma } from '@/lib/db'

export function cycleDisplayName(number: number) {
  return `الدورة ${number}`
}

export async function getOpenCycle() {
  return prisma.cycles.findFirst({
    where: { status: 'open' },
    orderBy: { number: 'desc' },
  })
}

export async function ensureOpenCycle() {
  const open = await getOpenCycle()
  if (open) return open

  const last = await prisma.cycles.findFirst({ orderBy: { number: 'desc' } })
  const number = (last?.number ?? 0) + 1

  return prisma.cycles.create({
    data: {
      number,
      name: cycleDisplayName(number),
      status: 'open',
    },
  })
}

export async function closeOpenCycleAndStartNext() {
  const current = await ensureOpenCycle()
  const nextNumber = current.number + 1

  const [closed, next] = await prisma.$transaction([
    prisma.cycles.update({
      where: { id: current.id },
      data: { status: 'closed', closedAt: new Date() },
    }),
    prisma.cycles.create({
      data: {
        number: nextNumber,
        name: cycleDisplayName(nextNumber),
        status: 'open',
      },
    }),
  ])

  return { closed, next }
}
