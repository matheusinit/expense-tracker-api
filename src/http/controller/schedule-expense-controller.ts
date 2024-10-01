import { Expense } from '@/data/entities/expense'
import { ExpenseSchedule } from '@/data/entities/expense-schedule'
import { ExpenseRepository } from '@/data/protocols/expense-repository'
import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'
import { Request, Response } from 'express'

class ScheduleExpenseController {
  private expenseRepository: ExpenseRepository
  private expenseScheduleRepository: ExpenseScheduleRepository

  constructor(
    expenseRepository: ExpenseRepository,
    expenseScheduleRepository: ExpenseScheduleRepository
  ) {
    this.expenseRepository = expenseRepository
    this.expenseScheduleRepository = expenseScheduleRepository
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const expenseFromDb = await this.expenseRepository.get(id)

    if (!expenseFromDb) {
      return response.status(404).json({
        message: 'Expense not found'
      })
    }

    const expenseScheduleEntity = new ExpenseSchedule()
    const expense = new Expense(
      expenseFromDb?.description,
      expenseFromDb?.amount,
      expenseFromDb?.dueDate
    )

    expenseScheduleEntity.include(expense)

    const expenseSchedule = await this.expenseScheduleRepository
      .save(expenseScheduleEntity)

    return response.status(201).json(expenseSchedule)
  }
}

export default ScheduleExpenseController