import { Request, Response } from 'express'

class ScheduleExpenseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const expense = {
      id,
      description: 'Credit card bill',
      totalAmount: 100,
      status: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    return response.status(201).json(expense)
  }
}

export default ScheduleExpenseController