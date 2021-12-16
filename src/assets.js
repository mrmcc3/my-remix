import * as mime from 'mime/lite'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const manifest = JSON.parse(manifestJSON)

export async function assetHandler(request, env) {
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // development
  if (process.env.NODE_ENV === 'development') {
    if (url.pathname.startsWith('/static/')) {
      const headers = new Headers()
      headers.set('Content-Type', mime.getType(url.pathname) || 'text/plain')
      const body = await env.__STATIC_CONTENT.get(url.pathname.substring(1), {
        type: 'arrayBuffer'
      })
      return new Response(body, { headers })
    }
  }

  // cloudflare pages
  if (env.ASSETS) {
    const res = await env.ASSETS.fetch(request)
    return res.status < 400 ? res : null
  }

  // worker sites
  if (env.__STATIC_CONTENT) {
    const key = manifest[url.pathname.substring(1)]
    if (key) {
      const headers = new Headers()
      headers.set('Content-Type', mime.getType(url.pathname) || 'text/plain')
      if (url.pathname.startsWith('/static/'))
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      const body = await env.__STATIC_CONTENT.get(key, {
        type: 'stream',
        cacheTtl: 86400
      })
      return new Response(body, { headers })
    }
  }
}
