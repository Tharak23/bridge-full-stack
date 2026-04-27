import { useEffect, useState } from 'react'
import { getApiUrl } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Database } from 'lucide-react'

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
      <p className="text-slate-500 mb-8">Overview of platform activity from your database</p>

      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Database className="h-4 w-4" />
        From your database
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
  )
}
