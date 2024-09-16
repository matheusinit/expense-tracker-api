import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '@/app'
import db from '@/database'
import { generateExpenses } from '@/utils/tests/generate-expenses'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { MessageErrorDTO } from '@/dtos/error-message'
import { ExpenseDTO } from '@/dtos/expense'

describe('Given remove expense controller', () => {
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
      .delete(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(404)
    expect(responseBody.message).toBe('Expense not found')
  })

  it('when is given an id of resource already deleted, then should return not found error ', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expensesResponse: ExpenseDTO[] = []

    for (const expense of expenses) {
      const response = await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)

      expensesResponse.push(response.body)
    }

    const index = falso.randNumber({ min: 1, max: 10 })

    const expense = expensesResponse[index]

    const id = expense.id

    const response = await request(app)
      .delete(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(404)
    expect(responseBody.message).toBe('Resource already deleted')
  })
})