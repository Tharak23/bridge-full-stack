import { Link, Outlet, useLocation } from 'react-router-dom'
import { Ticket, MessageCircle, Home } from 'lucide-react'

const nav = [
  { path: '/support', label: 'Tickets', icon: Ticket },
  { path: '/support/chat', label: 'Chat', icon: MessageCircle },
]

export default function SupportLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <Link to="/support" className="font-bold text-lg text-slate-800">Support</Link>
          <p className="text-xs text-slate-500 mt-0.5">Tickets & chat</p>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {nav.map(({ path, label, icon: Icon }) => {
            const active = path === '/support' ? location.pathname === path : location.pathname.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-amber-50 text-amber-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto p-3 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 font-medium"
          >
            <Home className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
