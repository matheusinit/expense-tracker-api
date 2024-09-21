import { describe, it, expect } from 'vitest'
import { ExpenseSchedule } from './expense-schedule'
import { Expense } from './expense'

describe('Given is needed to schedule expenses', () => {
  it('should able to schedule a expense', () => {
    const expense = new Expense('Credit card bill', 100, 10)
    const expenseSchedule = new ExpenseSchedule()

    expenseSchedule.include(expense)

    expect(expenseSchedule.expenses).toEqual([expense])

  })
})