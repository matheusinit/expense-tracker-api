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

      if (expenseFound.deletedAt) {
        return response.status(404).send({ message: 'Cannot update a deleted resource' })
      }

      const expense = new Expense(expenseFound.description, expenseFound.amount, expenseFound.dueDate)

      const description: string = request.body['description']
      const amount: string = request.body['amount']
      const dueDate: string = request.body['dueDate']

      const noneFieldsIsDefined = description === undefined && amount === undefined && dueDate === undefined

      if (noneFieldsIsDefined) {
        return response.status(400).send({ message: 'At least one field must be provided' })
      }

      expense.update({
        description,
        amount: Number(amount),
        dueDate: Number(dueDate)
      })

      const expenseUpdated = await this.repository.update({
        id: expenseFound.id,
        amount: amount !== undefined ? Number(amount) : amount,
        description,
        dueDate: dueDate !== undefined ? Number(dueDate) : dueDate,
      })

      return response.status(200).send(expenseUpdated)
    } catch (err) {
      const error = err as unknown as Error

      return response.status(400).send({ message: error.message })
    }

  }
}

export default UpdateExpenseController