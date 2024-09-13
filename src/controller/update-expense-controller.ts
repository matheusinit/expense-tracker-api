import { Request, Response } from 'express'
import db from '@/database'

class UpdateExpenseController {
  async handle(request: Request, response: Response) {
    const expenseFound = await db.expense.findUnique({
      where: {
        id: request.params.id
      }
    })

    if (!expenseFound) {
      return response.status(404).send({ message: 'Expense not found' })
    }

    return response.status(400).send({ message: 'At least one field must be provided' })
  }
}

export default UpdateExpenseController