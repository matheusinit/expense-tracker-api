import { Expense } from '@/data/entities/expense'
import { ExpenseRepository } from '@/data/protocols/expense-repository'
import db from '@/infra/database'

class ExpenseRepositoryRelationalDatabase implements ExpenseRepository {

  async add(data: Expense) {
    const expense = await db.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate
      }
    })

    return expense
  }

  async count() {
    return await db.expense.count({
      where: {
        deletedAt: null
      }
    })
  }

  async get(id: string) {
    return await db.expense.findUnique({
      where: {
        id
      }
    })
  }

  async getMany(take: number, skip: number, select?: string[]) {
    return await db.expense.findMany({
      take,
      skip,
      where: {
        deletedAt: null
      },
      select: {
        id: select?.includes('id'),
        amount: select?.includes('amount'),
        description: select?.includes('description'),
        dueDate: select?.includes('dueDate'),
        createdAt: select?.includes('createdAt'),
        updatedAt: select?.includes('updatedAt'),
        deletedAt: select?.includes('deletedAt')
      }
    })
  }

  async update(id: string, data: Partial<Expense>) {
    const updated = await db.expense.update({
      where: {
        id
      },
      data: {
        amount: data.amount,
        description: data.description,
        dueDate: data.dueDate
      }
    })

    return updated
  }

  async delete(id: string) {
    await db.expense.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async getColumns() {
    const columnsQuery = await db.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'Expense'
    ` as Record<string, string>[]

    const columns = columnsQuery.map(column => column.column_name)

    return columns
  }

  async getByScheduleId(id: string, take: number, skip: number) {
    return await db.expense.findMany({
      where: {
        ExpenseToExpenseSchedule: {
          every: {
            expenseScheduleId: id
          }
        }
      },
      take,
      skip
    })
  }

  async countByScheduleId(id: string) {
    return await db.expense.count({
      where: {
        ExpenseToExpenseSchedule: {
          every: {
            expenseScheduleId: id
          }
        }
      }
    })
  }
}

export default ExpenseRepositoryRelationalDatabase