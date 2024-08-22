import { Context, Hono } from 'hono' // UNREVIEWED

export type Bindings = {
  HTML_SIGN_IN_DB: D1Database
}

export type HonoApp = Hono<{ Bindings: Bindings }>

export type LocalContext = Context<{ Bindings: Bindings }>

export type ForwardOptions = {
  message?: string
  error?: string
}
