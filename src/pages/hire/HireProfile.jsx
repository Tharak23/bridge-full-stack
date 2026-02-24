import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Calendar, MessageCircle, CreditCard, Briefcase } from 'lucide-react'

export default function HireProfile() {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchApiJson('/api/users/me', {}, getToken)
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch(() => setProfile(null))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [getToken])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse text-slate-500">Loading…</div>
      </div>
    )
  }

  const name = profile?.name || 'User'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-teal-700 h-32 md:h-40" />
      <div className="container mx-auto px-4 max-w-4xl -mt-16 relative">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start md:flex-row md:gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-600 shadow-lg shrink-0">
              {initial}
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
              <span className="inline-block mt-1 rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">CUSTOMER</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6 text-sm text-slate-600">
          <span>Phone: {profile?.phone || '—'}</span>
          <span>Role: {profile?.role || 'hire'}</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-slate-200">
          <Link to="/hiredashboard/bookings" className="px-4 py-3 font-medium text-slate-900 border-b-2 border-teal-600 -mb-px">
            Bookings
          </Link>
          <Link to="/hiredashboard/payments" className="px-4 py-3 font-medium text-slate-500 hover:text-slate-900">
            Payments
          </Link>
          <Link to="/hiredashboard/profile" className="px-4 py-3 font-medium text-slate-500 hover:text-slate-900">
            Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <Card className="overflow-hidden">
            <div className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">My Bookings</p>
                <p className="text-sm text-slate-500">View and manage your service bookings</p>
              </div>
              <Link to="/hiredashboard/bookings" className="ml-auto text-blue-600 font-medium text-sm shrink-0">View →</Link>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Messages</p>
                <p className="text-sm text-slate-500">Chat with professionals</p>
              </div>
              <Link to="/hiredashboard/messages" className="ml-auto text-blue-600 font-medium text-sm shrink-0">View →</Link>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Payments</p>
                <p className="text-sm text-slate-500">Payment history</p>
              </div>
              <Link to="/hiredashboard/payments" className="ml-auto text-blue-600 font-medium text-sm shrink-0">View →</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
