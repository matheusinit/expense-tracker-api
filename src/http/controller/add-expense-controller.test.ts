import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '@/http/app'
import * as falso from '@ngneat/falso'

import { MessageErrorDTO } from '@/data/dtos/error-message'
import { ExpenseModel } from '@/data/models/expense-model'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { convertAmountToCents } from '@/utils/tests/convertAmountToCents'

describe('Given add expense controller', () => {
  it('when required data is provided, then should return the data in response body', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken'] ?? ''

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: ExpenseModel = response.body
    const amountInCents = convertAmountToCents(expense.amount)

    expect(responseBody.description).toEqual(expense.description)
    expect(responseBody.amount).toEqual(amountInCents)
  })

  it('when required field description is missing, then should return bad request status and message error', async () => {
    const expense = {
      amount: 100
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: description')
  })

  it('when required field amount is missing, then should return bad request status and message error', async () => {
    const expense = {
      description: 'Credit card bill'
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount')
  })

  it('when all required fields is missing, then should return message error listing all fields', async () => {
    const expense = {}

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount, description, dueDate')
  })

  it('when all required fields is missing, then should return bad request status code', async () => {
    const expense = {}

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount, description, dueDate')
  })

  it('when a required field is invalid, then should return bad request', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 0,
      dueDate: 10
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Invalid value for amount. It should be greater than 0.')
  })

  it('when valid required fields is provided, then should return created', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100,
      dueDate: 10
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const amountInCents = convertAmountToCents(expense.amount)

    expect(response.status).toEqual(201)
    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(String),
      description: expense.description,
      amount: amountInCents,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null
    }))
  })

  it('when due date is not provided, then should return bad request error', async () => {
    const expense = {
      amount: 100,
      description: falso.randProductName()
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: dueDate')
  })

  it('when due date is not a number, then should return bad request error', async () => {
    const expense = {
      amount: 100,
      description: falso.randProductName(),
      dueDate: '10'
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Invalid value for dueDate. It should be in interval of days of a month.')
  })

  it('when due date is a negative, then should return bad request error', async () => {
    const expense = {
      amount: '100',
      description: falso.randProductName(),
      dueDate: falso.randNumber({ min: -9999, max: -1 })
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Invalid value for dueDate. It should be in interval of days of a month.')
  })

  it('when due date is not in range of 31-day months, then should return bad request error', async () => {
    const expense = {
      amount: '100',
      description: falso.randProductName(),
      dueDate: falso.randNumber({ min: 32, max: 999 })
    }

    const { cookies, csrfToken } = await getCSRFTokenAndCookies()

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Invalid value for dueDate. It should be in interval of days of a month.')
  })
})
