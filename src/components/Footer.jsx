import { Link } from 'react-router-dom'

const links = [
  { label: 'About', to: '/hiredashboard' },
  { label: 'Contact', to: '/hiredashboard' },
  { label: 'Terms & Conditions', to: '/hiredashboard/terms' },
  { label: 'Privacy', to: '/hiredashboard' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/hiredashboard" className="font-bold text-teal-600 hover:text-teal-700">
            Bridge
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {links.map(({ label, to }) => (
              <Link key={label} to={to} className="text-sm text-slate-600 hover:text-teal-600">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">© Bridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
