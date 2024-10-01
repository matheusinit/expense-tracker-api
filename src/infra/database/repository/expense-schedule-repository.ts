import { ExpenseSchedule } from '@/data/entities/expense-schedule'
import db from '..'
import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'

export class ExpenseScheduleRepositoryRelationalDatabase implements
  ExpenseScheduleRepository {
  async save(data: ExpenseSchedule) {
    const expenseSchedule = await db.expenseSchedule.create({
      data: {
        description: data.description,
        period: data.period,
        totalAmount: data.totalAmount,
        status: data.status,
      }
    })

    return expenseSchedule
  }
}