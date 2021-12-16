import { renderToString } from 'react-dom/server'
import { RemixServer } from 'remix'
import { nanoid } from 'nanoid'

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  // for demo
  if (!globalThis.isolateId) globalThis.isolateId = nanoid(8)

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}
