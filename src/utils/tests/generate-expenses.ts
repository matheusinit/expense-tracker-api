import * as falso from '@ngneat/falso'

export const generateExpenses = (length: number) => {
  const generateExpense = () => {
    const description = falso.randProductName()
    const amount = falso.randAmount({ fraction: 0 })
    return { description, amount }
  }

  const expenses = Array(length).fill(0).map(generateExpense)

  return expenses
}