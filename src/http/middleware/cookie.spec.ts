import request from 'supertest'
import { describe, expect, it } from 'vitest'
import http from 'http'
import { parseCookies } from '@/http/middleware/cookie'

const server = http.createServer((request: http.IncomingMessage, response) => {
  parseCookies(request, response, () => {
    let responseBody = ''

    const contentType = request.headers['accept'] || ''
    if (contentType.includes('application/json')) {
      response.setHeader('Content-Type', 'application/json')

      responseBody = JSON.stringify(request.cookies)
    } else {
      response.setHeader('Content-Type', 'text/plain')
      responseBody = JSON.stringify(request.cookies)
    }

    response.end(responseBody)
  })
})

describe('Given cookie middleware', () => {
  it('when \'Cookie\' header is not defined, should request.cookies be a empty object', async () => {

    const response = await request(server)
      .get('/')
      .send()

    const cookies = response.body
    expect(cookies).toEqual({})
  })

  it('when cookie is passed in \'Cookie\' header, should parse cookies from header to request.cookies', async () => {

    const response = await request(server)
      .get('/')
      .accept('application/json')
      .set('Cookie', 'name=Matheus')
      .send()

    const cookies = response.body
    expect(cookies).toBeDefined()
    expect(cookies['name']).toBe('Matheus')
  })

  it('when cookie value is url enconded, should parse cookies from header to request.cookies', async () => {
    const response = await request(server)
      .get('/')
      .accept('text/plain')
      .set('Cookie', 'token=aae%7Caa')
      .send()

    const cookies = response.text
    expect(cookies).toBeDefined()
    expect(cookies).toBe('{"token":"aae|aa"}')
  })

  it('when cookie options is passed, should parse cookies from header to request.cookies', async () => {
    const response = await request(server)
      .get('/')
      .accept('application/json')
      .set('Cookie', 'username=matheusinit; Path=/; HttpOnly; Secure; SameSite=Lax')
      .send()

    const cookies = response.body
    expect(cookies).toBeDefined()
    expect(cookies['username']).toBe('matheusinit')
  })
})