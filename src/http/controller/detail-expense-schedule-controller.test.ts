import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { Request, Response } from 'express'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import db from '@/infra/database'
import app from '@/http/app'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import DetailExpenseScheduleController from './detail-expense-schedule-controller'

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

  it('when an unpexpected error is thrown, then should return internal server error', async () => {
    const repository = new ExpenseScheduleRepositoryRelationalDatabase()

    vitest.spyOn(repository, 'getById').mockReturnValueOnce(Promise.reject(new Error('Internal server error')))

    const controller = new DetailExpenseScheduleController(repository)

    const requestParams = {
      params: {
        id: '123'
      }
    } as unknown as Request

    const responseParams = {
      status: vitest.fn().mockReturnThis(),
      send: vitest.fn()
    } as unknown as Response

    await controller.handle(requestParams, responseParams)

    expect(responseParams.status).toBeCalledWith(500)
    expect(responseParams.send).toBeCalledWith({
      message: 'Internal server error'
    })
  })

  it('when the schedule is not found, then should return not found', async () => {
    vi.setSystemTime(new Date('2024-10-04'))

    const id = falso.randUuid()

    const response = await request(app).get(`/v1/schedules/${id}`)

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: 'Schedule not found'
    })
  })
})