import { ExpenseSchedule } from '../entities/expense-schedule'
import { ExpenseScheduleModel } from '../models/expense-schedule-model'

export abstract class ExpenseScheduleRepository {
  abstract save(data: ExpenseSchedule): Promise<ExpenseScheduleModel>
}