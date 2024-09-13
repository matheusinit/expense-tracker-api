import { IncomingMessage, ServerResponse } from 'http'

declare module 'http' {
  interface IncomingMessage {
    cookies: Record<string, string> | undefined;
  }
}

type PipeRequest = () => void

export const parseCookies = (request: IncomingMessage, response: ServerResponse, next: PipeRequest) => {
  const cookie = request.headers['cookie']

  if (!cookie) {
    return response.end()
  }

  cookie.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=')
    request.cookies = {}
    request.cookies[key.trim()] = value.trim()
  })

  next()
}