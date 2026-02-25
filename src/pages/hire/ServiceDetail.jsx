import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { useCart } from '@/context/CartContext'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, CheckCircle2 } from 'lucide-react'
import PageLoader from '@/components/PageLoader'

export default function ServiceDetail() {
  const { category, slug } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { addItem } = useCart()
  const [service, setService] = useState(null)
  const [professionalsCount, setProfessionalsCount] = useState(1)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchApiJson(`/api/services?category=${encodeURIComponent(category || '')}`, {}, getToken).then((list) => {
        const found = (list || []).find((s) => s.slug === slug)
        return found || { id: slug, name: slug, slug, price: 199, rating: 4.75, reviews: 10000 }
      }),
      fetchApiJson(`/api/services/professionals-count?slug=${encodeURIComponent(slug || '')}`, {}, getToken).catch(() => ({ count: 1 })),
    ]).then(([svc, countData]) => {
      if (!cancelled) {
        setService(svc)
        setProfessionalsCount(countData?.count ?? 1)
      }
    })
    return () => { cancelled = true }
  }, [category, slug, getToken])

  const handleAdd = () => {
    if (!service) return
    addItem({
      serviceName: service.name,
      serviceSlug: service.slug,
      serviceCategory: category,
      price: service.price,
      quantity,
    })
    navigate('/hiredashboard/cart')
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12">
        <PageLoader message="Loading service…" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {service.rating}
              </span>
              <span>({Number(service.reviews || 0).toLocaleString()} reviews)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-800">
                {professionalsCount} professional{professionalsCount !== 1 ? 's' : ''} available
              </span>
            </p>
          </div>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-900">What you get</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                Inspection & quote. Repair begins after your approval.
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                Professional technicians available at your convenience.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24 shadow-lg border-slate-200">
            <CardContent className="p-6 space-y-5">
              <div>
                <span className="text-3xl font-bold text-slate-900">₹{service.price}</span>
                <span className="text-slate-500 text-sm ml-1">/ service</span>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="mt-2"
                />
              </div>
              <Button className="w-full rounded-xl h-11 text-base" variant="default" onClick={handleAdd}>
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => navigate('/hiredashboard')}
              >
                Continue browsing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
