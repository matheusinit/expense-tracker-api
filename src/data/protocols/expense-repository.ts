import { Expense as ExpensePrisma } from '@prisma/client'
import { Expense } from '../entities/expense'

export abstract class ExpenseRepository {
  abstract add: (data: Expense) => Promise<ExpensePrisma>

  abstract count: () => Promise<number>

  abstract get: (id: string) => Promise<ExpensePrisma | null>

  abstract getMany: (take: number, skip: number, select?: string[]) => Promise<ExpensePrisma[]>

  abstract update: (id: string, data: Partial<Expense>) => Promise<ExpensePrisma>

  abstract delete: (id: string) => Promise<void>

  abstract getColumns: () => Promise<string[]>
}