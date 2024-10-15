import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'
import db from '@/infra/database'
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

    const expenses = await db.expense.findMany({
      where: {
        ExpenseToExpenseSchedule: {
          every: {
            expenseScheduleId: id
          }
        }
      }
    })

    return response.status(200).send({
      records: expenses
    })
  }
}

export default ViewExpensesFromExpenseScheduleController