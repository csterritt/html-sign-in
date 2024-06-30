export const onRequest = async (context: any) => {
  const data = await context.request.formData()
  const email = data.get('email') || 'no email'
  return Response.json({
    status: 200,
    body: {
      message: `email is ${email}`,
    },
  })
}
