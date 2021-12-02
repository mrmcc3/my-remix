import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from 'remix'
import type { LinksFunction } from 'remix'
import type { ReactNode } from 'react'

import stylesUrl from '~/styles.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
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
        <div className="mx-auto max-w-3xl pt-12 flex flex-col space-y-4">
          <div>
            <Link to="/" className="text-2xl font-bold text-green-600">
              My Remix Template
            </Link>
            <div>
              Built for cloudflare workers.{' '}
              <a
                className="text-blue-600 hover:underline"
                href="https://github.com/mrmcc3/my-remix"
              >
                mrmcc3/my-remix
              </a>
            </div>
          </div>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
