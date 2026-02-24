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
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/hiredashboard" className="hover:text-teal-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/hiredashboard/services/${category}`} className="hover:text-teal-600 capitalize">{categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            You will get {service.name}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-semibold">
              {DUMMY_PROVIDER.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{DUMMY_PROVIDER.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {DUMMY_PROVIDER.rating} ({DUMMY_PROVIDER.reviews} reviews)
              </p>
              {DUMMY_PROVIDER.badge && (
                <span className="inline-block mt-1 text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {DUMMY_PROVIDER.badge}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => navigate('/hiredashboard/messages', { state: { openConversation: { id: 'ajay', name: DUMMY_PROVIDER.name } } })}
            >
              <MessageCircle className="h-4 w-4 mr-2" /> Message
            </Button>
          </div>
          <div className="w-full h-48 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
            Service preview
          </div>

          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-3">What&apos;s included</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
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

          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-3">Cancellation policy</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Free cancellation up to 2 hours before the scheduled time. Later cancellations may incur a fee. Reschedule anytime from My Bookings.
              </p>
            </div>
          </Card>

          {related.length > 0 && (
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="font-bold text-slate-900 mb-3">Related services</h2>
                <div className="flex flex-wrap gap-2">
                  {related.map((opt) => (
                    <Link
                      key={opt.slug}
                      to={`/hiredashboard/services/${category}/select/${opt.slug}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-800 transition-colors"
                    >
                      {opt.name} — ₹{opt.price}
                    </Link>
                  ))}
                </div>
                <Link to={`/hiredashboard/services/${category}`} className="inline-block mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium">
                  View all {categoryName} services →
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="overflow-hidden sticky top-24 shadow-md">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">Select service tier</h2>
              <div className="space-y-2 mb-4">
                {SERVICE_TIERS.map((tier) => (
                  <label
                    key={tier.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedTier.id === tier.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
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
                    <span className="font-medium text-slate-900">{tier.name}</span>
                    <span className="font-bold text-teal-600">₹{tier.price}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 mb-4"
                onClick={() => setShowCompareTiers((v) => !v)}
              >
                {showCompareTiers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Compare tiers
              </button>
              {showCompareTiers && (
                <div className="mb-4 rounded-lg border border-slate-200 overflow-hidden text-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left p-2 font-medium text-slate-700">Tier</th>
                        <th className="text-left p-2 font-medium text-slate-700">Price</th>
                        <th className="text-left p-2 font-medium text-slate-700">Delivery</th>
                        <th className="text-left p-2 font-medium text-slate-700">Revisions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SERVICE_TIERS.map((t) => (
                        <tr key={t.id} className="border-b border-slate-100 last:border-0">
                          <td className="p-2 text-slate-900">{t.name}</td>
                          <td className="p-2 text-teal-600 font-medium">₹{t.price}</td>
                          <td className="p-2 text-slate-600">{t.deliveryDays} day</td>
                          <td className="p-2 text-slate-600">{t.revisions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <dl className="space-y-2 text-sm border-t border-slate-200 pt-4 mb-4">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Delivery time</dt>
                  <dd className="text-slate-900 font-medium">{selectedTier.deliveryDays} day</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Revisions</dt>
                  <dd className="text-slate-900 font-medium">{selectedTier.revisions}</dd>
                </div>
              </dl>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <span className="inline-block w-4 h-4 rounded bg-slate-200" /> Delivery by next working day
              </p>
              <Button className="w-full rounded-lg h-11 mb-2" onClick={handleContinue}>
                Continue (₹{selectedTier.price})
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => navigate('/hiredashboard/messages', { state: { openConversation: { id: 'ajay', name: DUMMY_PROVIDER.name } } })}
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
