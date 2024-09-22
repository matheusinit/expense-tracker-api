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

  it('when passed valid expenses, should be able to schedule', () => {
    const expense1 = new Expense('Credit card bill', 100, 10)
    const expense2 = new Expense('Internet bill', 50, 10)
    const expenseSchedule = new ExpenseSchedule()

    expenseSchedule.include(expense1)
    expenseSchedule.include(expense2)

    expect(expenseSchedule.expenses).toEqual([expense1, expense2])
  })
})