import { Request, Response } from 'express'

class ViewExpensesFromExpenseScheduleController {
  async handle(request: Request, response: Response) {
    return response.status(404).send({
      message: 'Expense schedule not found'
    })
  }
}

export default ViewExpensesFromExpenseScheduleController