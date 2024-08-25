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

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => {
    const csrfTokenSecret = process.env['CSRF_TOKEN_SECRET']

    if (!csrfTokenSecret) throw new Error('CSRF_TOKEN_SECRET not defined')

    return csrfTokenSecret
  },
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
app.get('/v1/sample', (request, response) => {
  return response.status(200).send({ message: 'Hello World' })
})

export default app