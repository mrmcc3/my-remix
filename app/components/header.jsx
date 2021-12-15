import { Link, NavLink } from 'remix'

function linkStyle({ isActive }) {
  return `leading-relaxed rounded px-2 ${
    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-800'
  }`
}

export function Header() {
  return (
    <header>
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="space-x-2 font-bold">
          <Link to="/">My Remix</Link>
        </div>
        <div className="flex justify-around items-center sm:space-x-2">
          <NavLink to="/kv" className={linkStyle}>
            KV
          </NavLink>
          <NavLink to="/do/the-one" className={linkStyle}>
            DO
          </NavLink>
        </div>
      </div>
    </header>
  )
}
