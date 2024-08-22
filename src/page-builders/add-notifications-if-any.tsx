import { ForwardOptions } from '../bindings' // UNREVIEWED
import { html } from 'hono/html'

export const addNotificationsIfAny = (options?: ForwardOptions) => {
  if (
    options !== undefined &&
    options.error !== undefined &&
    options.error?.length > 0
  ) {
    return html` <div role="alert" class="alert alert-error mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>${options.error}</span>
    </div>`
  }

  if (
    options !== undefined &&
    options.message !== undefined &&
    options.message?.length > 0
  ) {
    return html` <div role="alert" class="alert alert-info mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>${options.message}</span>
    </div>`
  }

  return html``
}
