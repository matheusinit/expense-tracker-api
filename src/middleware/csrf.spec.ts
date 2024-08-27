import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

type MessageError = {
  message: string
}

describe('CSRF Middleware', () => {
  it('when CSRF token is not provided in HTTP headers, then should return forbidden with a message error', async () => {
    const response = await request(app).post('/v1/expenses').send({})

    const requestBody: MessageError = response.body

    expect(response.status).toEqual(403)
    expect(requestBody.message).toEqual('CSRF token not provided. Please, request a new CSRF token at /csrf-token.')
  })

  it('when CSRF token is invalid, then should return forbidden with a message error', async () => {
    const response = await request(app)
      .post('/v1/expenses')
      .set('Cookie', '__Host-psifi.x-csrf-token=invalid-csrf-token')
      .set('x-csrf-token', 'invalid-csrf-token')
      .send({})

    const responseBody: MessageError = response.body

    expect(response.status).toEqual(403)
    expect(responseBody.message).toEqual('CSRF token provided is invalid. Please, request a new CSRF token at /csrf-token.')
  })

  it('when CSRF token is not provided in cookies, then should return a message error', async () => {
    const csrfToken = await request(app)
      .get('/csrf-token')
      .then(response => response.body.csrfToken)

    const response = await request(app)
      .post('/v1/expenses')
      .set('x-csrf-token', csrfToken)
      .send({})

    const requestBody: MessageError = response.body

    expect(response.status).toEqual(403)
    expect(requestBody.message).toEqual('CSRF token not provided in cookies. Please, request a new CSRF token at /csrf-token.')
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