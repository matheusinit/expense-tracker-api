import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import db from '@/infra/database'
import app from '../app'
import { ErrorMessage } from '@/data/dtos/error-message'
import { ExpenseModel } from '@/data/models/expense-model'
import { PageBasedPagination } from '@/data/dtos/page-based-pagination'

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

  it('given an invalid id, when attempts to retrieve the resource associated with id, then should return not found error', async () => {
    const id = falso.randUuid()

    const response = await request(app).get(`/v1/schedules/${id}/expenses`)

    const responseBody: ErrorMessage = response.body

    expect(response.statusCode).toBe(404)
    expect(responseBody.message).toBe('Expense schedule not found')
  })

  it('given a valid id, when attempts to retrieve the resource associated with id, then should return ok status', async () => {
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

    const id = expenseScheduleResponse.body.id

    const response = await request(app)
      .get(`/v1/schedules/${id}/expenses`)
      .send()

    expect(response.statusCode).toBe(200)
  })

  it('given a valid id, when attempts to retrieve the resource associated with id, then should return the expenses', async () => {
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

    const id = expenseScheduleResponse.body.id

    const response = await request(app)
      .get(`/v1/schedules/${id}/expenses`)
      .send()

    const responseBody: PageBasedPagination<ExpenseModel> = response.body

    expect(Array.isArray(responseBody.records)).toEqual(true)
    expect(responseBody.records).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: expenseId }),
      expect.objectContaining({ id: expense2Id })
    ]))
  })
})