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

  it('when amount equals undefined is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('Credit card bill', undefined)

    expect(classInstantiation).toThrowError('Amount is required. It should be greater than 0')
  })

  it('when amount less than 0 is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('Credit card bill', -100)

    expect(classInstantiation).toThrowError('Amount cannot be a negative value. It should be greater than 0')
  })

  it('when a valid description and amount is provided, should create a new expense', () => {
    const expense = new Expense('Credit card bill', 100)

    expect(expense.description).toBe('Credit card bill')
    expect(expense.amount).toBe(100)
  })
})