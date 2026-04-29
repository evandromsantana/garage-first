import { PrismaClient } from '@prisma/client'
import prismaConfig from '../../prisma/prisma.config'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaConfig)

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma
