import pino from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

import { environment } from '@/config/environment'

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  level: environment.LOG_LEVEL,
  genReqId: () => {
    return uuidv4()
  },
  serializers: {
    req: (request) => ({
      id: request.id,
      method: request.method,
      url: request.url,
      headers: request.headers
    }),
    res: (response) => ({
      statusCode: response.statusCode,
      header: response.headers
    })
  }
})