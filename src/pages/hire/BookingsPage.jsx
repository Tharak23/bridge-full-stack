import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchApi, fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBookings } from '@/lib/bookingsStorage'
import { useToast } from '@/context/ToastContext'
import PageLoader from '@/components/PageLoader'
import { Calendar, ChevronRight, User, CheckCircle, Pencil, XCircle, Trash2 } from 'lucide-react'

function formatDate(d) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }) {
  const s = String(status).replace(/_/g, ' ')
  if (status === 'completed') return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">{s}</span>
  if (status === 'cancelled' || status === 'rejected') return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">{s}</span>
  if (status === 'accepted' || status === 'ongoing') return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">{s}</span>
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{s}</span>
}

function borderClass(status) {
  if (status === 'completed') return 'border-l-emerald-500'
  if (status === 'cancelled' || status === 'rejected') return 'border-l-red-500'
  if (status === 'accepted' || status === 'ongoing') return 'border-l-blue-500'
  return 'border-l-slate-400'
}

export default function BookingsPage() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'bookings'
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [apiBookings, setApiBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiRequests, setApiRequests] = useState([])
  const [reqLoading, setReqLoading] = useState(true)

  const localBookings = getBookings()

  const loadBookings = useCallback(async () => {
    try {
      const data = await fetchApiJson('/api/bookings/my', {}, getToken)
      if (Array.isArray(data)) setApiBookings(data)
    } catch {
      setApiBookings([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const loadRequests = useCallback(async () => {
    setReqLoading(true)
    try {
      const data = await fetchApiJson('/api/custom-requests/my', {}, getToken)
      if (Array.isArray(data)) setApiRequests(data)
    } catch {
      setApiRequests([])
    } finally {
      setReqLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  useEffect(() => {
    if (tab === 'requests') loadRequests()
  }, [tab, loadRequests])

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const DUMMY_BOOKINGS_FALLBACK = [
    { id: 'dummy-1', serviceName: 'Tap & leak repair', locationText: 'Koramangala, Bangalore', serviceDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), scheduledDate: formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), price: 199, total: 199, status: 'accepted', source: 'dummy' },
    { id: 'dummy-2', serviceName: 'AC service', locationText: 'HSR Layout, Bangalore', serviceDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), scheduledDate: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), price: 349, total: 349, status: 'ongoing', source: 'dummy' },
  ]

  const allBookingsRaw = [
    ...localBookings.map((b) => ({
      ...b,
      price: b.total,
      scheduledDate: b.serviceDate ? formatDate(b.serviceDate) : null,
      locationText: b.locationText || '—',
      source: 'local',
    })),
    ...apiBookings.filter((b) => !localBookings.some((lb) => lb.id === b.id)).map((b) => ({
      ...b,
      scheduledDate: b.scheduledAt ? formatDate(b.scheduledAt) : b.scheduledDate,
      locationText: b.locationText || b.location_text || '—',
      providerName: b.providerName || '',
      source: 'api',
    })),
  ]
  const allBookings = (allBookingsRaw.length > 0 ? allBookingsRaw : DUMMY_BOOKINGS_FALLBACK).sort((a, b) => {
    const da = a.serviceDate || a.scheduledAt || a.createdAt
    const db = b.serviceDate || b.scheduledAt || b.createdAt
    if (!da) return 1
    if (!db) return -1
    return new Date(db) - new Date(da)
  })

  const bookingsThisMonth = allBookings.filter((b) => {
    if (b.source === 'dummy') return false
    const d = b.serviceDate || b.scheduledAt
    if (!d) return false
    const dt = new Date(d)
    return dt.getMonth() === thisMonth && dt.getFullYear() === thisYear
  })

  const handleSelectProvider = async (requestId, applicationId) => {
    try {
      await fetchApiJson(
        `/api/custom-requests/${requestId}/select-provider`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId }),
        },
        getToken
      )
      toast.success('Professional assigned. Check My Bookings for the confirmed job.')
      await loadRequests()
      await loadBookings()
    } catch (e) {
      toast.error(e.data?.error || e.message || 'Could not assign provider')
    }
  }

  const handleCancelRequest = async (req) => {
    if (!window.confirm('Cancel this request? You can create a new one later.')) return
    try {
      await fetchApiJson(`/api/custom-requests/${req.id}/cancel`, { method: 'PATCH' }, getToken)
      toast.success('Request cancelled.')
      loadRequests()
    } catch (e) {
      toast.error(e.data?.error || e.message || 'Failed')
    }
  }

  const handleDeleteRequest = async (req) => {
    if (!window.confirm('Delete this request permanently?')) return
    try {
      const res = await fetchApi(`/api/custom-requests/${req.id}`, { method: 'DELETE' }, getToken)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || res.statusText)
      }
      toast.success('Request deleted.')
      loadRequests()
    } catch (e) {
      toast.error(e.message || 'Failed')
    }
  }

  if (loading && allBookings.length === 0 && tab === 'bookings') {
    return (
      <div className="container mx-auto px-4 py-10">
        <PageLoader message="Loading bookings…" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track bookings and service requests</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">{bookingsThisMonth.length} this month</span>
          </div>
          <Link to="/hiredashboard" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
            Browse services →
          </Link>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          type="button"
          onClick={() => navigate('/hiredashboard/bookings')}
          className={`px-4 py-2 font-medium text-sm ${tab !== 'requests' ? 'border-b-2 border-teal-600 text-slate-900 -mb-px' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Bookings
        </button>
        <button
          type="button"
          onClick={() => navigate('/hiredashboard/bookings?tab=requests')}
          className={`px-4 py-2 font-medium text-sm ${tab === 'requests' ? 'border-b-2 border-teal-600 text-slate-900 -mb-px' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Services requested
        </button>
      </div>

      {tab === 'requests' ? (
        <div className="space-y-4">
          {reqLoading ? (
            <PageLoader message="Loading your requests…" />
          ) : apiRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500 mb-4">No custom requests yet. Describe what you need and professionals can apply.</p>
              <Link to="/hiredashboard/request">
                <Button>Request custom work</Button>
              </Link>
            </Card>
          ) : (
            apiRequests.map((req) => {
              const apps = Array.isArray(req.applications) ? req.applications : []
              const pendingApps = apps.filter((a) => a.status === 'pending')
              return (
                <Card key={req.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-slate-900">{req.description || 'Custom request'}</span>
                      <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                        {(req.category || 'other').replace(/_/g, ' ')}
                      </span>
                      {req.status === 'assigned' && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Assigned</span>
                      )}
                      {req.status === 'cancelled' && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Cancelled</span>
                      )}
                      {req.status === 'open' && (
                        <>
                          <Link
                            to={`/hiredashboard/requests/${req.id}/edit`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          <button type="button" onClick={() => handleCancelRequest(req)} className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700">
                            <XCircle className="h-3.5 w-3.5" /> Cancel
                          </button>
                          <button type="button" onClick={() => handleDeleteRequest(req)} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-3">
                      Preferred: {req.preferredDate ? formatDate(req.preferredDate) : 'Any'} · Budget:{' '}
                      {req.budgetMin != null ? `₹${req.budgetMin}` : '—'}
                    </p>
                    {req.status === 'assigned' && req.assignedProviderName && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 mb-2">
                        <p className="text-sm text-emerald-800 font-medium flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          Assigned professional: <strong>{req.assignedProviderName}</strong>
                        </p>
                        {req.linkedBookingId && (
                          <p className="text-xs text-emerald-700 mt-1">
                            Confirmed booking ID: <code className="bg-white/80 px-1 rounded">{req.linkedBookingId}</code> — also listed under the Bookings tab.
                          </p>
                        )}
                      </div>
                    )}
                    {req.status === 'open' && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-700 mb-2">Professionals who applied</p>
                        {pendingApps.length === 0 ? (
                          <p className="text-sm text-slate-500">No applications yet. Providers see your request on their dashboard.</p>
                        ) : (
                          pendingApps.map((a) => (
                            <div key={a.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 mb-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold shrink-0">
                                  <User className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-slate-900">{a.providerName || 'Professional'}</p>
                                  <p className="text-xs text-slate-500 truncate">{a.message || 'Applied to your request'}</p>
                                </div>
                              </div>
                              <Button size="sm" className="shrink-0" onClick={() => handleSelectProvider(req.id, a.id)}>
                                Accept
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {allBookingsRaw.length === 0 && (
              <p className="text-sm text-slate-500">Sample bookings below. Book a service to see your real bookings here.</p>
            )}
            <h2 className="text-lg font-semibold text-slate-800">All bookings</h2>
            {allBookings.map((b) => (
              <Card
                key={b.id}
                className={`overflow-hidden border-l-4 ${borderClass(b.status)} transition-all hover:shadow-md ${b.source === 'dummy' ? 'opacity-90 cursor-default' : 'cursor-pointer'}`}
                onClick={() => b.source !== 'dummy' && navigate(`/hiredashboard/bookings/${b.id}`, { state: { booking: b } })}
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-slate-900 text-lg">{b.serviceName}</h2>
                    {b.providerName && (
                      <p className="text-sm text-teal-700 font-medium mt-0.5">Assigned: {b.providerName}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-slate-500">Location</span>
                      <span className="text-slate-700">{b.locationText}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">Date</span>
                      <span className="text-slate-700">{b.scheduledDate || formatDate(b.serviceDate) || '—'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">Amount</span>
                      <span className="font-semibold text-blue-600">₹{b.price ?? b.total}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={b.status} />
                    {b.source !== 'dummy' && <ChevronRight className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
