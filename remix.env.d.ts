/// <reference types="@remix-run/dev" />

declare var process: {
  env: {
    NODE_ENV: string
  }
}

declare var isolateId: string

interface Env {
  __STATIC_CONTENT: KVNamespace
  KV: KVNamespace
  EXAMPLE: DurableObjectNamespace
  NAME: string
}
