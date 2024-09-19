import express from 'express'
import helmet from 'helmet'

import '@/config/environment'
import { applyCustomCsrfErrors } from '@/http/middleware/custom-csrf-errors'
import { applyCsrfTokenController } from '@/http/controller/csrf-token-controller'
import { csrf } from '@/http/middleware/csrf'
import { serverSession } from '@/http/middleware/session'
import { logger } from '@/http/middleware/logger'
import { parseCookies } from '@/http/middleware/cookie'

import expenseRouter from '@/http/routes'

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