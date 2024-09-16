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

    return response.status(404).send({
      message: 'Resource already deleted'
    })
  }
}

export default DeleteExpenseController