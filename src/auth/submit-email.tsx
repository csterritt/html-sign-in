import { Hono } from 'hono'

import { SUBMIT_EMAIL_PATH } from '../constants'
import { Bindings } from '../bindings'

export const setupSubmitEmailPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.post(SUBMIT_EMAIL_PATH, async (c) => {
    const contentType = c.req.header('content-type')
    console.log(`contentType is`, contentType)
    console.log(`... as string, contentType is ${JSON.stringify(contentType)}`)
    const body = await c.req.parseBody()
    console.log(`body is`, body)
    console.log(`... as string, body is ${JSON.stringify(body)}`)
    return c.json(
      {
        message: 'Created!',
        body,
      },
      201
    )
  })
}
