import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from 'remix'
import type { LinksFunction } from 'remix'
import type { ReactNode } from 'react'

import tailwindUrl from '~/tailwind.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindUrl }]
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <Document>
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
      </div>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Document>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
    </Document>
  )
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
