import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

type MessageError = {
  message: string
}

describe('CSRF Middleware', () => {
  it('when CSRF token is missing, then should return 403 status', async () => {
    const response = await request(app).post('/v1/expenses').send({})

    expect(response.status).toEqual(403)
  })

  it('when CSRF token is missing, then should return a message error', async () => {
    const response = await request(app).post('/v1/expenses').send({})

    const requestBody: MessageError = response.body

    expect(requestBody.message).toEqual('CSRF token not provided. Please, request a new CSRF token at /csrf-token.')
  })

  it('when CSRF token is invalid, then should return forbidden status code', async () => {
    const response = await request(app)
      .post('/v1/expenses')
      .set('x-csrf-token', 'invalid-csrf-token')
      .send({})

    expect(response.status).toEqual(403)
  })

  it('when CSRF token is invalid, then should return a message error', async () => {
    const response = await request(app)
      .post('/v1/expenses')
      .set('x-csrf-token', 'invalid-csrf-token')
      .send({})

    const responseBody: MessageError = response.body

    expect(responseBody.message).toEqual('CSRF token provided is invalid. Please, request a new CSRF token at /csrf-token.')
  })

  it('when CSRF token is provided and valid, then shouldn\'t return any errors', async () => {
    const csrfTokenResponse = await request(app)
      .get('/csrf-token')

    const csrfToken = csrfTokenResponse.body['csrfToken']
    const csrfCookies = csrfTokenResponse.headers['set-cookie']

    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', csrfCookies)
      .set('x-csrf-token', csrfToken)
      .send({
        description: 'Credit bill',
        amount: 100
      })

    expect(response.status).not.toEqual(403)
  })
})