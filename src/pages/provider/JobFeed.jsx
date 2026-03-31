import { useState, useEffect, useCallback } from 'react'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, IndianRupee, Calendar, User } from 'lucide-react'
import PageLoader from '@/components/PageLoader'
import { useToast } from '@/context/ToastContext'

const DUMMY_JOBS = [
  { id: 'd1', serviceName: 'AC Repair', locationText: 'Jubilee Hills, Hyderabad', price: 299, quantity: 1 },
  { id: 'd2', serviceName: 'Home Cleaning', locationText: 'Banjara Hills, Hyderabad', price: 399, quantity: 1 },
  { id: 'd3', serviceName: 'Plumbing - Tap Repair', locationText: 'Madhapur, Hyderabad', price: 149, quantity: 1 },
  { id: 'd4', serviceName: 'AC Service', locationText: 'Gachibowli, Hyderabad', price: 349, quantity: 1 },
]

function formatDate(d) {
  if (!d) return 'Any date'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return 'Any date'
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JobFeed() {
  const { getToken } = useAuth()
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [customOpen, setCustomOpen] = useState([])
  const [loading, setLoading] = useState(true)
  const [msgByReq, setMsgByReq] = useState({})
  const [applyingId, setApplyingId] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [feedJobs, custom] = await Promise.all([
        fetchApiJson('/api/bookings/provider/feed', {}, getToken).catch(() => []),
        fetchApiJson('/api/custom-requests/feed', {}, getToken).catch(() => []),
      ])
      if (Array.isArray(feedJobs)) setJobs(feedJobs)
      if (Array.isArray(custom)) setCustomOpen(custom)
    } catch {
      setJobs([])
      setCustomOpen([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleAcceptBooking = async (id) => {
    if (String(id).startsWith('d')) return
    try {
      await fetchApiJson(`/api/bookings/${id}/accept`, { method: 'PATCH' }, getToken)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      toast.success('Booking accepted.')
    } catch (_) {
      toast.error('Could not accept booking')
    }
  }

  const handleRejectBooking = async (id) => {
    if (String(id).startsWith('d')) return
    try {
      await fetchApiJson(`/api/bookings/${id}/reject`, { method: 'PATCH' }, getToken)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (_) {
      toast.error('Could not reject')
    }
  }

  const handleApplyCustom = async (reqId) => {
    setApplyingId(reqId)
    try {
      const message = (msgByReq[reqId] || '').trim() || undefined
      await fetchApiJson(
        `/api/custom-requests/${reqId}/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message || null }),
        },
        getToken
      )
      toast.success('Application sent. The customer can accept you from My Bookings.')
      setMsgByReq((prev) => ({ ...prev, [reqId]: '' }))
      await loadAll()
    } catch (e) {
      toast.error(e.data?.error || e.message || 'Could not apply')
    } finally {
      setApplyingId(null)
    }
  }

  const displayJobs = jobs.length > 0 ? jobs : DUMMY_JOBS

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Job Feed</h1>
      <p className="text-slate-500 mb-6">Custom requests and new bookings. Apply to custom jobs or accept standard bookings.</p>
      <div className="flex items-center gap-2 mb-8">
        <Badge variant="success" className="rounded-full">Online</Badge>
      </div>

      {loading ? (
        <PageLoader message="Loading job feed…" />
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-600" />
              Custom work requests
            </h2>
            <p className="text-sm text-slate-500 mb-4">Customers posted these jobs. Apply once — they choose who to assign.</p>
            {customOpen.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 text-sm">No open custom requests right now.</Card>
            ) : (
              <div className="space-y-4">
                {customOpen.map((req) => (
                  <Card key={req.id} className="overflow-hidden border-teal-100">
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Custom request</span>
                          <p className="font-bold text-slate-900 mt-2">{req.description || 'Custom work'}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                            <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">{(req.category || '').replace(/_/g, ' ')}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> {formatDate(req.preferredDate)}
                            </span>
                            {req.budgetMin != null && (
                              <span className="flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" /> ₹{req.budgetMin}
                              </span>
                            )}
                            {req.hireCity && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {req.hireCity}
                              </span>
                            )}
                            {req.hireName && (
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" /> {req.hireName}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={!!applyingId}
                          onClick={() => handleApplyCustom(req.id)}
                        >
                          {applyingId === req.id ? 'Applying…' : 'Apply'}
                        </Button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Message to customer (optional)</label>
                        <Input
                          placeholder="e.g. I can do this tomorrow. 5+ years experience."
                          value={msgByReq[req.id] || ''}
                          onChange={(e) => setMsgByReq((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Standard bookings</h2>
            <p className="text-sm text-slate-500 mb-4">Accept or reject pending service bookings.</p>
            <div className="space-y-4">
              {displayJobs.map((job) => (
                <Card key={job.id} hover className="overflow-hidden">
                  <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="min-w-0 space-y-1">
                      <h2 className="font-semibold text-slate-900 text-lg">{job.serviceName}</h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{job.locationText || '—'}</span>
                      </p>
                      <p className="text-sm font-medium text-teal-600 flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 flex-shrink-0" />
                        <span>₹{job.price} · Qty {job.quantity}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="accent" className="rounded-lg" onClick={() => handleAcceptBooking(job.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleRejectBooking(job.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {jobs.length === 0 && displayJobs.length > 0 && (
              <p className="text-sm text-slate-500 mt-4">Showing sample standard jobs until new bookings arrive.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
