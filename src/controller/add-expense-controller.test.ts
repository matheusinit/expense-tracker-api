import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'
import { MessageErrorDTO } from '../dtos/error-message'

type ExpenseResponseDTO = {
  id: string
  description: string
  amount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

describe('Given add expense controller', () => {
  it('when required data is provided, then should return the data in response body', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 100
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
      .send(expense)

    const responseBody: ExpenseResponseDTO = response.body

    expect(responseBody.description).toEqual(expense.description)
    expect(responseBody.amount).toEqual(expense.amount)
  })

  it('when required field description is missing, then should return bad request status and message error', async () => {
    const expense = {
      amount: 100
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
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

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount')
  })

  it('when all required fields is missing, then should return message error listing all fields', async () => {
    const expense = {}

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount, description')
  })

  it('when all required fields is missing, then should return bad request status code', async () => {
    const expense = {}

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Missing required fields: amount, description')
  })

  it('when a required field is invalid, then should return bad request', async () => {
    const expense = {
      description: 'Credit card bill',
      amount: 0
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0)

    const response = await request.agent(app)
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .post('/v1/expenses')
      .send(expense)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toEqual(400)
    expect(responseBody.message).toEqual('Invalid value for amount. It should be greater than 0')
  })
})
