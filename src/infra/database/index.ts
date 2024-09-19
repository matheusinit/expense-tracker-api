import { PrismaClient } from '@prisma/client'
import { environment } from '@/config/environment'

type LogLevel = 'info' | 'query' | 'warn' | 'error'

const log: LogLevel[] = environment.PRISMA_CLIENT_LOG as LogLevel[]

const options = {
  log
}

const db = new PrismaClient(options)

export default db