import { describe, it, expect, vitest } from 'vitest'

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

    const expenseScheduleModel: ExpenseScheduleModel = expenseScheduleResponse
      .body

    expect(expenseSchedule).toEqual(expect.objectContaining({
      id: expenseScheduleModel.id,
      totalAmount: expenseScheduleModel.totalAmount,
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
    // eslint-disable-next-line @stylistic/max-len
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
})