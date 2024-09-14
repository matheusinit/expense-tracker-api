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

    const description: string = request.body['description']
    const amount: string = request.body['amount']

    if (description === undefined && amount === undefined) {
      return response.status(400).send({ message: 'At least one field must be provided' })
    }

    const expenseUpdated = await db.expense.update({
      where: {
        id: expenseFound.id
      },
      data: {
        amount: Number(amount)
      }
    })

    return response.status(200).send(expenseUpdated)
  }
}

export default UpdateExpenseController