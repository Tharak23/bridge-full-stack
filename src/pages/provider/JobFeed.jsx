import { useState, useEffect } from 'react'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, IndianRupee } from 'lucide-react'
import PageLoader from '@/components/PageLoader'

const DUMMY_JOBS = [
  { id: 'd1', serviceName: 'AC Repair', locationText: 'Jubilee Hills, Hyderabad', price: 299, quantity: 1 },
  { id: 'd2', serviceName: 'Home Cleaning', locationText: 'Banjara Hills, Hyderabad', price: 399, quantity: 1 },
  { id: 'd3', serviceName: 'Plumbing - Tap Repair', locationText: 'Madhapur, Hyderabad', price: 149, quantity: 1 },
  { id: 'd4', serviceName: 'AC Service', locationText: 'Gachibowli, Hyderabad', price: 349, quantity: 1 },
]

export default function JobFeed() {
  const { getToken } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchApiJson('/api/bookings/provider/feed', {}, getToken)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setJobs(data)
      })
      .catch(() => setJobs([]))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [getToken])

  const handleAccept = async (id) => {
    if (id.startsWith('d')) return
    try {
      await fetchApiJson(`/api/bookings/${id}/accept`, { method: 'PATCH' }, getToken)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (_) {}
  }

  const handleReject = async (id) => {
    if (id.startsWith('d')) return
    try {
      await fetchApiJson(`/api/bookings/${id}/reject`, { method: 'PATCH' }, getToken)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (_) {}
  }

  const displayJobs = jobs.length > 0 ? jobs : DUMMY_JOBS

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Job Feed</h1>
      <p className="text-slate-500 mb-6">New job requests. Accept or reject to manage your workload.</p>
      <div className="flex items-center gap-2 mb-8">
        <Badge variant="success" className="rounded-full">Online</Badge>
      </div>
      {loading ? (
        <PageLoader message="Loading job feed…" />
      ) : (
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
                  <Button size="sm" variant="accent" className="rounded-lg" onClick={() => handleAccept(job.id)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleReject(job.id)}>
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {jobs.length === 0 && displayJobs.length > 0 && (
        <p className="text-sm text-slate-500 mt-4">Showing sample jobs. New requests will appear here.</p>
      )}
    </div>
  )
}
