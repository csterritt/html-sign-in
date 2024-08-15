import * as v from 'valibot'

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
  code: v.pipe(v.string(), v.trim(), v.length(6), v.regex(/^\d{6}$/)),
})

const SignUpSchema = v.object({
  email: emailPipe,
  signupCode: v.pipe(v.string(), v.trim(), v.length(8), v.regex(/^\S{8}$/)),
})

export const validEmail = (emailSubmitted: string) => {
  try {
    const { email } = v.parse(SignInSchema, { email: emailSubmitted })
    return { email, success: true }
  } catch (error) {
    return { email: emailSubmitted, success: false }
  }
}

export const validCode = (codeSubmitted: string) => {
  try {
    const { code } = v.parse(SubmitCodeSchema, { code: codeSubmitted })
    return { code, success: true }
  } catch (error) {
    return { code: codeSubmitted, success: false }
  }
}

export const validSignUpParameters = (
  emailSubmitted: string,
  codeSubmitted: string
) => {
  const results = v.safeParse(SignUpSchema, {
    email: emailSubmitted,
    signupCode: codeSubmitted,
  })
  console.log(`results: ${JSON.stringify(results)}`)

  if (results?.success) {
    return {
      email: results.output.email,
      signUpCode: results.output.signupCode,
      errorFound: '',
      success: true,
    }
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

  return {
    email: emailSubmitted,
    signUpCode: codeSubmitted,
    errorFound,
    success: false,
  }
}
