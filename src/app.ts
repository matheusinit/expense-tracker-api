import express from 'express'
import helmet from 'helmet'

import '@/config/environment'
import { applyCustomCsrfErrors } from '@/middleware/custom-csrf-errors'
import { applyCsrfTokenController } from '@/controller/csrf-token-controller'
import { csrf } from '@/middleware/csrf'
import { serverSession } from '@/middleware/session'
import { logger } from '@/middleware/logger'
import { parseCookies } from '@/middleware/cookie'

import expenseRouter from '@/routes'

const app = express()

app.use(logger)
app.use(parseCookies)
app.use(serverSession)

app.use(express.json())
app.use(helmet())
app.use(csrf)
app.get('/csrf-token', applyCsrfTokenController)
app.use(applyCustomCsrfErrors)

app.use('/v1', expenseRouter)

export default app