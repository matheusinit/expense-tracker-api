import { Request, Response } from 'express'
import ExpenseRepository from '../repository/expense-repository'

class AddExpenseController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const { description, amount } = request.body

    const required_fields = ['description', 'amount']

    for (const field of required_fields) {
      if (!request.body[field]) {
        return response.status(400).send({
          message: `Missing required fields: ${field}`
        })
      }
    }

    const expenseData = {
      description,
      amount
    }

    const expense = await this.repository.add(expenseData)

    return response.status(201).send(expense)
  }
}

export default AddExpenseController