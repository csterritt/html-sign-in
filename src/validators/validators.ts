import * as v from 'valibot' // UNREVIEWED
import Maybe, { just, nothing } from 'true-myth/maybe'
import Result, { err, ok } from 'true-myth/result'

export type SignUpParameters = {
  email: string
  signUpCode: string
}

const emailPipe = v.pipe(
  v.string(),
  v.trim(),
  v.email(),
  v.minLength(5),
  v.maxLength(254)
)

const SignInSchema = v.object({
  email: emailPipe,
})

const SubmitCodeSchema = v.object({
  code: v.pipe(v.string(), v.minLength(1)),
})

const SignUpSchema = v.object({
  email: emailPipe,
  signupCode: v.pipe(v.string(), v.trim(), v.length(8), v.regex(/^\S{8}$/)),
})

export const validEmail = (emailSubmitted: string): Maybe<string> => {
  try {
    const { email } = v.parse(SignInSchema, { email: emailSubmitted })
    if (email.trim().length > 0) {
      return just(email)
    }

    return nothing<string>()
  } catch (error) {
    return nothing<string>()
  }
}

export const validCode = (codeSubmitted: string): Maybe<string> => {
  try {
    const { code } = v.parse(SubmitCodeSchema, { code: codeSubmitted })
    if (code.trim().length > 0) {
      return just(code)
    }

    return nothing<string>()
  } catch (error) {
    return nothing<string>()
  }
}

export const validSignUpParameters = (
  emailSubmitted: string,
  codeSubmitted: string
): Result<SignUpParameters, string> => {
  const results = v.safeParse(SignUpSchema, {
    email: emailSubmitted,
    signupCode: codeSubmitted,
  })

  if (results?.success) {
    return ok({
      email: results.output.email,
      signUpCode: results.output.signupCode,
    })
  }

  let errorFound = 'Unknown error'
  for (let index = 0; index < (results?.issues?.length ?? 0); index += 1) {
    const issue: any = results.issues[index]
    if (issue.path[0]?.key === 'email') {
      errorFound = `Invalid email address: ${emailSubmitted}`
      break
    } else if (issue.path[0]?.key === 'signupCode') {
      errorFound = `That sign-up code is invalid`
    }
  }

  return err(errorFound)
}
