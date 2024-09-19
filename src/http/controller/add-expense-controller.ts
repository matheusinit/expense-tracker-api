import { Request, Response } from 'express'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { Expense } from '@/data/entities/expense'

class AddExpenseController {
  private readonly repository: ExpenseRepositoryRelationalDatabase

  constructor(repository: ExpenseRepositoryRelationalDatabase) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    try {

      const { description, amount, dueDate } = request.body

      const required_fields = ['description', 'amount', 'dueDate']

      if (required_fields.every(field => !request.body[field])) {
        const required_fields_sorted = required_fields.sort()
        const required_fields_text = required_fields_sorted.join(', ')

        return response.status(400).send({
          message: `Missing required fields: ${required_fields_text}`
        })
      }

      for (const field of required_fields) {
        if (request.body[field] === undefined) {
          return response.status(400).send({
            message: `Missing required fields: ${field}`
          })
        }
      }

      const expenseData = new Expense(description, amount, dueDate)

      const expense = await this.repository.add(expenseData)

      return response.status(201).send(expense)
    } catch (err) {
      const error = err as unknown as Error

      return response.status(400).send({ message: error.message })
    }
  }
}

export default AddExpenseController