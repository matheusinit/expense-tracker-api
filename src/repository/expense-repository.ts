import db from '@/database'

type AddExpenseRepositoryDTO = {
  description: string
  amount: number
}

class ExpenseRepository {
  async add(input: AddExpenseRepositoryDTO) {
    const expense = await db.expense.create({
      data: {
        description: input.description,
        amount: input.amount
      }
    })

    return expense
  }

  async count() {
    return await db.expense.count()
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
      select: {
        id: select?.includes('id'),
        amount: select?.includes('amount'),
        description: select?.includes('description'),
        createdAt: select?.includes('createdAt'),
        updatedAt: select?.includes('updatedAt'),
        deletedAt: select?.includes('deletedAt')
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

export default ExpenseRepository