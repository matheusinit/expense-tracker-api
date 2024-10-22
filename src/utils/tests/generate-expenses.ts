import * as falso from '@ngneat/falso'

export const generateExpenses = (length: number, minDate?: number, maxDate?: number) => {
  const generateExpense = () => {
    const description = falso.randProductName()
    const amount = falso.randAmount({ fraction: 0 })
    const dueDate = falso.randNumber({ min: minDate ?? 1, max: maxDate ?? 31 })
    return { description, amount, dueDate }
  }

  const expenses = Array(length).fill(0).map(generateExpense)

  return expenses
}