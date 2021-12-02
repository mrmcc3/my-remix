import type { MetaFunction } from 'remix'
import { json, Link, LoaderFunction } from 'remix'
import { nanoid } from 'nanoid'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({}) => {
  return json({
    randomId: `DO-${nanoid(8)}`
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'My Remix Template',
    description: 'There will be many remix starter templates. This one is mine!'
  }
}

export default function Index() {
  const { randomId } = useLoaderData()
  return (
    <div className="flex flex-col space-y-4">
      <Link className="text-blue-600 hover:underline" to="/kv">
        KV Example
      </Link>
      <Link className="text-blue-600 hover:underline" to={`/do/${randomId}`}>
        A random durable object
      </Link>
      <Link className="text-blue-600 hover:underline" to={`/do/the-one`}>
        One durable object to rule them all
      </Link>
    </div>
  )
}
