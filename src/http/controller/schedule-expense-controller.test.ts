import { describe, it, expect, vitest, afterAll, afterEach, beforeAll, vi, beforeEach } from 'vitest'

import { Request, Response } from 'express'

import request from 'supertest'
import app from '@/http/app'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import db from '@/infra/database'
import * as falso from '@ngneat/falso'
import { ExpenseScheduleModel } from '@/data/models/expense-schedule-model'
import { ExpenseScheduleRepositoryRelationalDatabase } from '@/infra/database/repository/expense-schedule-repository'
import ScheduleExpenseController from './schedule-expense-controller'
import { ScheduleExpenseService } from '@/data/services/schedule-expense'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { ExpenseScheduleDTO } from '@/data/dtos/expense-schedule'
import { convertAmountToCents } from '@/utils/tests/convertAmountToCents'

describe('Given schedule expenses controller', () => {
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

  it('when is provided a expense, then should return the data in response body', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
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

    const responseBody: ExpenseScheduleModel = response.body

    expect(response.statusCode).toEqual(201)
    expect(responseBody).toEqual(expect.objectContaining({
      id: expect.any(String),
      totalAmount: expect.any(Number),
      status: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null
    }))
  })

  it('when is provided a expense, then the id should not be equal to expense id', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
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

    const responseBody: ExpenseScheduleModel = response.body

    expect(responseBody.id).not.toEqual(expenseId)
  })

  it('when is provided a expense, then should return with status OPEN', async () => {
    vi.setSystemTime(new Date('2024-10-04'))

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

    const responseBody: ExpenseScheduleModel = response.body

    expect(responseBody.status).toEqual('OPEN')
  })

  it('when is provided a expense, then should be stored in database', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
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

    const expenseScheduleResponse = await request(app)
      .post(`/v1/expenses/${expenseId}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const expenseSchedule = await db.expenseSchedule.findFirst({
      where: {
        id: expenseScheduleResponse.body.id
      }
    })

    const expenseScheduleModel: ExpenseScheduleDTO = expenseScheduleResponse
      .body

    expect(expenseSchedule).toEqual(expect.objectContaining({
      id: expenseScheduleModel.id,
      period: new Date(expenseScheduleModel.period),
      status: 'OPEN',
      createdAt: new Date(expenseScheduleModel.createdAt),
      updatedAt: new Date(expenseScheduleModel.updatedAt),
      deletedAt: null
    }))
  })

  it('when is provided an invalid expense id, then should return status 404', async () => {
    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const invalidId = falso.randUuid()

    const response = await request(app)
      .post(`/v1/expenses/${invalidId}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    expect(response.statusCode).toEqual(404)
  })

  it('when multiple expenses are scheduled, then should expense schedule be the same', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
    const expense1 = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const expense2 = {
      description: 'Internet bill',
      amount: 50,
      dueDate: 10
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const expenseResponse1 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense1)

    const expenseId1 = expenseResponse1.body['id']

    const expenseResponse2 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense2)

    const expenseId2 = expenseResponse2.body['id']

    const response1 = await request(app)
      .post(`/v1/expenses/${expenseId1}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const responseBody1: ExpenseScheduleModel = response1.body

    const response2 = await request(app)
      .post(`/v1/expenses/${expenseId2}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const responseBody2: ExpenseScheduleModel = response2.body

    expect(responseBody1.id).toEqual(responseBody2.id)

  })

  it('when a error is thrown, then should return internal server error', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
    const expenseScheduleRepository = new ExpenseScheduleRepositoryRelationalDatabase()
    const expenseRepository = new ExpenseRepositoryRelationalDatabase()

    const service = new ScheduleExpenseService(
      expenseRepository,
      expenseScheduleRepository
    )

    vitest.spyOn(service, 'schedule').mockReturnValueOnce(Promise.reject(new Error('Internal server error')))

    const controller = new ScheduleExpenseController(service)

    const requestParams = {
      params: {
        id: '123'
      }
    } as unknown as Request

    const responseParams = {
      status: vitest.fn().mockReturnThis(),
      send: vitest.fn(),
      json: vitest.fn()
    } as unknown as Response

    await controller.handle(requestParams, responseParams)

    expect(responseParams.status).toBeCalledWith(500)
    expect(responseParams.send).toBeCalledWith({
      message: 'Internal server error'
    })
  })

  it('when delete a expense from multiple expenses scheduled, then expense should not be taken for total amount calculation', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
    const expense1 = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const expense2 = {
      description: 'Internet bill',
      amount: 50,
      dueDate: 10
    }

    const expense3 = {
      description: 'Phone bill',
      amount: 63,
      dueDate: 12
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const expenseResponse1 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense1)

    const expenseId1 = expenseResponse1.body['id']

    const expenseResponse2 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense2)

    const expenseId2 = expenseResponse2.body['id']

    const expenseResponse3 = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense3)

    const expenseId3 = expenseResponse3.body['id']

    await request(app)
      .post(`/v1/expenses/${expenseId1}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    await request(app)
      .post(`/v1/expenses/${expenseId2}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const deleteResponse = await request(app)
      .delete(`/v1/expenses/${expenseId2}`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const expenseScheduleResponse = await request(app)
      .post(`/v1/expenses/${expenseId3}/schedule`)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)

    const expenseSchedule: ExpenseScheduleDTO = expenseScheduleResponse.body

    const totalAmount = convertAmountToCents(expense1.amount)
      + convertAmountToCents(expense3.amount)
    expect(deleteResponse.statusCode).toEqual(204)
    expect(expenseSchedule.totalAmount).toEqual(totalAmount)
  })

  it('when is provided a expense, then should return the total amount of the expense correctly', async () => {
    vi.setSystemTime(new Date('2024-10-04'))
    const expense = {
      description: 'Internet bill',
      amount: 93.54,
      dueDate: 15
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

    const responseBody: ExpenseScheduleDTO = response.body

    expect(responseBody.totalAmount).toEqual(9354)
  })

  describe('Given there is a expense schedule', () => {
    it('when is provided a expense for next month, then should return the period of next month', async () => {
      vi.setSystemTime(new Date('2024-10-04'))
      const expense = {
        description: 'Internet bill',
        amount: 93.54,
        dueDate: 15
      }

      const { cookies, csrfToken } = await getCSRFTokenAndCookies()

      const expenseResponse = await request(app)
        .post('/v1/expenses')
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send(expense)

      const expenseId = expenseResponse.body['id']

      await request(app)
        .post(`/v1/expenses/${expenseId}/schedule`)
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)

      const expense2 = {
        description: 'Phone bill',
        amount: 63.99,
        dueDate: 1
      }

      const expenseResponse2 = await request(app)
        .post('/v1/expenses')
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send(expense2)

      const expenseId2 = expenseResponse2.body['id']

      const response2 = await request(app)
        .post(`/v1/expenses/${expenseId2}/schedule`)
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)

      const responseBody: ExpenseScheduleDTO = response2.body

      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)
      nextMonth.setDate(0)
      const nextMonthDate = nextMonth.toISOString().split('T')[0]
      expect(responseBody.period.split('T')[0]).toEqual(nextMonthDate)
    })

    it('when is provided a expense for next month, then should return the status \'SCHEDULED\'', async () => {
      vi.setSystemTime(new Date('2024-10-04'))
      const expense = {
        description: 'Internet bill',
        amount: 93.54,
        dueDate: 15
      }

      const { cookies, csrfToken } = await getCSRFTokenAndCookies()

      const expenseResponse = await request(app)
        .post('/v1/expenses')
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send(expense)

      const expenseId = expenseResponse.body['id']

      await request(app)
        .post(`/v1/expenses/${expenseId}/schedule`)
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)

      const expense2 = {
        description: 'Phone bill',
        amount: 63.99,
        dueDate: 1
      }

      const expenseResponse2 = await request(app)
        .post('/v1/expenses')
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)
        .send(expense2)

      const expenseId2 = expenseResponse2.body['id']

      const response2 = await request(app)
        .post(`/v1/expenses/${expenseId2}/schedule`)
        .set('Cookie', cookies)
        .set('x-csrf-token', csrfToken)

      const responseBody: ExpenseScheduleDTO = response2.body

      expect(responseBody.status).toEqual('SCHEDULED')
    })
  })
})