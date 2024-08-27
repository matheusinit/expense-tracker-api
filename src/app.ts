import express from 'express'
import AddExpenseController from './controller/add-expense-controller'
import 'dotenv/config'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import ExpenseRepository from './repository/expense-repository'
import { errorHandler } from './middleware/error-handler'
import { applyCsrfTokenController } from './controller/csrf-token-controller'
import { csrf } from './middleware/csrf'

const app = express()

app.use(cookieParser())
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'default',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'strict',
    secure: true
  }
}))

app.use(express.json())
app.get('/csrf-token', applyCsrfTokenController)
app.use(csrf)
app.use(helmet())
app.use(errorHandler)

const expenseRepository = new ExpenseRepository()
const addExpenseController = new AddExpenseController(expenseRepository)

app.post('/v1/expenses', (request, response) => addExpenseController.handle(request, response))

export default app