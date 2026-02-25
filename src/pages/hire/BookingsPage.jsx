import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBookings } from '@/lib/bookingsStorage'
import { getRequests, assignProvider } from '@/lib/serviceRequestsStorage'
import { Calendar, ChevronRight, User, CheckCircle, Pencil } from 'lucide-react'

const DUMMY_APPLICANTS = [
  { providerId: 'pro-1', providerName: 'Ajay K.', message: 'I can help with this. 5+ years experience.', rating: 4.9 },
  { providerId: 'pro-2', providerName: 'Priya M.', message: 'Available on your preferred date.', rating: 4.8 },
]

function formatDate(d) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
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
  const [apiBookings, setApiBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const localBookings = getBookings()
  const serviceRequests = getRequests()

  useEffect(() => {
    let cancelled = false
    fetchApiJson('/api/bookings/my', {}, getToken)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setApiBookings(data)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [getToken])

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const allBookings = [
    ...localBookings.map((b) => ({
      ...b,
      price: b.total,
      scheduledDate: b.serviceDate ? formatDate(b.serviceDate) : null,
      locationText: b.locationText || '—',
      source: 'local',
    })),
    ...apiBookings.filter((b) => !localBookings.some((lb) => lb.id === b.id)).map((b) => ({
      ...b,
      scheduledDate: b.scheduled_at ? formatDate(b.scheduled_at) : b.scheduledDate,
      locationText: b.locationText || b.location_text || '—',
      source: 'api',
    })),
  ].sort((a, b) => {
    const da = a.serviceDate || a.scheduled_at || a.createdAt
    const db = b.serviceDate || b.scheduled_at || b.createdAt
    if (!da) return 1
    if (!db) return -1
    return new Date(db) - new Date(da)
  })

  const bookingsThisMonth = allBookings.filter((b) => {
    const d = b.serviceDate || b.scheduled_at
    if (!d) return false
    const dt = new Date(d)
    return dt.getMonth() === thisMonth && dt.getFullYear() === thisYear
  })

  const handleAccept = (requestId, providerId, providerName) => {
    assignProvider(requestId, providerId, providerName)
    navigate(0)
  }

  if (loading && allBookings.length === 0 && tab === 'bookings') {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[40vh]">
        <div className="animate-pulse text-slate-500">Loading…</div>
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
          {serviceRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500 mb-4">No custom requests yet. Create one from the home page.</p>
              <Link to="/hiredashboard">
                <Button>Request custom work</Button>
              </Link>
            </Card>
          ) : (
            serviceRequests.map((req) => (
              <Card key={req.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900">{req.description || 'Custom request'}</span>
                    <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">{req.category.replace(/_/g, ' ')}</span>
                    {req.status === 'assigned' && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Assigned</span>
                    )}
                    {req.status === 'open' && (
                      <Link
                        to={`/hiredashboard/requests/${req.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 ml-auto"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Preferred: {req.preferredDate ? formatDate(req.preferredDate) : 'Any'} · Budget: {req.budgetMin ? `₹${req.budgetMin}` : '—'}
                  </p>
                  {req.status === 'assigned' && req.assignedProviderName && (
                    <p className="text-sm text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> {req.assignedProviderName}
                    </p>
                  )}
                  {req.status === 'open' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm font-medium text-slate-700 mb-2">Applicants</p>
                      {(req.applicants?.length ? req.applicants : DUMMY_APPLICANTS).map((a) => (
                        <div key={a.providerId} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{a.providerName}</p>
                              <p className="text-xs text-slate-500">{a.message || `★ ${a.rating || 4.8}`}</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleAccept(req.id, a.providerId, a.providerName)}>
                            Accept
                          </Button>
                        </div>
                      ))}
                      {(!req.applicants?.length && DUMMY_APPLICANTS.length) ? (
                        <p className="text-xs text-slate-500 mt-2">Professionals can apply from Available jobs. Showing suggested pros.</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <>
          {allBookings.length === 0 ? (
            <Card className="overflow-hidden p-12 text-center">
              <p className="text-slate-500 mb-4">No bookings yet. Book a service to see them here.</p>
              <Link to="/hiredashboard">
                <span className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700 transition-colors">
                  Browse services
                </span>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">All bookings</h2>
              {allBookings.map((b) => (
                <Card
                  key={b.id}
                  className={`overflow-hidden border-l-4 ${borderClass(b.status)} cursor-pointer transition-all hover:shadow-md`}
                  onClick={() => navigate(`/hiredashboard/bookings/${b.id}`, { state: { booking: b } })}
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-900 text-lg">{b.serviceName}</h2>
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
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
