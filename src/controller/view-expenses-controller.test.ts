import { describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '../app'
import { ExpenseDTO } from '../dtos/expense'

type OffsetPaginationDTO = {
  records: ExpenseDTO[],
  _metadata: {
    page: number
    per_page: number
    page_count: number
    total_count: number
  }
}

describe('Given view expenses controller', () => {
  it('when is given none parameters, then should return the expenses offset pagination', async () => {
    const expenses = new Array(10).fill({
      description: falso.randProductName(),
      amount: falso.randAmount()
    })

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const response = await request(app)
      .get('/v1/expenses')

    const responseBody: OffsetPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toBeInstanceOf(Array)
    expect(responseBody._metadata.page).toBeTypeOf('number')
    expect(responseBody._metadata.per_page).toBeTypeOf('number')
    expect(responseBody._metadata.page_count).toBeTypeOf('number')
    expect(responseBody._metadata.total_count).toBeTypeOf('number')
  })

  it('when an expense is added, then should return the expense in the offset pagination', async () => {
    const expense = {
      description: falso.randProductName(),
      amount: falso.randAmount({ fraction: 0 })
    }

    const csrfResponse = await request(app).get('/csrf-token')
    const csrfToken = csrfResponse.body['csrfToken']

    const cookies = csrfResponse.headers['set-cookie'].at(0) ?? ''

    await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const response = await request(app)
      .get('/v1/expenses')

    const responseBody: OffsetPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toEqual(expect.arrayContaining([expect.objectContaining(expense)]))
  })
})
