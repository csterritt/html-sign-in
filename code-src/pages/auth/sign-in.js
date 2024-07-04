import { layout } from '../../layout.js'
import { header } from '../../partials/header.js'
import * as constants from '../../constants.js'

const signIn = () =>
  layout(
    `
      ${header('sign-in-page-banner')}
      <!-- -->
      <div class="flex-grow mx-6">
        <div class="card bg-gray-100 dark:bg-gray-700 relative">
          <div class="card-body">
            <h3 class="card-title">Sign In</h3>

            <form
              action="${constants.FUNCTION_SERVER_URL}/api/auth/submit-email"
              method="POST"
            >
              <label for="email" class="label">
                <span class="label-text">Email address:</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                class="input input-bordered input-primary w-full max-w-xs"
                data-testid="email-input"
              />

              <div class="card-actions justify-between mt-4">
                <a
                  href="/"
                  class="btn btn-ghost"
                  data-testid="cancel-sign-in-link"
                >
                  Cancel sign in
                </a>

                <button class="btn btn-accent">Register a new account</button>

                <input
                  type="submit"
                  class="btn btn-primary"
                  data-testid="submit-button"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    `,
    '..'
  )

const output = signIn()
console.log(output)
