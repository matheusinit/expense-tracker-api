import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'
import { Request, Response } from 'express'

class DetailExpenseScheduleController {
  private readonly repository: ExpenseScheduleRepository

  constructor(repository: ExpenseScheduleRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params

      const expenseSchedule = await this.repository.getById(id)

      if (!expenseSchedule) {
        return response.status(404).send({
          message: 'Schedule not found'
        })
      }

      return response.status(200).send(expenseSchedule)
    } catch (_err) {
      return response.status(500).send({ message: 'Internal server error' })
    }

  }
}

export default DetailExpenseScheduleController