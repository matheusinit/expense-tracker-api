import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '../app'
import { ExpenseDTO } from '../dtos/expense'
import db from '../database'

type OffsetPaginationDTO = {
  records: ExpenseDTO[],
  _metadata: {
    page: number
    per_page: number
    page_count: number
    total_count: number
  }
}

const generateExpenses = (length: number) => {
  const expenses = []
  for (let i = 0; i < length; i++) {
    const description = falso.randProductName()
    const amount = falso.randAmount({ fraction: 0 })
    expenses.push({
      description,
      amount,
    })
  }
  return expenses
}

describe('Given view expenses controller', () => {
  beforeEach(async () => {
    await db.$connect()
    await db.expense.deleteMany()
    await db.$disconnect()
  })

  it('when is given none parameters, then should return the expenses page based pagination', async () => {
    const expenses = generateExpenses(10)

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

  it('when an expense is added, then should return the expense in the page based pagination', async () => {
    const expense = generateExpenses(1).at(0)

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

  it('when multiple expenses is added, then should return expenses in multiple pages', async () => {
    const expenses = generateExpenses(10)

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
    expect(responseBody.records.length).toEqual(5)
    expect(responseBody._metadata.page).toEqual(1)
    expect(responseBody._metadata.page_count).toEqual(2)
    expect(responseBody._metadata.per_page).toEqual(5)

  })

  it('when request a specific page, then should return expenses from that page and metadata correctly', async () => {
    const expenses = generateExpenses(10)

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

    const page = 2

    const response = await request(app)
      .get('/v1/expenses')
      .query({ page })

    const responseBody: OffsetPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(5)
    expect(responseBody._metadata.page).toEqual(page)
    expect(responseBody._metadata.page_count).toEqual(2)
    expect(responseBody._metadata.per_page).toEqual(5)
  })

  it('when specify the page size, then should return the number of expenses specified by page size', async () => {
    const expenses = generateExpenses(10)

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

    const pageSize = 10

    const response = await request(app)
      .get('/v1/expenses')
      .query({ pageSize })

    const responseBody: OffsetPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(pageSize)
    expect(responseBody._metadata.page).toEqual(1)
    expect(responseBody._metadata.page_count).toEqual(1)
    expect(responseBody._metadata.per_page).toEqual(pageSize)
  })

  it('when specify the page size and page, then should return the number of expenses specified by page size at specific page', async () => {
    const expenses = generateExpenses(15)

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

    const page = 2
    const pageSize = 10

    const query = {
      page,
      pageSize
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: OffsetPaginationDTO = response.body
    const pageCount = Math.ceil(expenses.length / pageSize)

    const recordsLength = expenses.length - pageSize * (page - 1)

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(recordsLength)
    expect(responseBody._metadata.page).toEqual(page)
    expect(responseBody._metadata.page_count).toEqual(pageCount)
    expect(responseBody._metadata.per_page).toEqual(pageSize)
    expect(responseBody._metadata.total_count).toEqual(expenses.length)
  })
})
