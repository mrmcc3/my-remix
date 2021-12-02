import { json, LoaderFunction, MetaFunction } from 'remix'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({
  params: { name },
  request,
  context: { env }
}) => {
  const cf: IncomingRequestCfProperties = request.cf
  const { colo, city } = cf
  const cfRay = request.headers.get('cf-ray')

  if (!name) throw new Response('no name provided')

  // fetch some data from a unique durable object
  const doId = env.EXAMPLE.idFromName(name)
  const res = await env.EXAMPLE.get(doId).fetch(
    'https://michael.workers.dev/example-do',
    {
      method: 'POST',
      body: JSON.stringify({ colo })
    }
  )
  const data = await res.json()

  return json({
    envName: env.NAME,
    colo,
    city,
    isolateId,
    cfRay,
    name,
    ...data
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'DO Example',
    description: 'Reading from durable objects'
  }
}

const spanStyle = 'bg-gray-100 px-2 py-0.5 rounded font-semibold font-mono'

export default function DO() {
  const {
    envName,
    city,
    colo,
    isolateId,
    cfRay,
    name,
    doIsolateId,
    currentColo,
    creationColo,
    counts
  } = useLoaderData()
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
        The worker made a request to the Durable Object named{' '}
        <span className={spanStyle}>{name}</span> which is running in the
        <span className={spanStyle}>{currentColo}</span> datacenter and was
        first created in
        <span className={spanStyle}>{creationColo}</span>. It's running in the
        V8 isolate <span className={spanStyle}>{doIsolateId}</span>
      </p>

      <p>
        Below is a list of request counts to the DO grouped by worker
        datacenter:
      </p>
      <ul>
        {Object.entries(counts).map(([colo, count]) => (
          <li key={colo} className="space-y-1">
            <span className={spanStyle}>
              {colo.substring(5)} - {count}
            </span>
          </li>
        ))}
      </ul>

      <p>
        This is the <span className={spanStyle}>{envName}</span> environment.
        request id is <span className={spanStyle}>{cfRay}</span>
      </p>
    </div>
  )
}
