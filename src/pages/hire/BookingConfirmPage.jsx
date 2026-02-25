import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Shield } from 'lucide-react'
import { addBooking } from '@/lib/bookingsStorage'
import { addPayment } from '@/lib/paymentsStorage'
import { useLocationContext } from '@/context/LocationContext'

const DUMMY_REVIEWS = [
  { author: 'Priya S.', rating: 5, text: 'Very professional and fixed the tap in no time. Would book again.', date: '2 weeks ago' },
  { author: 'Rahul M.', rating: 5, text: 'On time, clean work. Fair pricing.', date: '1 month ago' },
  { author: 'Anita K.', rating: 4, text: 'Good service. Minor delay but quality was great.', date: '1 month ago' },
]

export default function BookingConfirmPage() {
  const navigate = useNavigate()
  const { location: savedLocation } = useLocationContext()
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bridge_booking_draft')
      if (raw) setDraft(JSON.parse(raw))
    } catch (_) {}
  }, [])

  const handleConfirm = () => {
    const total = draft.total ?? draft.tier?.price ?? 0
    const bookingRef = `BR${Date.now().toString(36).toUpperCase()}`
    const created = addBooking({
      id: `bk-${Date.now()}`,
      bookingRef,
      serviceName: draft.serviceName,
      category: draft.category,
      tier: draft.tier,
      serviceDate: draft.serviceDate,
      timeSlotLabel: draft.timeSlotLabel,
      visits: draft.visits ?? 1,
      total,
      status: 'accepted',
      createdAt: new Date().toISOString(),
      providerName: draft.provider?.name,
      locationText: typeof draft.locationText === 'string' ? draft.locationText : (savedLocation || undefined),
    })
    addPayment({
      bookingId: created.id,
      serviceName: created.serviceName,
      location: created.locationText,
      amount: total,
      status: 'Pending',
    })
    sessionStorage.removeItem('bridge_booking_draft')
    navigate('/hiredashboard/booking/success', { state: { booking: created } })
  }

  if (!draft) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-slate-500 mb-4">No booking in progress.</p>
        <Button as={Link} to="/hiredashboard">Browse services</Button>
      </div>
    )
  }

  const provider = draft.provider || {}
  const total = draft.total ?? draft.tier?.price ?? 0

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Review and book</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">{draft.serviceName}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-slate-500">Tier</dt>
                <dd className="text-slate-900 font-medium">{draft.tier?.name}</dd>
                <dt className="text-slate-500">Delivery</dt>
                <dd className="text-slate-900 font-medium">{draft.tier?.deliveryDays} day</dd>
                {draft.serviceDate && (
                  <>
                    <dt className="text-slate-500">Service date</dt>
                    <dd className="text-slate-900 font-medium">{new Date(draft.serviceDate).toLocaleDateString()}</dd>
                    <dt className="text-slate-500">Time slot</dt>
                    <dd className="text-slate-900 font-medium">{draft.timeSlotLabel ?? '—'}</dd>
                  </>
                )}
                <dt className="text-slate-500">Visits</dt>
                <dd className="text-slate-900 font-medium">{draft.visits ?? 1}</dd>
              </dl>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-3">Professional</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                  {provider.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{provider.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {provider.rating} ({provider.reviews} reviews)
                  </p>
                  {provider.badge && (
                    <span className="inline-block mt-1 text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {provider.badge}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500">
                <strong className="text-slate-700">3 professionals available</strong> for this service in your area. We&apos;ll assign the best match after you confirm.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">4.96</span>
                <span className="text-amber-500 flex">★★★★★</span>
              </h2>
              <p className="font-semibold text-slate-900 mb-1">Guest favorite</p>
              <p className="text-sm text-slate-500 mb-4">
                This service is in the top 5% of listings based on ratings, reviews, and reliability.
              </p>
              <div className="space-y-3">
                {DUMMY_REVIEWS.map((r, i) => (
                  <div key={i} className="border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{r.author}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </span>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-slate-600">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-slate-900">₹{total}</span>
                <span className="text-slate-500 text-sm">total</span>
              </div>
              <Button className="w-full rounded-xl h-12 mb-4" onClick={handleConfirm}>
                Confirm booking
              </Button>
              <div className="flex items-start gap-2 text-sm text-slate-500">
                <Shield className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                <p>Payment is secure. You pay after the professional completes the job to your satisfaction.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
