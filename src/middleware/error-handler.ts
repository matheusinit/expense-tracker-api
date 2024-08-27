import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export const errorHandler = (error: ErrorRequestHandler, request: Request, response: Response, _next: NextFunction) => {
  const errorString = String(error)
  const errorType = errorString.split(':').shift()
  const errorMessage = errorString.split(' ').slice(1).join(' ')

  const csrfErrorMessage = 'invalid csrf token'
  const csrfErrorType = 'ForbiddenError'

  const csrfTokenHeader = request.headers['x-csrf-token']

  if (!csrfTokenHeader && errorType === csrfErrorType && errorMessage === csrfErrorMessage) {
    const errorMessage = 'CSRF token not provided. Please, request a new CSRF token at /csrf-token.'
    response.status(403).json({ message: errorMessage })
  }

  return response.status(403).json({ message: 'CSRF token provided is invalid. Please, request a new CSRF token at /csrf-token.' })
}