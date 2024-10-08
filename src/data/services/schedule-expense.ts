import db from '@/infra/database'
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
      expenseFromDb.description,
      expenseFromDb.amount,
      expenseFromDb.dueDate,
      expenseFromDb.createdAt
    )

    expenseScheduleEntity.include(expense)

    const expenseScheduleFromDb = await db.expenseSchedule.findFirst({
      where: {
        period: expenseScheduleEntity.period
      }
    })

    const periodDateTime = expenseScheduleEntity.period

    periodDateTime.setMonth(expenseScheduleEntity.period.getMonth() - 1)

    const previousMonthPeriod = periodDateTime

    const expenseScheduleFromPreviousMonth = await db.expenseSchedule
      .findFirst({
        where: {
          period: previousMonthPeriod
        }
      })

    if (expenseScheduleFromPreviousMonth && expenseScheduleFromPreviousMonth.status === 'OPEN') {
      expenseScheduleEntity.status = 'SCHEDULED'
    }

    if (expenseScheduleFromDb) {
      await this.expenseScheduleRepository.scheduleExpense(
        expenseId,
        expenseScheduleFromDb.id
      )

      const totalAmountAggregate = await db.expense.aggregate({
        _sum: {
          amount: true
        },
        where: {
          deletedAt: null,
          ExpenseToExpenseSchedule: {
            every: {
              expenseScheduleId: expenseScheduleFromDb.id
            }
          }
        }
      })

      const { id, period, status, ...timestamps } = expenseScheduleFromDb

      return {
        id,
        period,
        status,
        totalAmount: totalAmountAggregate._sum.amount ?? 0,
        ...timestamps
      }
    }

    const expenseSchedule = await this.expenseScheduleRepository
      .createExpenseScheduleAndScheduleExpense(expenseId, expenseScheduleEntity)

    const { id, period, status, ...timestamps } = expenseSchedule

    return {
      id,
      period,
      status,
      totalAmount: expense.amount,
      ...timestamps,
    }
  }
}