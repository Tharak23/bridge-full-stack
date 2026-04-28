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
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black text-[var(--color-text)]">Review and book</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border border-[var(--color-border)]">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-black text-[var(--color-text)]">{draft.serviceName}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-[var(--color-text-muted)]">Tier</dt>
                <dd className="font-medium text-[var(--color-text)]">{draft.tier?.name}</dd>
                <dt className="text-[var(--color-text-muted)]">Delivery</dt>
                <dd className="font-medium text-[var(--color-text)]">{draft.tier?.deliveryDays} day</dd>
                {draft.serviceDate && (
                  <>
                    <dt className="text-[var(--color-text-muted)]">Service date</dt>
                    <dd className="font-medium text-[var(--color-text)]">{new Date(draft.serviceDate).toLocaleDateString()}</dd>
                    <dt className="text-[var(--color-text-muted)]">Time slot</dt>
                    <dd className="font-medium text-[var(--color-text)]">{draft.timeSlotLabel ?? '—'}</dd>
                  </>
                )}
                <dt className="text-[var(--color-text-muted)]">Visits</dt>
                <dd className="font-medium text-[var(--color-text)]">{draft.visits ?? 1}</dd>
              </dl>
            </div>
          </Card>

          <Card className="overflow-hidden border border-[var(--color-border)]">
            <div className="p-6">
              <h2 className="mb-3 text-lg font-black text-[var(--color-text)]">Professional</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-muted)] font-semibold text-[var(--color-primary)]">
                  {provider.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{provider.name}</p>
                  <p className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {provider.rating} ({provider.reviews} reviews)
                  </p>
                  {provider.badge && (
                    <span className="mt-1 inline-block rounded-full bg-[var(--color-primary-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                      {provider.badge}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text)]">3 professionals available</strong> for this service in your area. We&apos;ll assign the best match after you confirm.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden border border-[var(--color-border)]">
            <div className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-[var(--color-text)]">
                <span className="text-2xl">4.96</span>
                <span className="text-amber-500 flex">★★★★★</span>
              </h2>
              <p className="mb-1 font-semibold text-[var(--color-text)]">Guest favorite</p>
              <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                This service is in the top 5% of listings based on ratings, reviews, and reliability.
              </p>
              <div className="space-y-3">
                {DUMMY_REVIEWS.map((r, i) => (
                  <div key={i} className="border-t border-[#f3e4e6] pt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--color-text)]">{r.author}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </span>
                      <span className="text-xs text-[var(--color-text-subtle)]">{r.date}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20 overflow-hidden border border-[var(--color-border)] shadow-lg">
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-[var(--color-text)]">₹{total}</span>
                <span className="text-sm text-[var(--color-text-muted)]">total</span>
              </div>
              <Button className="mb-4 h-12 w-full rounded-xl" onClick={handleConfirm}>
                Confirm booking
              </Button>
              <div className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                <p>Payment is secure. You pay after the professional completes the job to your satisfaction.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
