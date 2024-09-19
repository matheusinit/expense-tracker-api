import { doubleCsrf } from 'csrf-csrf'

const getSecret = () => {
  const csrfTokenSecret = process.env['CSRF_TOKEN_SECRET']

  if (!csrfTokenSecret) throw new Error('CSRF_TOKEN_SECRET not defined')

  return csrfTokenSecret
}

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret
})

export { doubleCsrfProtection as csrf, generateToken }