import { Request, Response } from 'express'

import { ScheduleExpenseService } from '@/data/services/schedule-expense'

class ScheduleExpenseController {
  private scheduleExpenseService: ScheduleExpenseService

  constructor(
    scheduleExpenseService: ScheduleExpenseService
  ) {
    this.scheduleExpenseService = scheduleExpenseService
  }

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params

      const expenseSchedule = await this.scheduleExpenseService.schedule(id)

      return response.status(201).json(expenseSchedule)
    } catch (err) {
      const error = err as Error

      if (error.message === 'Expense not found') {
        return response.status(404).json({
          message: error.message
        })
      }

      return response.status(500).send({
        message: 'Internal server error'
      })

    }
  }
}

export default ScheduleExpenseController