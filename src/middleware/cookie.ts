import { IncomingMessage, ServerResponse } from 'http'

declare module 'http' {
  interface IncomingMessage {
    cookies: Record<string, string> | undefined;
  }
}

type PipeRequest = () => void

export const parseCookies = (request: IncomingMessage, response: ServerResponse, next: PipeRequest) => {
  const cookie = request.headers['cookie']

  const defaultCookies = {}

  if (!cookie) {
    request.cookies = defaultCookies
    return next()
  }

  const cookieSplitted = cookie.split(';')

  if (cookieSplitted.find((cookie) => cookie.trim().startsWith('Path='))) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim().startsWith('Path='))

    cookieSplitted.splice(index, 1)
  }

  if (cookieSplitted.find((cookie) => cookie.trim() == 'Secure')) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim() == 'Secure')

    cookieSplitted.splice(index, 1)
  }

  if (cookieSplitted.find((cookie) => cookie.trim() == 'HttpOnly')) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim() == 'HttpOnly')

    cookieSplitted.splice(index, 1)
  }

  if (cookieSplitted.find((cookie) => cookie.trim().startsWith('SameSite='))) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim().startsWith('SameSite='))

    cookieSplitted.splice(index, 1)
  }

  if (cookieSplitted.find((cookie) => cookie.trim().startsWith('Domain='))) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim().startsWith('Domain='))

    cookieSplitted.splice(index, 1)
  }

  if (cookieSplitted.find((cookie) => cookie.trim().startsWith('Max-Age='))) {
    const index = cookieSplitted.findIndex(cookie => cookie.trim().startsWith('Max-Age='))

    cookieSplitted.splice(index, 1)
  }

  cookieSplitted.forEach((cookie) => {
    const [key, value] = cookie.split('=')
    request.cookies = defaultCookies
    request.cookies[key.trim()] = String(value.trim())
    const decodedValue = decodeURIComponent(value.trim())
    request.cookies[key.trim()] = decodedValue
  })

  next()
}