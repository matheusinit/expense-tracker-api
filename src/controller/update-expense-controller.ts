import { Request, Response } from 'express'
import ExpenseRepository from '@/repository/expense-repository'

class UpdateExpenseController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const expenseFound = await this.repository.get(request.params.id)

    if (!expenseFound) {
      return response.status(404).send({ message: 'Expense not found' })
    }

    const description: string = request.body['description']
    const amount: string = request.body['amount']

    const noneFieldsIsDefined = !description && !amount

    if (noneFieldsIsDefined) {
      return response.status(400).send({ message: 'At least one field must be provided' })
    }

    const expenseUpdated = await this.repository.update({
      id: expenseFound.id,
      amount: Number(amount),
      description
    })

    return response.status(200).send(expenseUpdated)
  }
}

export default UpdateExpenseController