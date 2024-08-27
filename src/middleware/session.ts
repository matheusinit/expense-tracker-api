import session from 'express-session'

export const serverSession = session({
  secret: process.env['SESSION_SECRET'] || 'default',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'strict',
    secure: true
  }
})