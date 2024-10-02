import { ExpenseSchedule } from '@/data/entities/expense-schedule'
import db from '..'
import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'

export class ExpenseScheduleRepositoryRelationalDatabase implements
  ExpenseScheduleRepository {
  async save(data: ExpenseSchedule) {
    const expenseSchedule = await db.expenseSchedule.create({
      data: {
        period: data.period,
        status: data.status,
      }
    })

    return expenseSchedule
  }

  async createExpenseScheduleAndScheduleExpense(
    expenseId: string,
    expenseSchedule: ExpenseSchedule
  ) {
    const { period, status } = expenseSchedule

    const expenseScheduleModel = await db.expenseSchedule.create({
      data: {
        period,
        status,

        ExpenseExpenseSchedule: {
          create: {
            expenseId: expenseId
          }
        }
      }
    })

    return expenseScheduleModel
  }

  async scheduleExpense(expenseId: string, expenseScheduleId: string) {
    const expenseToExpenseSchedule = await db.expenseToExpenseSchedule.create({
      data: {
        expenseId,
        expenseScheduleId
      },
      include: {
        expenseSchedule: true
      }
    })

    return expenseToExpenseSchedule.expenseSchedule
  }
}