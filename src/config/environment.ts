import 'dotenv/config'

const getLogLevels = () => {
  const logLevels = process.env.PRISMA_CLIENT_LOG?.split(',')

  const validLogLevels = ['query', 'info', 'warn', 'error']

  const formattedLogLevels = logLevels?.map((logLevel) => logLevel.trim())

  return formattedLogLevels?.filter((logLevel) => validLogLevels.includes(logLevel))
}

const prismaLogLevels = getLogLevels()

export const environment = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,

  // Application server
  CSRF_TOKEN_SECRET: process.env.CSRF_TOKEN_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  // ORM
  PRISMA_CLIENT_LOG: prismaLogLevels ?? ['query', 'info', 'warn'],

  LOG_LEVEL: process.env.LOG_LEVEL ?? process.env.NODE_ENV === 'development' ? 'info' : 'warn'
}
