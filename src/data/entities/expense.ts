import { z } from 'zod'
import { ExpenseSchedule } from './expense-schedule'

type UpdateExpense = {
  description?: string
  amount?: number | null
  dueDate?: number
}

export class Expense {
  private _description!: string
  private _amount!: number
  private _dueDate!: number
  private _paidAt: Date | null
  private _expenseSchedule: ExpenseSchedule | null

  constructor(description: string, amount: number | null, dueDate?: number) {
    this.description = description
    this.amount = amount
    this.dueDate = dueDate ?? 10
    this._paidAt = null
    this._expenseSchedule = null
  }

  get description(): string {
    return this._description
  }

  set description(value: string) {
    if (!value) {
      throw new Error('Description is required')
    }

    if (value.length > 255) {
      throw new Error('Description length cannot be greather than 255')
    }

    this._description = value
  }

  get amount(): number {
    return this._amount
  }

  set amount(value: number | null) {
    if (value === null) {
      throw new Error('Amount is required. It should be greater than 0')
    }

    if (value === 0) {
      throw new Error('Invalid value for amount. It should be greater than 0.')
    }

    if (value < 0) {
      throw new Error('Amount cannot be a negative value. It should be greater than 0')
    }

    this._amount = value
  }

  get dueDate(): number {
    return this._dueDate
  }

  set dueDate(value: number) {
    const schema = z.number().min(1).max(31)

    const dueDateIsValid = schema.safeParse(value).success

    if (!dueDateIsValid) {
      throw new Error('Invalid value for dueDate. It should be in interval of days of a month.')
    }

    this._dueDate = value
  }

  update({ description, amount, dueDate }: UpdateExpense): void {
    if (description !== undefined) {
      this.description = description
    }

    if (amount !== undefined) {
      this.amount = amount
    }

    if (dueDate !== undefined) {
      this.dueDate = dueDate
    }
  }

  pay() {
    this._paidAt = new Date()

    this._expenseSchedule?.determineIfAllExpensesArePaid()
  }

  get paidAt() {
    return this._paidAt
  }

  set expenseSchedule(value: ExpenseSchedule | null) {
    this._expenseSchedule = value
  }

  get expenseSchedule() {
    return this._expenseSchedule
  }
}