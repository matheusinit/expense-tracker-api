import { Expense } from '../entities/expense'
import { ExpenseSchedule } from '../entities/expense-schedule'
import { ExpenseRepository } from '../protocols/expense-repository'
import { ExpenseScheduleRepository } from '../protocols/expense-schedule-repository'

export class ScheduleExpenseService {
  private expenseRepository: ExpenseRepository
  private expenseScheduleRepository: ExpenseScheduleRepository

  constructor(
    expenseRepository: ExpenseRepository,
    expenseScheduleRepository: ExpenseScheduleRepository
  ) {
    this.expenseRepository = expenseRepository
    this.expenseScheduleRepository = expenseScheduleRepository
  }

  async schedule(expenseId: string) {
    const expenseFromDb = await this.expenseRepository.get(expenseId)

    if (!expenseFromDb) {
      throw new Error('Expense not found')
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

    return expenseSchedule
  }
}