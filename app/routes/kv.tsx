import { json, LoaderFunction, MetaFunction } from 'remix'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({ request, context: { env } }) => {
  const cf: IncomingRequestCfProperties = request.cf
  const { colo, city } = cf
  const cfRay = request.headers.get('cf-ray')
  console.log(cf)

  // simulate a KV read
  let fromKV = await env.KV.get('msg')
  if (!fromKV) {
    fromKV = 'hello from kv'
    await env.KV.put('msg', fromKV)
  }

  return json({
    envName: env.NAME,
    colo,
    city,
    isolateId,
    cfRay,
    fromKV
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'KV Example',
    description: 'Reading from KV'
  }
}

const spanStyle = 'bg-gray-100 px-2 py-0.5 rounded font-semibold font-mono'

export default function KV() {
  const { envName, city, colo, isolateId, fromKV, cfRay } = useLoaderData()
  return (
    <div className="pt-8 space-y-2">
      <p>
        You requested this page from{' '}
        <span className={spanStyle}>{city || colo}</span>.
      </p>
      <p>
        A cloudflare worker in the <span className={spanStyle}>{colo}</span>{' '}
        datacenter rendered this page in a V8 isolate with id{' '}
        <span className={spanStyle}>{isolateId}</span>.
      </p>
      <p>
        This message was read from KV storage:{' '}
        <span className={spanStyle}>{fromKV}</span>
      </p>
      <p>
        This is the <span className={spanStyle}>{envName}</span> environment.
        request id is <span className={spanStyle}>{cfRay}</span>
      </p>
    </div>
  )
}
