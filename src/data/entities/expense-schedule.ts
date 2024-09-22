import { ExpenseScheduleStatus } from '@/data/value-objects/expense-schedule-status'
import { Expense } from './expense'

export class ExpenseSchedule {
  private readonly _expenses: Expense[]
  private _month: string | undefined

  constructor() {
    this._expenses = []
  }

  include(expense: Expense) {
    this._expenses.push(expense)

    this._month = this.determineMonthBasedOnExpensesDueDate()
  }

  determineMonthBasedOnExpensesDueDate() {
    const date = new Date()
    const currentMonth = date.getMonth()
    const currentDate = date.getDate()

    let month = undefined

    this.expenses.forEach(e => {
      if (e.dueDate <= currentDate) {
        const currentYear = date.getFullYear()
        const nextMonthIndex = currentMonth + 1
        month = new Date(currentYear, nextMonthIndex).toLocaleString('default', { month: 'long' })
      }
    })

    return month
  }

  get expenses(): Expense[] {
    return this._expenses
  }

  get month() {
    return this._month
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