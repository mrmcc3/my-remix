import { createRequestHandler } from '@remix-run/server-runtime'
import * as mime from 'mime/lite'
// @ts-ignore
import * as build from '../build'
// @ts-ignore
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const manifest = JSON.parse(manifestJSON)
const remixHandler = createRequestHandler(build, {})

export interface Env {
  __STATIC_CONTENT: KVNamespace
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
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

        // everything under static is assumed immutable
        if (url.pathname.startsWith('/static/'))
          headers.set('Cache-Control', 'public, max-age=604800, immutable')

        return new Response(body, { headers })
      }
    }

    // handoff to remix
    return remixHandler(request, { env, ctx })
  }
}
