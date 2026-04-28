import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Search, MapPin, Calendar, Users, CreditCard, User, Home } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Footer from '@/components/Footer'
import { useLocationContext } from '@/context/LocationContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function NavLink({ to, icon: Icon, label, end, alsoActive }) {
  const location = useLocation()
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to) || (Array.isArray(alsoActive) && alsoActive.some((p) => location.pathname.startsWith(p)))
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 gap-1 rounded-full px-3 text-xs ${
          isActive
            ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:text-white'
            : 'border border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Button>
    </Link>
  )
}

export default function HireLayout() {
  const navigate = useNavigate()
  const { count } = useCart()
  const { location, setLocation, detectLocation } = useLocationContext()
  const [locationInput, setLocationInput] = useState(location)
  const [showLocation, setShowLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const applyLocation = () => {
    setLocation(locationInput)
    setShowLocation(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.08),transparent_28%),linear-gradient(180deg,#fffefe_0%,#f7f4f4_100%)]">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex min-h-14 flex-wrap items-center gap-3 px-4 py-2">
          <Link
            to="/hiredashboard"
            className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
          >
            Bridge
          </Link>

          <div className="relative flex-1 max-w-2xl">
            <div className="flex items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] transition-shadow focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[rgba(193,18,31,0.14)]">
              <button
                type="button"
                onClick={() => setShowLocation(true)}
                className="flex shrink-0 items-center gap-1.5 border-r border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-muted)]"
              >
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="max-w-[120px] truncate font-medium">{location || 'Location'}</span>
              </button>
              <input
                type="search"
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/hiredashboard?q=${encodeURIComponent(searchQuery)}`)}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none"
              />
              <Button
                size="icon"
                variant="default"
                className="h-9 w-9 shrink-0 rounded-none"
                onClick={() => navigate(`/hiredashboard?q=${encodeURIComponent(searchQuery)}`)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {showLocation && (
              <div className="absolute left-0 right-0 top-full z-10 mt-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-lg)]">
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter area or city"
                  className="mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={applyLocation}>Apply</Button>
                  <Button size="sm" variant="outline" onClick={detectLocation}>Use current location</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowLocation(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <nav className="ml-auto flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white p-1 shadow-[var(--shadow-sm)]">
            <NavLink to="/hiredashboard" icon={Home} label="Home" end />
            <NavLink to="/hiredashboard/bookings" icon={Calendar} label="My Bookings" />
            <NavLink to="/hiredashboard/professionals" icon={Users} label="Professionals" alsoActive={['/hiredashboard/messages']} />
            <NavLink to="/hiredashboard/payments" icon={CreditCard} label="Payments" />
            <NavLink to="/hiredashboard/profile" icon={User} label="Profile" />
            {count > 0 && (
              <Link to="/hiredashboard/cart" className="relative inline-flex">
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-full border border-[var(--color-border)] px-4 text-[var(--color-text)]">
                  <span className="hidden sm:inline">Cart ({count})</span>
                </Button>
              </Link>
            )}
            <div className="pl-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
