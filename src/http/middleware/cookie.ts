import { IncomingMessage, ServerResponse } from 'http'

declare module 'http' {
  interface IncomingMessage {
    cookies: Record<string, string> | undefined;
  }
}

type PipeRequest = () => void

const findPatternInCookie = (pattern: string, cookieList: string[]) =>
  cookieList
    .find(string => string.trim().startsWith(pattern)) !== undefined

const removePatternFromCookie = (pattern: string, cookieList: string[]) => {
  const index = cookieList.findIndex(
    string => string.trim().startsWith(pattern)
  )

  cookieList.splice(index, 1)

  return cookieList
}

export const parseCookies = (
  request: IncomingMessage, response: ServerResponse, next: PipeRequest
) => {
  const cookie = request.headers['cookie']

  const defaultCookies = {}

  if (!cookie) {
    request.cookies = defaultCookies
    return next()
  }

  const cookieSplitted = cookie.split(';')

  if (findPatternInCookie('Path=', cookieSplitted)) {
    removePatternFromCookie('Path=', cookieSplitted)
  }

  if (findPatternInCookie('Secure', cookieSplitted)) {
    removePatternFromCookie('Secure', cookieSplitted)
  }

  if (findPatternInCookie('HttpOnly', cookieSplitted)) {
    removePatternFromCookie('HttpOnly', cookieSplitted)
  }

  if (findPatternInCookie('SameSite=', cookieSplitted)) {
    removePatternFromCookie('SameSite=', cookieSplitted)
  }

  if (findPatternInCookie('Domain=', cookieSplitted)) {
    removePatternFromCookie('Domain=', cookieSplitted)
  }

  if (findPatternInCookie('Max-Age=', cookieSplitted)) {
    removePatternFromCookie('Max-Age=', cookieSplitted)
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