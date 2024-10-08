import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Expense } from '@/data/entities/expense'

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
    expect(expense.amount).toBe(10000)
  })

  it('when due date is not provided, should set default value as 10', () => {
    const expense = new Expense('Credit card bill', 100)

    expect(expense.dueDate).toBe(10)
  })

  it('when a number with decimal places is provided, should not truncate amount', () => {
    const expense = new Expense('Credit card bill', 200.5, 10)

    expect(expense.amount).not.toBe(200)
  })

  it('when the amount is provided, then should set to cents format as integer', () => {
    const expense = new Expense('Credit card bill', 200.5, 10)

    expect(expense.amount).toBe(20050)
  })
})

const makeSut = () => new Expense('Credit card bill', 100, 10)

describe('Given is needed to update a expense,', () => {
  it('when a empty description is provided, should throw an exception', () => {
    const expense = makeSut()

    const updateExpense = () => expense.update({
      description: ''
    })

    expect(updateExpense).toThrowError('Description is required')
  })

  it('when a description greater than 255 of length is provided, should throw an exception', () => {
    const expense = makeSut()

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
    const expense = makeSut()

    const updateExpense = () => expense.update({
      amount: 0
    })

    expect(updateExpense).toThrowError('Invalid value for amount. It should be greater than 0.')
  })

  it('when amount equals null is provided, should throw an exception', () => {
    const expense = makeSut()
    const updateExpense = () => expense.update({
      amount: null
    })

    expect(updateExpense).toThrowError('Amount is required. It should be greater than 0')
  })

  it('when amount less than 0 is provided, should throw an exception', () => {
    const expense = makeSut()

    const updateExpense = () => expense.update({
      amount: -100
    })

    expect(updateExpense).toThrowError('Amount cannot be a negative value. It should be greater than 0')
  })

  it('when a valid description and amount is provided, should update expense', () => {
    const expense = makeSut()

    expense.update({
      description: 'Credit card bill updated',
      amount: 200
    })

    expect(expense.description).toBe('Credit card bill updated')
    expect(expense.amount).toBe(20000)
  })
})

describe('Given is needed to pay a expense,', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('when a expense is paid, should set payment date', () => {
    const expense = makeSut()

    expense.pay()

    expect(expense.paidAt).not.toBeNull()
  })

  it('when a expense is paid, should set payment date as today', () => {
    const expense = makeSut()

    expense.pay()

    expect(expense.paidAt?.toDateString()).toBe(new Date().toDateString())
  })

  it('when a expense is paid, should set payment date as now', () => {
    const expense = makeSut()

    expense.pay()

    expect(expense.paidAt?.getTime()).toBeGreaterThan(
      new Date().getTime() - 1000
    )
  })

  it('when a expenses is already paid, should not be able to pay again', () => {
    const expense = makeSut()
    vi.setSystemTime(new Date('2024-01-01'))

    expense.pay()

    const firstPaymentDateTime = expense.paidAt

    vi.setSystemTime(new Date('2024-01-02'))
    const paymentTry = () => expense.pay()

    expect(expense.paidAt).toEqual(firstPaymentDateTime)
    expect(paymentTry).toThrowError('Expense already paid')
  })
})