import { describe, it, expect } from 'vitest'

import request from 'supertest'
import app from '@/http/app'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'

describe('Given schedule expenses controller', () => {
  it('when is provided a expense, then should return the data in response body', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

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
      description: expect.any(String),
      totalAmount: expense.amount * 100,
      status: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null
    }))
  })

  it('when is provided a expense, then the id should not be equal to expense id', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

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

    expect(responseBody.id).not.toEqual(expenseId)
  })

  it('when is provided a expense, then should return with status OPEN', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

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

    expect(responseBody.status).toEqual('OPEN')
  })
})