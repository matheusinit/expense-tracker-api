import request from 'supertest'
import { describe, expect, it } from 'vitest'
import http from 'http'
import { parseCookies } from './cookie'

const server = http.createServer((request: http.IncomingMessage, response) => {
  parseCookies(request, response, () => {
    const json = JSON.stringify(request.cookies)
    console.log(json)

    response.setHeader('Content-Type', 'application/json')
    response.end(json)
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
      .set('Cookie', 'name=Matheus')
      .send()

    const cookies = response.body
    expect(cookies).toBeDefined()
    expect(cookies['name']).toBe('Matheus')
  })
})