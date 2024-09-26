import { ExpenseScheduleStatus } from '@/data/value-objects/expense-schedule-status'
import { Expense } from './expense'

export class ExpenseSchedule {
  private readonly _expenses: Expense[]
  private _monthIndex: number | undefined
  private _status: ExpenseScheduleStatus
  private _createdAt: Date

  constructor() {
    this._expenses = []
    this._status = new ExpenseScheduleStatus()
    this._createdAt = new Date()
  }

  include(expense: Expense) {
    this._expenses.push(expense)

    this.associateExpense(expense)

    this._monthIndex = this.determineMonthBasedOnExpensesDueDate()
  }

  private associateExpense(expense: Expense) {
    expense.expenseSchedule = this
  }

  private determineMonthBasedOnExpensesDueDate() {
    const date = new Date()
    const currentMonth = date.getMonth()
    const currentDate = date.getDate()

    const dueDates = this.expenses.map(e => e.dueDate)

    const existDueDateLessThanCurrentDate = dueDates.some(d => d < currentDate)

    if (existDueDateLessThanCurrentDate) {
      const currentYear = date.getFullYear()
      const nextMonthIndex = currentMonth + 1
      const month = new Date(currentYear, nextMonthIndex).getMonth()
      return month
    }

    const month = new Date().getMonth()

    return month
  }

  get expenses(): Expense[] {
    return this._expenses
  }

  get month() {
    const date = new Date(2024, this._monthIndex || 0, 1)

    return date.toLocaleString('default', { month: 'long' })
  }

  get status() {
    const status = this.verifyPaymentStatus()

    this._status.value = status

    return this._status.value
  }

  private verifyPaymentStatus() {
    const isAnyExpensePastDue = this.isPaymentOverdue()

    if (isAnyExpensePastDue) {
      return this._status.asEnum('OVERDUE')
    }

    const expensesCloseToOverdue = this.isPaymentPending()

    if (expensesCloseToOverdue) {
      return this._status.asEnum('PENDING')
    }

    const allExpensesArePaid = this.isPaymentPaid()

    if (allExpensesArePaid) {
      return this._status.asEnum('PAID')
    }

    return this._status.asEnum('OPEN')
  }

  private isPaymentOverdue() {
    const currentDate = new Date().getDate()
    const currentMonthIndex = new Date().getMonth()

    const expensesInMonth = this.expenses.filter(
      e => e.dueDate < this._createdAt.getDate()
    )

    const isAnyInMonthExpensePastDueDate = expensesInMonth
      .filter(e => e.paidAt === null)
      .some(e => e.dueDate < currentDate) &&
      this._monthIndex === currentMonthIndex

    const expensesPastMonth = this.expenses.filter(
      e => e.dueDate > this._createdAt.getDate()
    )

    const isAnyPastMonthExpensePastDueDate = expensesPastMonth
      .filter(e => e.paidAt === null)
      .some(e => e.dueDate < currentDate)

    return isAnyInMonthExpensePastDueDate || isAnyPastMonthExpensePastDueDate
  }

  private isPaymentPending() {
    const currentDate = new Date().getDate()

    const expensesCloseToOverdue = this.expenses.filter(
      e => !e.paidAt
    ).some(e => e.dueDate >= currentDate && e.dueDate - 3 <= currentDate)

    return expensesCloseToOverdue
  }

  private isPaymentPaid() {
    return this.expenses.every(e => e.paidAt !== null)
  }
}