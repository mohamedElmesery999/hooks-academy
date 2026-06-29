import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  prismaSchemaVersion?: string
}

// Bump when prisma/schema.prisma changes so dev server picks up new fields without a manual restart.
const PRISMA_SCHEMA_VERSION = '2026-06-29-payment-fields'

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

function getPrismaClient() {
  if (
    process.env.NODE_ENV !== 'production' &&
    globalForPrisma.prisma &&
    globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
  ) {
    void globalForPrisma.prisma.$disconnect()
    globalForPrisma.prisma = undefined
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
    globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION
  }

  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
