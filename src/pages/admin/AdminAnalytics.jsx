import { useEffect, useState } from 'react'
import { getApiUrl } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { BarChart3, Users, Wrench, CreditCard, MessageSquare, Database, Sparkles } from 'lucide-react'

const DUMMY_STATS = [
  { label: 'Total users (illustrative)', value: '12,847', sub: '+12% this month', icon: Users, color: 'bg-blue-500' },
  { label: 'Active bookings (illustrative)', value: '3,291', sub: 'Last 30 days', icon: Wrench, color: 'bg-emerald-500' },
  { label: 'Revenue (illustrative)', value: '₹8.2L', sub: '+8% vs last month', icon: CreditCard, color: 'bg-amber-500' },
  { label: 'Messages (illustrative)', value: '1,024', sub: 'Unread: 47', icon: MessageSquare, color: 'bg-violet-500' },
]

export default function AdminAnalytics() {
  const [dbStats, setDbStats] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const adminKey = import.meta.env.VITE_BRIDGE_ADMIN_KEY || ''

  useEffect(() => {
    if (!adminKey) {
      setLoadError('Set VITE_BRIDGE_ADMIN_KEY in the frontend .env (must match BRIDGE_ADMIN_KEY on the backend).')
      return
    }
    let cancelled = false
    fetch(getApiUrl('/api/admin/stats'), {
      headers: { 'X-Bridge-Admin-Key': adminKey },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || res.statusText)
        return data
      })
      .then((data) => {
        if (!cancelled) {
          setDbStats(data)
          setLoadError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setDbStats(null)
          setLoadError(e.message || 'Failed to load database stats')
        }
      })
    return () => { cancelled = true }
  }, [adminKey])

  const d = dbStats?.fromDatabase

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics</h1>
      <p className="text-slate-500 mb-8">Overview of platform activity</p>

      <div className="mb-10">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" />
          From your database (live)
        </h2>
        {!adminKey ? (
          <Card className="p-5 border-amber-200 bg-amber-50/50 text-amber-900 text-sm">{loadError}</Card>
        ) : loadError ? (
          <Card className="p-5 border-red-200 bg-red-50/50 text-red-800 text-sm">{loadError}</Card>
        ) : !d ? (
          <Card className="p-8 text-center text-slate-500 text-sm">Loading…</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border border-slate-200/80">
              <p className="text-sm font-medium text-slate-500">Users (all roles)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{d.totalUsers}</p>
              <p className="text-xs text-slate-500 mt-1">Hire: {d.usersWithRoleHire} · Provider accounts: {d.usersWithRoleServiceProvider}</p>
            </Card>
            <Card className="p-5 border border-slate-200/80">
              <p className="text-sm font-medium text-slate-500">Service provider profiles</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{d.serviceProviderProfiles}</p>
              <p className="text-xs text-slate-500 mt-1">Rows in service_provider</p>
            </Card>
            <Card className="p-5 border border-slate-200/80">
              <p className="text-sm font-medium text-slate-500">Works booked</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{d.totalBookings}</p>
              <p className="text-xs text-slate-500 mt-1">Pending acceptance: {d.pendingAcceptanceBookings}</p>
            </Card>
            <Card className="p-5 border border-slate-200/80">
              <p className="text-sm font-medium text-slate-500">Custom work requests</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{d.totalCustomWorkRequests}</p>
              <p className="text-xs text-slate-500 mt-1">Open now: {d.openCustomWorkRequests}</p>
            </Card>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Illustrative metrics (not from DB)
        </h2>
        <p className="text-xs text-slate-500 mb-4">Marketing-style numbers for demos only — clearly separated from live counts above.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DUMMY_STATS.map(({ label, value, sub, icon: Icon, color }) => (
            <Card key={label} className="p-5 border border-dashed border-slate-300 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{sub}</p>
                </div>
                <span className={`inline-flex p-2.5 rounded-xl ${color} text-white opacity-80`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200/80">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal-600" />
            Bookings trend
          </h2>
          <div className="h-64 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
            Chart placeholder — connect your analytics
          </div>
        </Card>
        <Card className="p-6 border border-slate-200/80">
          <h2 className="font-semibold text-slate-900 mb-4">Top categories</h2>
          <ul className="space-y-3">
            {['Plumbing', 'AC & Appliances', 'Cleaning & Pest', 'Electronics', 'Electrical'].map((cat, i) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{cat}</span>
                <span className="font-medium text-slate-500">{[1240, 980, 756, 612, 488][i]} bookings <span className="text-slate-400">(demo)</span></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
