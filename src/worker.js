import { createRequestHandler } from '@remix-run/server-runtime'
import * as build from '../build'
import { assetHandler } from './assets'

// Remix Handler

const remixHandler = createRequestHandler(build, {})

// Export Worker

export default {
  async fetch(request, env, ctx) {
    // public assets
    // const assetResponse = await assetHandler(request, env)
    // if (assetResponse) return assetResponse

    // handoff to remix
    return await remixHandler(request, { env, ctx })
  }
}

// Export Durable Objects

export { ExampleDO } from './exampleDO'
