import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { LayoutDashboard, Briefcase, IndianRupee, MessageCircle, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const nav = [
  { to: '/dashboard', label: 'Job Feed', icon: LayoutDashboard },
  { to: '/dashboard/available-jobs', label: 'Available Jobs', icon: Search },
  { to: '/dashboard/jobs', label: 'My Jobs', icon: Briefcase },
  { to: '/dashboard/earnings', label: 'Earnings', icon: IndianRupee },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function ProviderLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto flex h-14 md:h-16 items-center gap-4 px-4">
          <Link
            to="/dashboard"
            className="font-bold text-lg text-teal-600 hover:text-teal-700 transition-colors shrink-0"
          >
            Bridge
          </Link>
          <nav className="hidden md:flex flex-1 items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
              return (
                <Link key={to} to={to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`rounded-lg gap-2 font-medium transition-all ${
                      isActive ? 'bg-teal-50 text-teal-800 hover:bg-teal-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : ''}`} />
                    {label}
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="flex-1 md:flex-none flex items-center justify-end gap-2">
            <UserButton afterSignOutUrl="/" />
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="Toggle menu"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 flex flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
              return (
                <Link key={to} to={to} onClick={() => setMobileNavOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-lg ${
                      isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
