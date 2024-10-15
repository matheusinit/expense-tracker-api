import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import db from '@/infra/database'
import app from '../app'
import { MessageErrorDTO } from '@/data/dtos/error-message'

describe('View expenses from expense schedule controller', () => {
  beforeAll(async () => {
    await db.$connect()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    vi.useRealTimers()

    await db.expenseToExpenseSchedule.deleteMany({})
    await db.expenseSchedule.deleteMany({})
    await db.expense.deleteMany({})
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  it('Given an invalid id, when attempts to retrieve the resource associated with id, then should return not found error', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
    const expense = {
      description: 'Credit card',
      amount: 95.50,
      dueDate: 10
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const expenseResponse1 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const expenseId = expenseResponse1.body.id

    await request(app)
      .post(`/v1/expenses/${expenseId}/schedules`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send()

    const expense2 = {
      description: 'Gym',
      amount: 85.45,
      dueDate: 10
    }

    const expenseResponse2 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense2)

    const expense2Id = expenseResponse2.body.id

    const expenseScheduleResponse = await request(app)
      .post(`/v1/expenses/${expense2Id}/schedules`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send()

    const expenseScheduleId = expenseScheduleResponse.body.id

    const response = await request(app).get(`/v1/schedules/${expenseScheduleId}/expenses`)

    const responseBody: MessageErrorDTO = response.body

    expect(response.statusCode).toBe(404)
    expect(responseBody.message).toBe('Expense schedule not found')
  })
})