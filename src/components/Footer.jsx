import { Link } from 'react-router-dom'

const links = [
  { label: 'About', to: '/hiredashboard' },
  { label: 'Contact', to: '/hiredashboard' },
  { label: 'Terms & Conditions', to: '/hiredashboard/terms' },
  { label: 'Privacy', to: '/hiredashboard' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[#111111] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/hiredashboard" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-black uppercase tracking-[0.2em] text-white hover:text-[#ffd7db]">
            Bridge
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {links.map(({ label, to }) => (
              <Link key={label} to={to} className="text-sm text-white/70 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-white/45">© Bridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
