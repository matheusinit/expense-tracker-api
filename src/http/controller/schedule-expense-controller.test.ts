import { describe, it, expect } from 'vitest'

import request from 'supertest'
import app from '@/http/app'

describe('Given schedule expenses controller', () => {
  it('when is provided a expense, then should return the data in response body', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken'] ?? ''

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const expenseResponse = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const expenseId = expenseResponse.body['id']

    const response = await request(app)
      .post(`/v1/expenses/${expenseId}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const responseBody = response.body

    expect(response.statusCode).toEqual(201)
    expect(responseBody).toEqual(expect.objectContaining({
      id: expect.any(String),
      description: expense.description,
      totalAmount: expense.amount,
      status: expense.dueDate,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null
    }))
  })
})