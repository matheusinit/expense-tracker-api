import request from 'supertest'
import app from '../../app'

const getCSRFResponseBody = async () => {
  const csrfResponse = await request(app).get('/csrf-token')
  return csrfResponse
}

export const getCSRFTokenAndCookies = async () => {
  const response = await getCSRFResponseBody()

  const csrfToken = response.body['csrfToken']
  const cookies = response.headers['set-cookie'].at(0) ?? ''

  return { csrfToken, cookies }
}