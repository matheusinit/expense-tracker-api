import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('Helmet Middleware', () => {
  it('when request to get csrf token, then should have secure HTTP response headers', async () => {
    const response = await request(app).get('/csrf-token')

    const headers = response.headers

    const contentSecurityPolicy = 'default-src \'self\';base-uri \'self\';\
font-src \'self\' https: data:;form-action \'self\';frame-ancestors \'self\'\
;img-src \'self\' data:;object-src \'none\';script-src \'self\';script-src-attr \
\'none\';style-src \'self\' https: \'unsafe-inline\';upgrade-insecure-requests'

    expect(headers).not.toHaveProperty('X-Powered-By')
    expect(headers['content-security-policy']).toEqual(contentSecurityPolicy)
    expect(headers['cross-origin-opener-policy']).toEqual('same-origin')
    expect(headers['cross-origin-resource-policy']).toEqual('same-origin')
    expect(headers['origin-agent-cluster']).toEqual('?1')
    expect(headers['referrer-policy']).toEqual('no-referrer')
    expect(headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains')
    expect(headers['x-content-type-options']).toEqual('nosniff')
    expect(headers['x-dns-prefetch-control']).toEqual('off')
    expect(headers['x-download-options']).toEqual('noopen')
    expect(headers['x-frame-options']).toEqual('SAMEORIGIN')
    expect(headers['x-permitted-cross-domain-policies']).toEqual('none')
    expect(headers['x-xss-protection']).toEqual('0')
    expect(headers['cross-origin-resource-policy']).toEqual('same-origin')
  })
})
