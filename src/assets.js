import * as mime from 'mime/lite'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const manifest = JSON.parse(manifestJSON)

export async function assetHandler(request, env) {
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // cloudflare pages
  if (env.ASSETS) {
    const res = await env.ASSETS.fetch(request)
    if (res.status >= 400) return
    const headers = new Headers(res.headers)
    if (url.pathname.startsWith('/static/'))
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return new Response(res.body, { headers, status: res.status })
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

      // TODO etags for non static, public, assets

      return new Response(body, { headers })
    }
  }

  // development
  if (process.env.NODE_ENV === 'development') {
    if (url.pathname.startsWith('/static/')) {
      const headers = new Headers()
      headers.set('Content-Type', mime.getType(url.pathname) || 'text/plain')
      const body = await env.__STATIC_CONTENT.get(url.pathname, {
        type: 'arrayBuffer'
      })
      return new Response(body, { headers })
    }
  }
}
