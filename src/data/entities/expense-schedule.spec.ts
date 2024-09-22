import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ExpenseSchedule } from './expense-schedule'
import { Expense } from './expense'

describe('Given is needed to schedule expenses', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('when expenses are included with due date below than current date, should schedule to next month', () => {
    const expense1 = new Expense('Credit card bill', 100, 10)
    const expense2 = new Expense('Internet bill', 50, 10)
    const expenseSchedule = new ExpenseSchedule()
    const date = new Date(2024, 8, 20)
    vi.setSystemTime(date)

    expenseSchedule.include(expense1)
    expenseSchedule.include(expense2)

    expect(expenseSchedule.month).toEqual('October')
  })

  it('when expenses are included with due date above current date, should schedule to current month', () => {
    const expense1 = new Expense('Credit card bill', 100, 10)
    const expense2 = new Expense('Internet bill', 50, 10)
    const expenseSchedule = new ExpenseSchedule()
    const date = new Date(2024, 8, 2)
    vi.setSystemTime(date)

    expenseSchedule.include(expense1)
    expenseSchedule.include(expense2)

    expect(expenseSchedule.month).toEqual('September')
  })
})