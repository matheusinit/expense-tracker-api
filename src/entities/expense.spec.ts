import { describe, expect, it } from 'vitest'
import { Expense } from './expense'

describe('Given is needed to create a expense,', () => {
  it('when a empty description is provided, should throw an exception', () => {
    const classInstantiation = () => new Expense('', 100)

    expect(classInstantiation).toThrowError('Description is required')
  })
})