import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href='./style.css' rel='stylesheet' />
        <title>{title}</title>
      </head>
      <body class='m-auto font-sans'>{children}</body>
    </html>
  )
})
