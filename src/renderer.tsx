import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href='/static/style-XXXXXX.css' rel='stylesheet' />
        <title>HTML Sign In</title>
      </head>
      <body class='font-serif bg-amber-100'>{children}</body>
    </html>
  )
})
