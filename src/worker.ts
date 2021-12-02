import { nanoid } from 'nanoid'
import { assetHandler } from './assets'
import { createRequestHandler } from '@remix-run/server-runtime'
// @ts-ignore
import * as build from '../build'

const remixHandler = createRequestHandler(build, {})

// Export Worker

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (!globalThis.isolateId) globalThis.isolateId = nanoid(8)
    const assetResponse = await assetHandler(request, env)
    return assetResponse || remixHandler(request, { env, ctx })
  }

  // Cron Triggers
  // async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {}
}

// Export Durable Objects

export { ExampleDO } from './example'
