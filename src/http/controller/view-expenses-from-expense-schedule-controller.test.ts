import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import db from '@/infra/database'
import app from '../app'
import { ErrorMessage } from '@/data/dtos/error-message'
import { ExpenseModel } from '@/data/models/expense-model'
import { PageBasedPagination } from '@/data/dtos/page-based-pagination'
import { generateExpenses } from '@/utils/tests/generate-expenses'

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

  it('given a valid id, when attempts to retrieve the resource associated with id, then should return pagination metadata', async () => {
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

    expect(responseBody._metadata).toEqual({
      page: 1,
      per_page: 5,
      page_count: 1,
      total_count: 2
    })
  })

  it('given pagination query parameters, when attempts to define pagination structure, then should return records and metadata accordingly', async () => {
    vi.setSystemTime(new Date('2024-10-04'))

    const expenses = generateExpenses(10, 5, 15)

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    let id = undefined
    const expensesModels: ExpenseModel[] = []

    for (const expense of expenses) {
      const response = await request(app)
        .post('/v1/expenses')
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send(expense)

      expensesModels.push(response.body)

      const expenseId = response.body.id

      const scheduleResponse = await request(app)
        .post(`/v1/expenses/${expenseId}/schedules`)
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send()

      id = scheduleResponse.body.id
    }

    const expensesModelsToExpect = expensesModels.slice(0, 3)

    const response = await request(app)
      .get(`/v1/schedules/${id}/expenses`)
      .query({
        page: 1,
        pageSize: 3
      })
      .send()

    const responseBody: PageBasedPagination<ExpenseModel> = response.body

    expect(responseBody.records.length).toEqual(3)
    expect(responseBody.records).toEqual([
      expect.objectContaining({
        id: expensesModelsToExpect[0].id
      }),
      expect.objectContaining({
        id: expensesModelsToExpect[1].id
      }),
      expect.objectContaining({
        id: expensesModelsToExpect[2].id
      })
    ])
    expect(responseBody._metadata).toEqual({
      page: 1,
      per_page: 3,
      page_count: 4,
      total_count: 10
    })
  })
})