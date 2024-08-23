import express from 'express'
import AddExpenseController from './controller/add-expense-controller'
import 'dotenv/config'

const app = express()

app.use(express.json())

const addExpenseController = new AddExpenseController()

app.post('/v1/expenses', (request, response) => addExpenseController.handle(request, response))

export default app