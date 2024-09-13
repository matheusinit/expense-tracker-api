import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '@/app'
import db from '@/database'
import { MessageErrorDTO } from '@/dtos/error-message'
import { generateExpenses } from '@/utils/tests/generate-expenses'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'

describe('Given update expense controller', () => {
  beforeAll(async () => {
    await db.$connect()
  })

  afterEach(async () => {
    await db.expense.deleteMany({})
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  it('when is given a non-valid id, then should return not found error', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const id = falso.randUuid()

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(404)
    expect(responseBody.message).toBe('Expense not found')
  })

  it('when is not given any field to update, then should return bad request error', async () => {
    const expense = generateExpenses(1).at(0)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('At least one field must be provided')
  })
})