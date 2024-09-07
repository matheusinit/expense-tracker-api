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

  async getMany(take: number, skip: number) {
    return await db.expense.findMany({
      take,
      skip
    })
  }
}

export default ExpenseRepository