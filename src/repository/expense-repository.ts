import db from '../database'

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

  async getMany(take: number, skip: number, select?: string[]) {
    return await db.expense.findMany({
      take,
      skip,
      select: {
        id: select?.includes('id'),
        amount: select?.includes('amount'),
        description: select?.includes('description'),
        createdAt: select?.includes('createdAt'),
        updatedAt: select?.includes('updated_at'),
        deletedAt: select?.includes('deleted_at')
      }
    })
  }
}

export default ExpenseRepository