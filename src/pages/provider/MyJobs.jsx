import { useState, useEffect } from 'react'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, IndianRupee } from 'lucide-react'

const DUMMY_UPCOMING = [
  { id: 'u1', serviceName: 'AC Repair', locationText: 'Jubilee Hills, Hyderabad', price: 299, status: 'accepted' },
  { id: 'u2', serviceName: 'Home Cleaning', locationText: 'Banjara Hills, Hyderabad', price: 399, status: 'accepted' },
]
const DUMMY_ONGOING = [
  { id: 'o1', serviceName: 'Plumbing - Tap Repair', locationText: 'Madhapur, Hyderabad', price: 149, status: 'ongoing' },
]
const DUMMY_COMPLETED = [
  { id: 'c1', serviceName: 'Home Cleaning', locationText: 'Banjara Hills', price: 399, status: 'completed' },
  { id: 'c2', serviceName: 'AC Service', locationText: 'Gachibowli', price: 349, status: 'completed' },
]

export default function MyJobs() {
  const { getToken } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchApiJson('/api/bookings/provider', {}, getToken)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setBookings(data)
      })
      .catch(() => setBookings([]))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [getToken])

  const updateStatus = async (id, status) => {
    if (String(id).startsWith('u') || String(id).startsWith('o') || String(id).startsWith('c')) return
    try {
      await fetchApiJson(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }, getToken)
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    } catch (_) {}
  }

  const upcoming = bookings.filter((b) => b.status === 'accepted')
  const ongoing = bookings.filter((b) => b.status === 'ongoing')
  const completed = bookings.filter((b) => b.status === 'completed')
  const cancelled = bookings.filter((b) => b.status === 'rejected' || b.status === 'cancelled')

  const displayUpcoming = upcoming.length > 0 ? upcoming : DUMMY_UPCOMING
  const displayOngoing = ongoing.length > 0 ? ongoing : DUMMY_ONGOING
  const displayCompleted = completed.length > 0 ? completed : DUMMY_COMPLETED

  const JobCard = ({ b }) => (
    <Card hover className="overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="font-semibold text-slate-900">{b.serviceName}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{b.locationText || '—'}</span>
          </p>
          <p className="text-sm font-medium text-teal-600 flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5 flex-shrink-0" />
            <span>₹{b.price}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge
            variant={
              b.status === 'completed'
                ? 'success'
                : b.status === 'rejected' || b.status === 'cancelled'
                  ? 'destructive'
                  : 'default'
            }
          >
            {b.status}
          </Badge>
          {b.status === 'accepted' && (
            <Button size="sm" variant="accent" className="rounded-lg" onClick={() => updateStatus(b.id, 'ongoing')}>
              Start job
            </Button>
          )}
          {b.status === 'ongoing' && (
            <Button size="sm" variant="default" className="rounded-lg" onClick={() => updateStatus(b.id, 'completed')}>
              Mark complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  )

  const Section = ({ title, items, empty, isDummy }) => (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">{empty}</p>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((b) => (
              <JobCard key={b.id} b={b} />
            ))}
          </div>
          {isDummy && <p className="text-sm text-slate-500 mt-2">Sample data. Your real jobs will appear here.</p>}
        </>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[40vh]">
        <div className="animate-pulse text-slate-500">Loading…</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">My Jobs</h1>
      <p className="text-slate-500 mb-8">Manage your upcoming, ongoing, and completed jobs</p>
      <Section title="Upcoming" items={displayUpcoming} empty="No upcoming jobs." isDummy={upcoming.length === 0} />
      <Section title="Ongoing" items={displayOngoing} empty="No ongoing jobs." isDummy={ongoing.length === 0} />
      <Section title="Completed" items={displayCompleted} empty="No completed jobs yet." isDummy={completed.length === 0} />
      <Section title="Cancelled" items={cancelled} empty="No cancelled jobs." />
    </div>
  )
}
