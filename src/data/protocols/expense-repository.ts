import { Expense } from '@/data/entities/expense'
import { ExpenseModel } from '@/data/models/expense-model'

export abstract class ExpenseRepository {
  abstract add: (data: Expense) => Promise<ExpenseModel>

  abstract count: () => Promise<number>

  abstract get: (id: string) => Promise<ExpenseModel | null>

  abstract getMany: (take: number, skip: number, select?: string[]) => Promise<ExpenseModel[]>

  abstract update: (id: string, data: Partial<Expense>) => Promise<ExpenseModel>

  abstract delete: (id: string) => Promise<void>

  abstract getColumns: () => Promise<string[]>
}