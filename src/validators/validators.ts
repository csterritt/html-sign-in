import * as v from 'valibot'

export const SignInSchema = v.object({
  email: v.pipe(v.string(), v.email(), v.minLength(4), v.maxLength(254)),
})

export const SubmitCodeSchema = v.object({
  code: v.pipe(v.string(), v.trim(), v.length(6), v.regex(/^\d{6}$/)),
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
