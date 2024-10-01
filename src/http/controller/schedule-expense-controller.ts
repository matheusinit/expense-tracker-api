import { Expense } from '@/data/entities/expense'
import { ExpenseSchedule } from '@/data/entities/expense-schedule'
import { ExpenseRepository } from '@/data/protocols/expense-repository'
import db from '@/infra/database'
import { Request, Response } from 'express'

class ScheduleExpenseController {
  private expenseRepository: ExpenseRepository

  constructor(expenseRepository: ExpenseRepository) {
    this.expenseRepository = expenseRepository
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const expenseScheduleModel = new ExpenseSchedule()

    const expenseFromDb = await this.expenseRepository.get(id)

    const expense = new Expense(
      (expenseFromDb?.description || ''),
      (expenseFromDb?.amount || null),
      expenseFromDb?.dueDate
    )

    expenseScheduleModel.include(expense)

    const expenseSchedule = await db.expenseSchedule.create({
      data: {
        description: expenseScheduleModel.description,
        period: expenseScheduleModel.period
      }
    })

    return response.status(201).json({
      ...expenseSchedule,
      status: expenseScheduleModel.status,
      totalAmount: expenseScheduleModel.totalAmount,
    })
  }
}

export default ScheduleExpenseController