import { Request, Response } from 'express'

import { generateToken } from '@/http/middleware/csrf'

export const applyCsrfTokenController = (
  request: Request, response: Response
) => {
  const csrfToken = generateToken(request, response)
  return response.status(200).send({ csrfToken })
}