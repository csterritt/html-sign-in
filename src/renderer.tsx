import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href='/static/style-XXXXXX.css' rel='stylesheet' />
        <title>HTML Sign In</title>
      </head>

      <body class='font-slabserif h-full min-h-screen flex flex-col justify-between md:mx-auto max-w-7xl pb-3 bg-gray-300 dark:bg-gray-900'>
        {children}
      </body>
    </html>
  )
})
