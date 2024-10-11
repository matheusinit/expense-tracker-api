import db from '@/infra/database'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import request from 'supertest'
import app from '@/http/app'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'

describe('Given detail expense schedule controller', () => {
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

  it('when none parameters is provided, then should return the details of schedule', async () => {
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

    const response = await request(app).get(`/v1/schedules/${expenseScheduleId}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      id: expenseScheduleId,
      status: 'OPEN',
      period: expenseScheduleResponse.body['period']
    }))
  })
})