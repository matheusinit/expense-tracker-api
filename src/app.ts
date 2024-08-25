import express from 'express'
import AddExpenseController from './controller/add-expense-controller'
import 'dotenv/config'
import helmet from 'helmet'
import ExpenseRepository from './repository/expense-repository'

const app = express()

app.use(helmet())
app.use(express.json())

const expenseRepository = new ExpenseRepository()
const addExpenseController = new AddExpenseController(expenseRepository)

app.post('/v1/expenses', (request, response) => addExpenseController.handle(request, response))

export default app