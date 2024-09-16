import db from '@/database'
import { Request, Response } from 'express'

class DeleteExpenseController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const expense = await db.expense.findUnique({
      where: {
        id
      }
    })

    if (!expense) {
      return response.status(404).send({
        message: 'Expense not found'
      })
    }

    await db.expense.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    })

    if (expense.deletedAt) {
      return response.status(404).send({
        message: 'Resource already deleted'
      })
    }

    return response.status(204).send()
  }
}

export default DeleteExpenseController