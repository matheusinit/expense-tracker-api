import { ExpenseRepository } from '@/data/protocols/expense-repository'
import db from '@/infra/database'

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

class ExpenseRepositoryRelationalDatabase implements ExpenseRepository {
  async add(input: AddExpenseRepositoryDTO) {
    const expense = await db.expense.create({
      data: {
        description: input.description,
        amount: input.amount,
        dueDate: input.dueDate
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

  async update({ id, ...data }: UpdateExpenseRepositoryDTO) {
    const updated = await db.expense.update({
      where: {
        id
      },
      data
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
}

export default ExpenseRepositoryRelationalDatabase