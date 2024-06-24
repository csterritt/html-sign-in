import { Hono } from 'hono'
import { renderer } from './renderer'

// const app = new Hono()
type Bindings = {
  HTML_SIGN_IN_DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1 class='text-2xl ml-8'>Hello!</h1>)
})

app.get('/count/:id', async (c) => {
  const userId = c.req.param('id')
  try {
    let { results } = await c.env.HTML_SIGN_IN_DB.prepare(
      'SELECT Val FROM HSICounts WHERE UserId = ?'
    )
      .bind(userId)
      .all()
    return c.json(results)
  } catch (e) {
    return c.json({ err: e }, 500)
  }
})

app.post('/increment-count/:id', async (c) => {
  const userId = c.req.param('id')
  try {
    let results: Record<string, any>[]
    let queryRes = await c.env.HTML_SIGN_IN_DB.prepare(
      'SELECT Val FROM HSICounts WHERE UserId = ?'
    )
      .bind(userId)
      .all()
    if (queryRes != null && queryRes.success) {
      results = queryRes.results
      if (results != null && results.length > 0) {
        const Val: any = results[0].Val

        try {
          const updateRes: D1Response = await c.env.HTML_SIGN_IN_DB.prepare(
            'UPDATE HSICounts SET Val = ? WHERE UserId = ?'
          )
            .bind(Val + 1, userId)
            .run()

          if (updateRes != null && updateRes.success) {
            return c.json({ success: true })
          } else {
            return c.json({ error: `database update failed (1)` })
          }
        } catch (e: any) {
          console.error(`update caught error`, e)
          return c.json({
            error: `database update failed (2) with error ${e.toString()}`,
          })
        }
      } else {
        return c.json({ error: `database update failed (3)` })
      }
    } else {
      return c.json({ error: `database query failed (3)` })
    }
  } catch (e) {
    return c.json({ err: e }, 500)
  }
})

export default app
