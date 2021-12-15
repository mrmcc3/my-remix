import { createRequestHandler } from '@remix-run/server-runtime'
import * as build from '../build'

// Remix Handler

const remixHandler = createRequestHandler(build, {})

// Export Worker

export default {
  async fetch(request, env, ctx) {
    // TODO public assets
    return await remixHandler(request, { env, ctx })
  }
}

// Export Durable Objects
