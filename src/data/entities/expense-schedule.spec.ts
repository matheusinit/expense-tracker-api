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

  describe('Given all expenses has the same due date', () => {
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

    it('when expenses are included with due date as the same as current date, should schedule to current month', () => {
      const expense1 = new Expense('Credit card bill', 100, 10)
      const expense2 = new Expense('Internet bill', 50, 10)
      const expenseSchedule = new ExpenseSchedule()
      const date = new Date(2024, 8, 10)
      vi.setSystemTime(date)

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expect(expenseSchedule.month).toEqual('September')
    })
  })

  describe('Given all expenses has different due dates', () => {
    it('when current date is between expenses due dates, should schedule to next month', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      const expenseSchedule = new ExpenseSchedule()
      const date = new Date(2024, 8, 15)
      vi.setSystemTime(date)

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expect(expenseSchedule.month).toEqual('October')
    })
  })

  describe('Given is registered in month and past month expenses', () => {
    it('when expenses are scheduled correctly, should have status \'OPEN\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      vi.setSystemTime(new Date(2024, 8, 15))
      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expect(expenseSchedule.status).toEqual('OPEN')
    })

    it('when all expenses are paid, should have status \'PAID\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()
      expense2.pay()

      expect(expenseSchedule.status).toEqual('PAID')
    })

    it('when some expenses are not paid, should have status \'OPEN\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      const expenseSchedule = new ExpenseSchedule()
      vi.setSystemTime(new Date(2024, 8, 15))

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      expect(expenseSchedule.status).toEqual('OPEN')
    })

    it('when some expense are with 3 days to overdue, should have status \'PENDING\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      vi.setSystemTime(new Date(2024, 8, 25))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      expect(expenseSchedule.status).toEqual('PENDING')
    })

    it('when some expense are with 1 day to overdue, should have status \'PENDING\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      vi.setSystemTime(new Date(2024, 8, 27))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      expect(expenseSchedule.status).toEqual('PENDING')
    })

    it('when some past month expense pass over the due date, should have status \'OVERDUE\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      vi.setSystemTime(new Date(2024, 8, 28))
      expense1.pay()

      expect(expenseSchedule.status).toEqual('OVERDUE')
    })

    it('when some in month expense pass over the due date, should have status \'OVERDUE\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 27)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense2.pay()

      vi.setSystemTime(new Date(2024, 9, 6))

      expect(expenseSchedule.status).toEqual('OVERDUE')
    })
  })

  describe('Given is registered only in month expenses', () => {
    it('when expenses are scheduled correctly, should have status \'OPEN\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      vi.setSystemTime(new Date(2024, 8, 20))
      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expect(expenseSchedule.status).toEqual('OPEN')
    })

    it('when all expenses are paid, should have status \'PAID\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()
      expense2.pay()

      expect(expenseSchedule.status).toEqual('PAID')
    })

    it('when some expenses are not paid, should have status \'OPEN\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      const expenseSchedule = new ExpenseSchedule()
      vi.setSystemTime(new Date(2024, 8, 15))

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      expect(expenseSchedule.status).toEqual('OPEN')
    })

    it('when some expense are with 3 days to overdue, should have status \'PENDING\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      vi.setSystemTime(new Date(2024, 9, 5))
      expect(expenseSchedule.status).toEqual('PENDING')
    })

    it('when some expense are with 1 day to overdue, should have status \'PENDING\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      expense1.pay()

      vi.setSystemTime(new Date(2024, 9, 7))
      expect(expenseSchedule.status).toEqual('PENDING')
    })

    it('when some expense pass over the due date, should have status \'OVERDUE\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      vi.setSystemTime(new Date(2024, 9, 7))
      expect(expenseSchedule.status).toEqual('OVERDUE')
    })

    it('when all expenses pass over the due date, should have status \'OVERDUE\'', () => {
      const expense1 = new Expense('Credit card bill', 100, 5)
      const expense2 = new Expense('Internet bill', 50, 8)
      vi.setSystemTime(new Date(2024, 8, 20))

      const expenseSchedule = new ExpenseSchedule()

      expenseSchedule.include(expense1)
      expenseSchedule.include(expense2)

      vi.setSystemTime(new Date(2024, 9, 9))
      expect(expenseSchedule.status).toEqual('OVERDUE')
    })
  })
})