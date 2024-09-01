import { CANCEL_SIGN_IN_PATH, SIGN_IN_PATH } from '../constants'
import { LocalContext } from '../bindings'

const signOutPart = (
  <div class='px-2 mx-2'>
    <form action={CANCEL_SIGN_IN_PATH} method='POST'>
      <input
        type='submit'
        class='btn btn-secondary'
        data-testid='sign-out-link'
        value='Sign Out'
      />
    </form>
  </div>
)

const signInPart = (
  <div class='px-2 mx-2'>
    <a href={SIGN_IN_PATH} class='btn btn-secondary' data-testid='sign-in-link'>
      Sign In
    </a>
  </div>
)

export const header = (
  c: LocalContext,
  testId: string,
  showInOutButton: boolean = true
) => {
  let inOutButton = signInPart
  if (c.var.Session.isJust && c.var.Session.value.SignedIn) {
    inOutButton = signOutPart
  }

  return (
    <div
      class='flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content'
      data-testid={testId}
    >
      <div class='px-2 mx-2'>
        <span class='text-lg font-bold md:hidden'>CTRK</span>
        <span class='text-lg font-bold hidden md:inline-block'>ConnecTrak</span>
      </div>

      {showInOutButton ? inOutButton : null}
    </div>
  )
}

export const footer = () => (
  <div class='mx-6' data-testid='footer-banner'>
    <span>Content copyright Chris Sterritt, 2024</span>
    <span class='mx-2'>-</span>
    <span>V-0</span>
  </div>
)
