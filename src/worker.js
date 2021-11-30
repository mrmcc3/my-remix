import { createRequestHandler } from '@remix-run/server-runtime'
import * as mime from 'mime/lite'
import * as build from '../build'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const manifest = JSON.parse(manifestJSON)
const remixHandler = createRequestHandler(build, {})

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // handle public assets
    // TODO cache & etags
    if (request.method === 'GET') {
      const key = manifest[url.pathname.substring(1)]
      if (key) {
        const body = await env.__STATIC_CONTENT.get(key, {
          type: 'stream',
          cacheTtl: 86400
        })

        const headers = new Headers({
          'Content-Type': mime.getType(url.pathname) || 'text/plain'
        })

        // build is immutable
        if (url.pathname.startsWith('/build/'))
          headers.set('Cache-Control', 'public, max-age=604800, immutable')

        return new Response(body, { headers })
      }
    }

    // handoff to remix
    return remixHandler(request, { env, ctx })
  }
}
