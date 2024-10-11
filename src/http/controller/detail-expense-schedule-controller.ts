import db from '@/infra/database'
import { Request, Response } from 'express'

class DetailExpenseScheduleController {
  async handle(request: Request, response: Response) {
    const { id } = request.params

    const expenseSchedule = await db.expenseSchedule.findUnique({
      where: {
        id
      }
    })

    response.status(200).send(expenseSchedule)
  }
}

export default DetailExpenseScheduleController