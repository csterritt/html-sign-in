import { StatusCodes } from 'http-status-codes'

export const onRequest = async (context: any) => {
  const data = await context.request.formData()
  const email = data.get('email') || 'no email'
  console.log(`got email: ${email}`)
  return Response.redirect(
     'https://html-sign-in.pages.dev/auth/await-code.html', 
    StatusCodes.MOVED_TEMPORARILY
  )
}
