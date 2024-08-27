import { doubleCsrf } from 'csrf-csrf'

const getSecret = () => {
  const csrfTokenSecret = process.env['CSRF_TOKEN_SECRET']

  if (!csrfTokenSecret) throw new Error('CSRF_TOKEN_SECRET not defined')

  return csrfTokenSecret
}

const errorConfig = {
  statusCode: 403,
  message: 'CSRF token not provided. Please, request a new CSRF token at /csrf-token.'
}

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret,
  errorConfig
})

export { doubleCsrfProtection as csrf, generateToken }