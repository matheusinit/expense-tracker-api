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
}

export default ExpenseRepository