import express from 'express'
import AddExpenseController from './controller/add-expense-controller'
import 'dotenv/config'
import { doubleCsrf } from 'csrf-csrf'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import ExpenseRepository from './repository/expense-repository'

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
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => {
    const csrfTokenSecret = process.env['CSRF_TOKEN_SECRET']

    if (!csrfTokenSecret) throw new Error('CSRF_TOKEN_SECRET not defined')

    return csrfTokenSecret
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS', 'POST']
})

app.use(helmet())
app.use(express.json())

const myRoute = (req, res) => {
  const csrfToken = generateToken(req, res)
  res.json({ csrfToken })
}
app.get('/csrf-token', myRoute)
app.use(doubleCsrfProtection)

const expenseRepository = new ExpenseRepository()
const addExpenseController = new AddExpenseController(expenseRepository)

app.post('/v1/expenses', (request, response) => addExpenseController.handle(request, response))

export default app