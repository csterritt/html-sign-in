import { ForwardOptions } from '../bindings'
import { html } from 'hono/html'

export const addErrorIfAny = (options?: ForwardOptions) => {
  if (options !== undefined && options.error !== undefined) {
    return html` <div class="text-red-500" role="alert">${options.error}</div>`
  } else {
    return html``
  }
}
