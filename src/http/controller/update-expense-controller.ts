import { Request, Response } from 'express'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { Expense } from '@/data/entities/expense'

class UpdateExpenseController {
  private readonly repository: ExpenseRepositoryRelationalDatabase

  constructor(repository: ExpenseRepositoryRelationalDatabase) {
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

      const expense = new Expense(
        expenseFound.description, expenseFound.amount, expenseFound.dueDate
      )

      const fieldsToCheck = ['description', 'amount', 'dueDate']

      const noneFieldsIsProvided = fieldsToCheck.every(
        field => request.body[field] === undefined
      )

      if (noneFieldsIsProvided) {
        return response.status(400).send({ message: 'At least one field must be provided' })
      }

      const {
        description,
        amount: amountField,
        dueDate: dueDateField
      } = request.body

      const amount = amountField !== undefined
        ? Number(amountField)
        : amountField

      const dueDate = dueDateField !== undefined
        ? Number(dueDateField)
        : dueDateField

      expense.update({
        description,
        amount: amount,
        dueDate: dueDate
      })

      const expenseUpdated = await this.repository.update(
        expenseFound.id,
        expense
      )

      return response.status(200).send(expenseUpdated)
    } catch (err) {
      const error = err as unknown as Error

      return response.status(400).send({ message: error.message })
    }

  }
}

export default UpdateExpenseController