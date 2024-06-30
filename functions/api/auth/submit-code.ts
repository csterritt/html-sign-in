export const onRequest = async (context: any) => {
  const data = await context.request.formData()
  const code = data.get('code') || 'no code'
  return Response.json({
    status: 200,
    body: {
      message: `code is ${code}`,
    },
  })
}
