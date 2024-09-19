import ExpenseRepository from '@/infra/database/repository/expense-repository'
import { Request, Response } from 'express'

class DeleteExpenseController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params

      const expense = await this.repository.get(id)

      if (!expense) {
        return response.status(404).send({
          message: 'Expense not found'
        })
      }

      await this.repository.delete(id)

      if (expense.deletedAt) {
        return response.status(404).send({
          message: 'Resource already deleted'
        })
      }

      return response.status(204).send()
    } catch (_err) {
      return response.status(500).send({
        message: 'Internal server error'
      })
    }
  }
}

export default DeleteExpenseController