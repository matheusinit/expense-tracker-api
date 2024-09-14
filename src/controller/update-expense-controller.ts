import { Request, Response } from 'express'
import ExpenseRepository from '@/repository/expense-repository'
import { Expense } from '@/entities/expense'

class UpdateExpenseController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    try {

      const expenseFound = await this.repository.get(request.params.id)

      if (!expenseFound) {
        return response.status(404).send({ message: 'Expense not found' })
      }

      const expense = new Expense(expenseFound.description, expenseFound.amount)

      const description: string = request.body['description']
      const amount: string = request.body['amount']

      const noneFieldsIsDefined = description === undefined && amount === undefined

      if (noneFieldsIsDefined) {
        return response.status(400).send({ message: 'At least one field must be provided' })
      }

      expense.update(description, Number(amount))

      const expenseUpdated = await this.repository.update({
        id: expenseFound.id,
        amount: Number(amount),
        description
      })

      return response.status(200).send(expenseUpdated)
    } catch (err) {
      const error = err as unknown as Error

      return response.status(400).send({ message: error.message })
    }

  }
}

export default UpdateExpenseController