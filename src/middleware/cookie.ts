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

  cookie.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=')
    request.cookies = defaultCookies
    request.cookies[key.trim()] = String(value.trim())
    const decodedValue = decodeURIComponent(value.trim())
    request.cookies[key.trim()] = decodedValue
  })

  next()
}