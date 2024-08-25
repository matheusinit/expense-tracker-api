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

type MessageErrorDTO = {
  message: string
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

  it('when required field description is missing, then should return bad request status and message error', async () => {
    const expense = {
      amount: 100
    }

    const response = await request(app).post('/v1/expenses').send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: description')
  })
})
