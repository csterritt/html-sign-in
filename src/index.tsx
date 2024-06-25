import { Hono } from 'hono'
import { renderer } from './renderer'

// const app = new Hono()
type Bindings = {
  HTML_SIGN_IN_DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div class='flex flex-col grow'>
      <div class='flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content textarea-accent'>
        <div class='px-2 mx-2'>
          <span class='text-lg font-bold md:hidden'>SI-EX</span>
          <span class='text-lg font-bold hidden md:inline-block'>
            Sign In Example
          </span>
        </div>
      </div>

      <div class='flex-grow mx-6'>
        <span class='text-2xl italic'>Nothing to see here (yet)</span>
      </div>

      <div class='mx-6'>
        <span>Content copyright Chris Sterritt, 2024</span>
        <span class='mx-2'>-</span>
        <span>Vx</span>
      </div>
    </div>
  )
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
