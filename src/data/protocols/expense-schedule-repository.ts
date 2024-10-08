import { ExpenseSchedule } from '../entities/expense-schedule'
import { ExpenseScheduleModel } from '../models/expense-schedule-model'

export abstract class ExpenseScheduleRepository {
  abstract save(data: ExpenseSchedule): Promise<ExpenseScheduleModel>

  abstract createExpenseScheduleAndScheduleExpense(
    expenseId: string,
    expenseSchedule: ExpenseSchedule
  ): Promise<ExpenseScheduleModel>

  abstract scheduleExpense(
    expenseId: string, expenseScheduleId: string
  ): Promise<ExpenseScheduleModel>

  abstract getTotalAmount(expenseScheduleId: string): Promise<number>
}