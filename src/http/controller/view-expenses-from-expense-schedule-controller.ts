import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'
import { Request, Response } from 'express'

class ViewExpensesFromExpenseScheduleController {
  private readonly repository: ExpenseScheduleRepository

  constructor(repository: ExpenseScheduleRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const id = request.params['id']

    const expenseSchedule = await this.repository.getById(id)

    if (!expenseSchedule) {
      return response.status(404).send({
        message: 'Expense schedule not found'
      })
    }

    return response.status(200).send()
  }
}

export default ViewExpensesFromExpenseScheduleController