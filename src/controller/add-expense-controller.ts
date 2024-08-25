import { Request, Response } from 'express'
import ExpenseRepository from '../repository/expense-repository'

class AddExpenseController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const { description, amount } = request.body

    const expenseData = {
      description,
      amount
    }

    if (!description) {
      return response.status(400).send({
        message: 'Missing required fields: description'
      })
    }

    const expense = await this.repository.add(expenseData)

    return response.status(201).send(expense)
  }
}

export default AddExpenseController