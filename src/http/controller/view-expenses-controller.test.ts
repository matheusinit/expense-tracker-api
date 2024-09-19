import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import * as falso from '@ngneat/falso'

import app from '@/http/app'
import db from '@/infra/database'
import { MessageErrorDTO } from '@/data/dtos/error-message'
import { generateExpenses } from '@/utils/tests/generate-expenses'
import { getCSRFTokenAndCookies } from '@/utils/tests/get-csrf-token-and-cookies'
import { ExpenseModel } from '@/data/models/expense-model'

type PageBasedPaginationDTO = {
  records: ExpenseModel[],
  _metadata: {
    page: number
    per_page: number
    page_count: number
    total_count: number
  }
}

describe('Given view expenses controller', () => {
  beforeAll(async () => {
    await db.$connect()
  })

  beforeEach(async () => {
    await db.expense.deleteMany({})
  })

  afterAll(async () => {
    await db.$disconnect()
  })

  it('when is given none parameters, then should return the expenses page based pagination', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const response = await request(app)
      .get('/v1/expenses')

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toBeInstanceOf(Array)
    expect(responseBody._metadata.page).toBeTypeOf('number')
    expect(responseBody._metadata.per_page).toBeTypeOf('number')
    expect(responseBody._metadata.page_count).toBeTypeOf('number')
    expect(responseBody._metadata.total_count).toBeTypeOf('number')
  })

  it('when an expense is added, then should return the expense in the page based pagination', async () => {
    const expense = generateExpenses(1)[0]

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    await request(app)
      .post('/v1/expenses')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send(expense)

    const response = await request(app)
      .get('/v1/expenses')

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toEqual(expect.arrayContaining([expect.objectContaining(expense)]))
  })

  it('when multiple expenses is added, then should return expenses in multiple pages', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const response = await request(app)
      .get('/v1/expenses')

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(5)
    expect(responseBody._metadata.page).toEqual(1)
    expect(responseBody._metadata.page_count).toEqual(2)
    expect(responseBody._metadata.per_page).toEqual(5)

  })

  it('when request a specific page, then should return expenses from that page and metadata correctly', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

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

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(5)
    expect(responseBody._metadata.page).toEqual(page)
    expect(responseBody._metadata.page_count).toEqual(2)
    expect(responseBody._metadata.per_page).toEqual(5)
  })

  it('when specify the page size, then should return the number of expenses specified by page size', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

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

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(pageSize)
    expect(responseBody._metadata.page).toEqual(1)
    expect(responseBody._metadata.page_count).toEqual(1)
    expect(responseBody._metadata.per_page).toEqual(pageSize)
  })

  it('when specify the page size and page, then should return the number of expenses specified by page size at specific page', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

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

    const responseBody: PageBasedPaginationDTO = response.body
    const pageCount = Math.ceil(expenses.length / pageSize)

    const recordsLength = expenses.length - pageSize * (page - 1)

    expect(response.status).toBe(200)
    expect(responseBody.records.length).toEqual(recordsLength)
    expect(responseBody._metadata.page).toEqual(page)
    expect(responseBody._metadata.page_count).toEqual(pageCount)
    expect(responseBody._metadata.per_page).toEqual(pageSize)
    expect(responseBody._metadata.total_count).toEqual(expenses.length)
  })

  it('when specify the fields filter, then should return only the fields that match the filter', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const query = {
      fields: 'description, amount'
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toEqual(expect.arrayContaining([
      {
        description: expect.any(String),
        amount: expect.any(Number)
      }
    ]))
  })

  it('when specify multiple fields filter, then should return only the fields that match the filter', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const query = {
      fields: 'id, description, amount, createdAt, updatedAt'
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        description: expect.any(String),
        amount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ]))
  })

  it('when specify non-valid field in fields filter, then should return a bad request error', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const query = {
      fields: 'id, description, amount, producedBy'
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(400)
    expect(responseBody.message).toEqual('Invalid fields: producedBy')
  })

  it('when specify multiple non-valid fields in fields filter, then should return a bad request error', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const query = {
      fields: 'id, description, amount, producedBy, createdBy'
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: MessageErrorDTO = response.body

    expect(response.status).toBe(400)
    expect(responseBody.message).toEqual('Invalid fields: producedBy, createdBy')
  })

  it('when specify any fields in fields filter, then should return the resource with all fields', async () => {
    const expenses = generateExpenses(15)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    for (const expense of expenses) {
      await request(app)
        .post('/v1/expenses')
        .set('x-csrf-token', csrfToken)
        .set('Cookie', cookies)
        .send(expense)
    }

    const query = {
      fields: ''
    }

    const response = await request(app)
      .get('/v1/expenses')
      .query(query)

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody.records).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        description: expect.any(String),
        amount: expect.any(Number),
        dueDate: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null
      }
    ]))
  })

  it('when specify valid parameters, then should not return the deleted expenses', async () => {
    const expenses = generateExpenses(10)

    const { csrfToken, cookies } = await getCSRFTokenAndCookies()

    const expensesResponse: ExpenseModel[] = []

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
      .get('/v1/expenses?pageSize=10')

    const responseBody: PageBasedPaginationDTO = response.body

    expect(response.status).toBe(200)
    expect(responseBody._metadata.total_count).toEqual(9)
    expect(responseBody.records.length).toEqual(9)
  })
})
