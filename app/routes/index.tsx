import type { MetaFunction } from 'remix'

export const meta: MetaFunction = () => {
  return {
    title: 'My Remix Template',
    description: 'There will be many remix starter templates. This one is mine!'
  }
}

export default function Index() {
  return (
    <div className="text-xl text-blue-600 pt-16 text-center">
      My Remix Template
    </div>
  )
}