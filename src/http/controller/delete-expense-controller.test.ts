import { afterAll, afterEach, beforeAll, describe, expect, it, vitest } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '@/http/app'
import db from '@/infra/database'
import { generateExpenses } from '@/utils/tests/generate-expenses'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { MessageErrorDTO } from '@/data/dtos/error-message'
import { ExpenseDTO } from '@/data/dtos/expense'
import DeleteExpenseController from './delete-expense-controller'
import ExpenseRepositoryRelationalDatabase from '@/infra/database/repository/expense-repository'
import { Request, Response } from 'express'

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

    const index = falso.randNumber({ min: 0, max: 9 })

    const expense = expensesResponse[index]

    const id = expense.id

    await request(app)
      .delete(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const response = await request(app)
      .delete(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(404)
    expect(responseBody.message).toBe('Resource already deleted')
  })

  it('when is given a valid id, then should return no content', async () => {
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

    const index = falso.randNumber({ min: 0, max: 9 })

    const expense = expensesResponse[index]

    const id = expense.id

    const response = await request(app)
      .delete(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send()

    const responseBody = response.body

    expect(response.status).toBe(204)
    expect(responseBody).toEqual({})
  })

  it('when a error is thrown, then should return internal server error', async () => {

    const expenseRepository = new ExpenseRepositoryRelationalDatabase()

    vitest.spyOn(expenseRepository, 'get').mockReturnValueOnce(Promise.reject(new Error('Internal server error')))

    const controller = new DeleteExpenseController(expenseRepository)

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
})