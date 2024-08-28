import { MiddlewareHandler } from 'hono'
import { getPath } from 'hono/utils/url'
import { configure, getConsoleSink, getLogger } from '@logtape/logtape'

let logSetupNotDone = true

export const setupLogging = async () => {
  if (logSetupNotDone) {
    await configure({
      sinks: { console: getConsoleSink() },
      filters: {},
      loggers: [{ category: 'hsi', level: 'debug', sinks: ['console'] }],
    })

    logSetupNotDone = false
  }
}

export const logTapeLogger = getLogger(['hsi', 'main'])

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.']

  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter)
  )

  return orderTimes.join(separator)
}

const time = (start: number) => {
  const delta = Date.now() - start
  return humanize([
    delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's',
  ])
}

type PrintFunc = (str: string, ...rest: string[]) => void

const log = (
  fn: PrintFunc,
  method: string,
  path: string,
  status: number = 0,
  elapsed?: string
) => logTapeLogger.info(`  ${method} ${path} ${status} ${elapsed}`)

export const logger = (fn: PrintFunc = console.log): MiddlewareHandler => {
  return async function logger(c: any, next) {
    const { method } = c.req
    const path = getPath(c.req.raw)

    const start = Date.now()

    await next()

    log(fn, method, path, c.res.status, time(start))
  }
}
