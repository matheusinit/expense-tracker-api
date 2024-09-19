import { Expense } from '@prisma/client'

type AddExpenseRepositoryDTO = {
  description: string
  amount: number
  dueDate: number
}

type UpdateExpenseRepositoryDTO = {
  id: string
  description?: string
  amount?: number
  dueDate?: number
}

export abstract class ExpenseRepository {
  abstract add: (expense: AddExpenseRepositoryDTO) => Promise<Expense>

  abstract count: () => Promise<number>

  abstract get: (id: string) => Promise<Expense | null>

  abstract getMany: (take: number, skip: number, select?: string[]) => Promise<Expense[]>

  abstract update: (expense: UpdateExpenseRepositoryDTO) => Promise<Expense>

  abstract delete: (id: string) => Promise<void>

  abstract getColumns: () => Promise<string[]>
}