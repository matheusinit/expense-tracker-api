import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export const errorHandler = (error: ErrorRequestHandler, _request: Request, response: Response, _next: NextFunction) => {
  const errorString = String(error)
  const errorType = errorString.split(':').shift()
  const errorMessage = errorString.split(' ').slice(1).join(' ')

  const csrfErrorMessage = 'CSRF token not provided. Please, request a new CSRF token at /csrf-token.'
  const csrfErrorType = 'ForbiddenError'

  if (errorType === csrfErrorType && errorMessage === csrfErrorMessage) {
    response.status(403).json({ message: errorMessage })
  }
}