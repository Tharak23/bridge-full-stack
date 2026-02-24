import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBookingById, updateBookingStatus } from '@/lib/bookingsStorage'
import { Calendar, Clock, IndianRupee, MapPin, User, XCircle } from 'lucide-react'

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const booking = (id ? getBookingById(id) : null) || location.state?.booking

  const isLocalBooking = id ? !!getBookingById(id) : false
  const handleCancel = () => {
    if (!booking) return
    if (!isLocalBooking) {
      alert('Cancel from support or contact provider.')
      return
    }
    if (window.confirm('Cancel this booking?')) {
      updateBookingStatus(booking.id, 'cancelled')
      navigate('/hiredashboard/bookings')
    }
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-slate-500 mb-4">Booking not found.</p>
        <Button as={Link} to="/hiredashboard/bookings">Back to My Bookings</Button>
      </div>
    )
  }

  const createdDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'
  const serviceDate = booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'
  const isCancelled = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/hiredashboard" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/hiredashboard/bookings" className="hover:text-blue-600">My Bookings</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{booking.serviceName}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Your service booking</h1>
      <p className="text-slate-500 text-sm mb-8">
        Booking created: {createdDate} · Booking reference: <strong className="text-slate-700">{booking.bookingRef}</strong>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Service details card */}
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 text-xl mb-2">{booking.serviceName}</h2>
              <p className="text-slate-500 text-sm mb-4">{booking.tier?.name ?? 'Standard'} · {booking.visits ?? 1} visit{booking.visits > 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">Pay after service</span>
                <span className="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">Free cancellation</span>
              </div>
            </div>
          </Card>

          {/* Summary card */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">Summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Service date
                  </dt>
                  <dd className="text-slate-900 font-medium">{serviceDate}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time slot
                  </dt>
                  <dd className="text-slate-900 font-medium">{booking.timeSlotLabel ?? '—'}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" /> Service amount
                  </dt>
                  <dd className="text-slate-900 font-bold text-blue-600">₹{booking.total}</dd>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <dt className="text-slate-700 font-semibold">Total</dt>
                  <dd className="text-lg font-bold text-blue-600">₹{booking.total}</dd>
                </div>
              </dl>
            </div>
          </Card>

          {booking.locationText && (
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" /> Location
                </h2>
                <p className="text-slate-600">{booking.locationText}</p>
              </div>
            </Card>
          )}

          {booking.providerName && (
            <Card className="overflow-hidden">
              <div className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Professional</p>
                  <p className="text-slate-500 text-sm">{booking.providerName}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Options panel - KAYAK style */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">Options</h2>
              <div className="flex flex-col gap-2">
                {isLocalBooking ? (
                  <Button variant="outline" className="justify-start text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300" as={Link} to={`/hiredashboard/bookings/${booking.id}/change`}>
                    Change date & time
                  </Button>
                ) : (
                  <Button variant="outline" className="justify-start text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300" as={Link} to={`/hiredashboard/services/${booking.category || 'plumbing'}`}>
                    Change booking
                  </Button>
                )}
                {!isCancelled && !isCompleted && isLocalBooking && (
                  <Button variant="outline" className="justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={handleCancel}>
                    <XCircle className="h-4 w-4 mr-2" /> Cancel booking
                  </Button>
                )}
                <Button variant="ghost" className="justify-start text-blue-600" as={Link} to="/hiredashboard/messages">
                  Message provider
                </Button>
                <Button variant="ghost" className="justify-start text-slate-600" as={Link} to="/hiredashboard/payments">
                  View payment
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">Ref: {booking.bookingRef}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
