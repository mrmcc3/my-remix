import * as mime from 'mime/lite'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const manifest = JSON.parse(manifestJSON)

export async function assetHandler(request, env) {
  const url = new URL(request.url)
  const headers = new Headers()
  headers.set('Content-Type', mime.getType(url.pathname) || 'text/plain')

  if (process.env.NODE_ENV === 'development') {
    // serve static assets in development with no caching
    if (url.pathname.startsWith('/static/')) {
      const body = await env.__STATIC_CONTENT.get(url.pathname, {
        type: 'arrayBuffer'
      })
      return new Response(body, { headers })
    }
  } else {
    // handle public assets in production
    if (env.__STATIC_CONTENT && request.method === 'GET') {
      const key = manifest[url.pathname.substring(1)]
      if (key) {
        const body = await env.__STATIC_CONTENT.get(key, {
          type: 'stream',
          cacheTtl: 86400
        })

        // everything under static is assumed immutable
        if (url.pathname.startsWith('/static/'))
          headers.set('Cache-Control', 'public, max-age=31536000, immutable')

        // TODO etags for non static, public, assets

        return new Response(body, { headers })
      }
    }
  }
}
