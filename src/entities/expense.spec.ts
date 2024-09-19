import { describe, expect, it } from 'vitest'
import { Expense } from '@/entities/expense'

describe('Given is needed to create a expense,', () => {
  it('when a empty description is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('', 100)

    expect(classInstantiation).toThrowError('Description is required')
  })

  it('when a description greater than 255 of length is provided, should throw an exception', () => {

    const description = 'Eos laborum labore consequuntur voluptatem beatae in eos, \
    repellat possimus voluptate quos cupiditate dicta vel. Ipsum esse occaecati \
    magnam. Dolores labore qui deserunt unde qui, sequi at sequi doloribus beatae \
    facilis tenetur. Est repellat deserunt ducb.'

    const classInstantiation = () => new Expense(description, 100)

    expect(classInstantiation).toThrowError('Description length cannot be greather than 255')
  })

  it('when amount equals 0 is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('Credit card bill', 0)

    expect(classInstantiation).toThrowError('Invalid value for amount. It should be greater than 0.')
  })

  it('when amount equals null is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('Credit card bill', null)

    expect(classInstantiation).toThrowError('Amount is required. It should be greater than 0')
  })

  it('when amount less than 0 is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('Credit card bill', -100)

    expect(classInstantiation).toThrowError('Amount cannot be a negative value. It should be greater than 0')
  })

  it('when a valid description and amount is provided, should create a new expense', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    expect(expense.description).toBe('Credit card bill')
    expect(expense.amount).toBe(100)
  })

  it('when due date is not provided, should set default value as 10', () => {
    const expense = new Expense('Credit card bill', 100)

    expect(expense.dueDate).toBe(10)
  })
})

describe('Given is needed to update a expense,', () => {
  it('when a empty description is provided, should throw an exception', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    const updateExpense = () => expense.update({
      description: ''
    })

    expect(updateExpense).toThrowError('Description is required')
  })

  it('when a description greater than 255 of length is provided, should throw an exception', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    const description = 'Eos laborum labore consequuntur voluptatem beatae in eos, \
    repellat possimus voluptate quos cupiditate dicta vel. Ipsum esse occaecati \
    magnam. Dolores labore qui deserunt unde qui, sequi at sequi doloribus beatae \
    facilis tenetur. Est repellat deserunt ducb.'

    const updateExpense = () => expense.update({
      description
    })

    expect(updateExpense).toThrowError('Description length cannot be greather than 255')
  })

  it('when amount equals 0 is provided, should throw an exception', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    const updateExpense = () => expense.update({
      amount: 0
    })

    expect(updateExpense).toThrowError('Invalid value for amount. It should be greater than 0.')
  })

  it('when amount equals null is provided, should throw an exception', () => {
    const expense = new Expense('Credit card bill', 100, 10)
    const updateExpense = () => expense.update({
      amount: null
    })

    expect(updateExpense).toThrowError('Amount is required. It should be greater than 0')
  })

  it('when amount less than 0 is provided, should throw an exception', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    const updateExpense = () => expense.update({
      amount: -100
    })

    expect(updateExpense).toThrowError('Amount cannot be a negative value. It should be greater than 0')
  })

  it('when a valid description and amount is provided, should update expense', () => {
    const expense = new Expense('Credit card bill', 100, 10)

    expense.update({
      description: 'Credit card bill updated',
      amount: 200
    })

    expect(expense.description).toBe('Credit card bill updated')
    expect(expense.amount).toBe(200)
  })
})