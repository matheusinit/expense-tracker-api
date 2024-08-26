import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('CSRF Middleware', () => {
  it('when CSRF token is missing, then should return 403 status', async () => {
    const response = await request(app).post('/v1/expenses').send({})

    expect(response.status).toEqual(403)
  })
})