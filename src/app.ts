import express from 'express'
import 'dotenv/config'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import { applyCustomCsrfErrors } from './middleware/custom-csrf-errors'
import { applyCsrfTokenController } from './controller/csrf-token-controller'
import { csrf } from './middleware/csrf'
import { serverSession } from './middleware/session'
import { makeAddExpenseController } from './factory/add-expense-controller-factory'

const app = express()

app.use(cookieParser())
app.use(serverSession)

app.use(express.json())
app.use(helmet())
app.use(csrf)
app.get('/csrf-token', applyCsrfTokenController)
app.use(applyCustomCsrfErrors)

app.post('/v1/expenses', (request, response) => makeAddExpenseController().handle(request, response))

export default app