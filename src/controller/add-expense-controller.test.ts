import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

type ExpenseResponseDTO = {
  id: string
  description: string
  amount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

describe('Given add expense controller', () => {
  it('when required data is provided, then should return the data in response body', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100
    }

    const response = await request(app).post('/v1/expenses').send(expense)

    const responseBody: ExpenseResponseDTO = response.body

    expect(responseBody.description).toEqual(expense.description)
    expect(responseBody.amount).toEqual(expense.amount)
  })
})
