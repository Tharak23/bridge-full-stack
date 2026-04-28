import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MessageCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { SERVICE_OPTIONS, SERVICE_TIERS, DUMMY_PROVIDER } from '@/data/hireDummy'

export default function ServiceSelectPage() {
  const { category, slug } = useParams()
  const navigate = useNavigate()
  const options = SERVICE_OPTIONS[category] || SERVICE_OPTIONS.other
  const service = options.find((s) => s.slug === slug) || options[0]
  const related = options.filter((s) => s.slug !== service.slug).slice(0, 3)
  const [selectedTier, setSelectedTier] = useState(SERVICE_TIERS[0])
  const [showCompareTiers, setShowCompareTiers] = useState(false)

  const handleContinue = () => {
    sessionStorage.setItem(
      'bridge_booking_draft',
      JSON.stringify({
        category,
        slug: service.slug,
        serviceName: service.name,
        basePrice: service.price,
        tier: selectedTier,
        provider: DUMMY_PROVIDER,
      })
    )
    navigate('/hiredashboard/booking')
  }

  const categoryName = (category || '').replace(/_/g, ' ')

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-5 text-sm text-[var(--color-text-muted)]">
        <Link to="/hiredashboard" className="hover:text-[var(--color-primary)]">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/hiredashboard/services/${category}`} className="capitalize hover:text-[var(--color-primary)]">{categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black text-[var(--color-text)] md:text-4xl">
            {service.name}
          </h1>
          <div className="flex items-center gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-muted)] font-semibold text-[var(--color-primary)]">
              {DUMMY_PROVIDER.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{DUMMY_PROVIDER.name}</p>
              <p className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {DUMMY_PROVIDER.rating} ({DUMMY_PROVIDER.reviews} reviews)
              </p>
              {DUMMY_PROVIDER.badge && (
                    <span className="mt-1 inline-block rounded-full bg-[var(--color-primary-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                  {DUMMY_PROVIDER.badge}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => navigate('/hiredashboard/professionals', { state: { openProfile: { id: 'ajay', name: DUMMY_PROVIDER.name } } })}
            >
              <MessageCircle className="h-4 w-4 mr-2" /> Message
            </Button>
          </div>
          <div className="h-56 w-full overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-slate-200">
            <img
              src={`https://picsum.photos/seed/${category}-${service.slug}/640/192`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <Card className="overflow-hidden border border-[var(--color-border)]">
            <div className="p-6">
              <h2 className="mb-3 text-lg font-black text-[var(--color-text)]">What&apos;s included</h2>
              <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                  Inspection and diagnosis at your location
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  Transparent quote before any repair
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  {selectedTier.revisions} revision{selectedTier.revisions > 1 ? 's' : ''} included
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  Verified professional with ratings
                </li>
              </ul>
            </div>
          </Card>

          <Card className="overflow-hidden border border-[var(--color-border)]">
            <div className="p-6">
              <h2 className="mb-3 text-lg font-black text-[var(--color-text)]">Cancellation policy</h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                Free cancellation up to 2 hours before the scheduled time. Later cancellations may incur a fee. Reschedule anytime from My Bookings.
              </p>
            </div>
          </Card>

          {related.length > 0 && (
            <Card className="overflow-hidden border border-[var(--color-border)]">
              <div className="p-6">
                <h2 className="mb-3 text-lg font-black text-[var(--color-text)]">Related services</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {related.map((opt) => (
                    <Link
                      key={opt.slug}
                      to={`/hiredashboard/services/${category}/select/${opt.slug}`}
                      className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-[#fff8f8] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      {opt.name} — ₹{opt.price}
                    </Link>
                  ))}
                </div>
                <Link to={`/hiredashboard/services/${category}`} className="mt-3 inline-block text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                  View all {categoryName} services →
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 overflow-hidden border border-[var(--color-border)] shadow-md">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-black text-[var(--color-text)]">Select service tier</h2>
              <div className="space-y-2 mb-4">
                {SERVICE_TIERS.map((tier) => (
                  <label
                    key={tier.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-colors ${
                      selectedTier.id === tier.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={tier.id}
                      checked={selectedTier.id === tier.id}
                      onChange={() => setSelectedTier(tier)}
                      className="sr-only"
                    />
                    <span className="font-medium text-[var(--color-text)]">{tier.name}</span>
                    <span className="font-bold text-[var(--color-primary)]">₹{tier.price}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="mb-4 flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                onClick={() => setShowCompareTiers((v) => !v)}
              >
                {showCompareTiers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Compare tiers
              </button>
              {showCompareTiers && (
                <div className="mb-4 overflow-hidden rounded-xl border border-[var(--color-border)] text-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[#fff8f8]">
                        <th className="p-2 text-left font-medium text-[var(--color-text-muted)]">Tier</th>
                        <th className="p-2 text-left font-medium text-[var(--color-text-muted)]">Price</th>
                        <th className="p-2 text-left font-medium text-[var(--color-text-muted)]">Delivery</th>
                        <th className="p-2 text-left font-medium text-[var(--color-text-muted)]">Revisions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SERVICE_TIERS.map((t) => (
                        <tr key={t.id} className="border-b border-[#f3e4e6] last:border-0">
                          <td className="p-2 text-[var(--color-text)]">{t.name}</td>
                          <td className="p-2 font-medium text-[var(--color-primary)]">₹{t.price}</td>
                          <td className="p-2 text-[var(--color-text-muted)]">{t.deliveryDays} day</td>
                          <td className="p-2 text-[var(--color-text-muted)]">{t.revisions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <dl className="mb-4 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Delivery time</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedTier.deliveryDays} day</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-muted)]">Revisions</dt>
                  <dd className="font-medium text-[var(--color-text)]">{selectedTier.revisions}</dd>
                </div>
              </dl>
              <p className="mb-4 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <span className="inline-block h-4 w-4 rounded bg-[var(--color-primary-muted)]" /> Delivery by next working day
              </p>
              <Button className="mb-2 h-12 w-full rounded-xl" onClick={handleContinue}>
                Continue (₹{selectedTier.price})
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => navigate('/hiredashboard/professionals', { state: { openProfile: { id: 'ajay', name: DUMMY_PROVIDER.name } } })}
              >
                <MessageCircle className="h-4 w-4 mr-2" /> Message {DUMMY_PROVIDER.name.split(' ')[0]}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
