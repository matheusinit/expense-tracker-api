import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'
import dayjs from 'dayjs'

import app from '@/app'
import db from '@/database'
import { MessageErrorDTO } from '@/dtos/error-message'
import { generateExpenses } from '@/utils/tests/generate-expenses'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { ExpenseDTO } from '@/dtos/expense'

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

  it('when is given a single field to update, then should return the resource with updated field', async () => {
    const defaultExpense = {
      amount: 0,
      description: 'Description'
    }

    const expense = generateExpenses(1).at(0) ?? defaultExpense

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id
    const payload = {
      amount: expense.amount + 50
    }

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(payload)

    const responseBody: ExpenseDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.amount).toBe(payload.amount)
  })

  it('when is given multiple fields to update, then should return the resource with updated fields', async () => {
    const defaultExpense = {
      amount: 0,
      description: 'Description'
    }

    const expense = generateExpenses(1).at(0) ?? defaultExpense

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id
    const payload = {
      description: falso.randProductName(),
      amount: expense.amount + falso.randAmount({ fraction: 0 })
    }

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(payload)

    const responseBody: ExpenseDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.amount).toBe(payload.amount)
    expect(responseBody.description).toBe(payload.description)
  })

  it('when update successfully, then should set update timestamp', async () => {
    const defaultExpense = {
      amount: 0,
      description: 'Description'
    }

    const expense = generateExpenses(1).at(0) ?? defaultExpense

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id
    const payload = {
      description: falso.randProductName(),
      amount: expense.amount + falso.randAmount({ fraction: 0 })
    }

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(payload)

    const responseBody: ExpenseDTO = response.body

    const updatedAtIsAfterCreatedAt = dayjs(responseBody.updatedAt).isAfter(dayjs(responseBody.createdAt))

    expect(updatedAtIsAfterCreatedAt).toBeTruthy()
  })

  it('when a given field is invalid, then should return bad request', async () => {
    const defaultExpense = {
      amount: 0,
      description: 'Description'
    }

    const expense = generateExpenses(1).at(0) ?? defaultExpense

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id
    const payload = {
      amount: 0
    }

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(payload)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Invalid value for amount. It should be greater than 0.')

  })

  it('when description is provided with invalid value, then should return bad request', async () => {
    const defaultExpense = {
      amount: 0,
      description: 'Description'
    }

    const expense = generateExpenses(1).at(0) ?? defaultExpense

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expenseResponse = await request(app)
      .post('/v1/expenses/')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(expense)

    const id = expenseResponse.body.id
    const payload = {
      description: ''
    }

    const response = await request(app)
      .put(`/v1/expenses/${id}`)
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .send(payload)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Description is required')
  })
})