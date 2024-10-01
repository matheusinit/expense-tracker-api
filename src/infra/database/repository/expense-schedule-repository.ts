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

  async createExpenseSchedule(
    expenseId: string,
    expenseSchedule: ExpenseSchedule
  ) {
    const { description, period, totalAmount, status } = expenseSchedule

    const expenseScheduleModel = await db.expenseSchedule.create({
      data: {
        description,
        period,
        totalAmount,
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

  async scheduleExpense(expenseId: string, scheduleExpenseId: string) {
    const expenseToExpenseSchedule = await db.expenseToExpenseSchedule.create({
      data: {
        expenseId,
        expenseScheduleId: scheduleExpenseId
      },
      include: {
        expenseSchedule: true
      }
    })

    return expenseToExpenseSchedule.expenseSchedule
  }
}