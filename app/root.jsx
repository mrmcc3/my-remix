import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from 'remix'
import { Header } from '~app/components/header'
import { Footer } from '~app/components/footer'
import globalStylesUrl from '~app/global.css'

export function links() {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    {
      rel: 'preload',
      href: '/static/fonts/inter-var-latin.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ]
}

export function meta() {
  return {
    viewport: 'width=device-width,initial-scale=1',
    title: 'My Remix',
    description: 'My Remix Template. Cloudflare Workers + Tailwind',
    robots: 'noindex'
  }
}

export function ErrorBoundary({ error }) {
  console.error(error)
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="">
        <div className="max-w-sm mx-auto px-4 py-20 space-y-4">
          <h1 className="text-4xl font-bold">Unexpected Error</h1>
          <h2 className="text-red-700">{error.message}</h2>
          <div>
            <a href="/" className="text-blue-700 hover:underline">
              Reload
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

function Document({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-white">
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const { status, statusText } = useCatch()
  return (
    <Document>
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center">{status}</h1>
        <h2 className="text-2xl text-center">
          {status === 404 ? 'Not Found.' : statusText}
        </h2>
      </div>
    </Document>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}
