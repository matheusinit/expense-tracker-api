import { ExpenseScheduleStatus } from '@/data/value-objects/expense-schedule-status'
import { Expense } from './expense'

type Status = 'OPEN' | 'PAID' | 'PENDING'

export class ExpenseSchedule {
  private readonly _expenses: Expense[]
  private _month: string | undefined
  private _status: Status
  private _createdAt: Date

  constructor() {
    this._expenses = []
    this._status = 'OPEN'
    this._createdAt = new Date()
  }

  include(expense: Expense) {
    this._expenses.push(expense)

    this.associateExpense(expense)

    this._month = this.determineMonthBasedOnExpensesDueDate()
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
      const month = new Date(currentYear, nextMonthIndex).toLocaleString('default', { month: 'long' })
      return month
    }

    const month = new Date().toLocaleDateString('default', { month: 'long' })

    return month
  }

  get expenses(): Expense[] {
    return this._expenses
  }

  get month() {
    return this._month
  }

  get status() {
    this._status = this.verifyPaymentStatus()

    return this._status
  }

  private verifyPaymentStatus() {
    const currentDate = new Date().getDate()

    const expensesWithDueDateLessThanCreationDate = this.expenses.filter(
      e => e.dueDate < this._createdAt.getDate()
    )

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthIndex = monthNames.indexOf(this._month || '')

    const expensesFromNextMonth = expensesWithDueDateLessThanCreationDate

    const hasExpensesPassedDueDate = this.expenses.some(e =>
      e.dueDate < currentDate &&
      e.paidAt === null &&
      expensesFromNextMonth.includes(e) &&
      monthIndex === new Date().getMonth())

    if (hasExpensesPassedDueDate) {
      return 'OVERDUE'
    }

    const currentDateIsGreaterThanAllDueDates = this.expenses.every(
      e => e.dueDate < currentDate
    )

    if (currentDateIsGreaterThanAllDueDates) {
      const dueDates = this.expenses.map(e => e.dueDate)
      const dueDatesDescending = dueDates.sort((a, b) => b - a)

      const firstDueDate = dueDatesDescending[0]

      const hasOverdueDate = dueDatesDescending.some(
        d => d < currentDate && d >= firstDueDate
      )

      if (hasOverdueDate) {
        return 'OVERDUE'
      }
    }

    const expensesCloseToOverdue = this.expenses.filter(
      e => !e.paidAt
    ).some(e => e.dueDate >= currentDate && e.dueDate - 3 <= currentDate)

    if (expensesCloseToOverdue) {
      return 'PENDING'
    }

    const allExpensesArePaid = this.expenses.every(e => e.paidAt !== null)

    if (allExpensesArePaid) {
      return 'PAID'
    }

    return 'OPEN'
  }
}

export interface IExpenseSchedule {
  // January - December

  // Based on the billings month of payment
  month: string

  // e.g. 2024
  // Based on the billings month of payment
  year: number

  // e.g. 80000
  // Sum of cost of all expenses
  total: number

  // e.g. 'PAID', 'OVERDUE', 'OPEN'
  status: ExpenseScheduleStatus

  expenses: Expense[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}