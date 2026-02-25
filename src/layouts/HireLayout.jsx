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
        className={`gap-1.5 ${isActive ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800' : 'text-slate-600 hover:text-slate-900'}`}
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link
            to="/hiredashboard"
            className="flex items-center gap-2 font-bold text-lg text-teal-600 hover:text-teal-700 transition-colors"
          >
            Bridge
          </Link>

          <div className="relative flex-1 max-w-xl">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 overflow-hidden shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-300">
              <button
                type="button"
                onClick={() => setShowLocation(true)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 border-r border-slate-200 shrink-0 transition-colors"
              >
                <MapPin className="h-4 w-4 text-teal-500" />
                <span className="max-w-[120px] truncate font-medium">{location || 'Location'}</span>
              </button>
              <input
                type="search"
                placeholder="Search for any service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/hiredashboard?q=${encodeURIComponent(searchQuery)}`)}
                className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <Button
                size="icon"
                variant="default"
                className="rounded-none shrink-0"
                onClick={() => navigate(`/hiredashboard?q=${encodeURIComponent(searchQuery)}`)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {showLocation && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg z-10">
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter area or city"
                  className="mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={applyLocation}>Apply</Button>
                  <Button size="sm" variant="outline" onClick={detectLocation}>Use current location</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowLocation(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-1">
            <NavLink to="/hiredashboard" icon={Home} label="Home" end />
            <NavLink to="/hiredashboard/bookings" icon={Calendar} label="My Bookings" />
            <NavLink to="/hiredashboard/professionals" icon={Users} label="Professionals" alsoActive={['/hiredashboard/messages']} />
            <NavLink to="/hiredashboard/payments" icon={CreditCard} label="Payments" />
            <NavLink to="/hiredashboard/profile" icon={User} label="Profile" />
            {count > 0 && (
              <Link to="/hiredashboard/cart" className="relative inline-flex">
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600">
                  <span className="hidden sm:inline">Cart ({count})</span>
                </Button>
              </Link>
            )}
            <div className="pl-2">
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
