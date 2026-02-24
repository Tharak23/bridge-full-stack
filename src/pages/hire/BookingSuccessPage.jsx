import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function BookingSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <p className="text-slate-500 mb-4">No booking found.</p>
        <Button onClick={() => navigate('/hiredashboard/bookings')}>My Bookings</Button>
      </div>
    )
  }

  const serviceDate = booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Successfully booked!</h1>
        <p className="text-slate-500">Your service is confirmed. Booking reference: <strong className="text-slate-700">{booking.bookingRef}</strong></p>
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-3">{booking.serviceName}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Service date</dt>
              <dd className="text-slate-900 font-medium">{serviceDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Time slot</dt>
              <dd className="text-slate-900 font-medium">{booking.timeSlotLabel ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-slate-900 font-bold text-blue-600">₹{booking.total} (pay after service)</dd>
            </div>
          </dl>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button className="rounded-xl" onClick={() => navigate(`/hiredashboard/bookings/${booking.id}`)}>
          View booking
        </Button>
        <Button variant="outline" className="rounded-xl" onClick={() => navigate('/hiredashboard')}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
