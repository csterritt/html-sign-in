import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href='/static/style.css' rel='stylesheet' />
        <title>HTML Sign In</title>
      </head>
      <body class='font-sans'>{children}</body>
    </html>
  )
})
