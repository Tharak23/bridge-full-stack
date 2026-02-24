import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

export default function ServicesByCategory() {
  const { category } = useParams()
  const { getToken } = useAuth()
  const [services, setServices] = useState([])
  const [professionalsCount, setProfessionalsCount] = useState(1)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchApiJson(`/api/services?category=${encodeURIComponent(category || '')}`, {}, getToken),
      fetchApiJson(`/api/services/professionals-count?category=${encodeURIComponent(category || '')}`, {}, getToken).catch(() => ({ count: 1 })),
    ]).then(([list, countData]) => {
      if (!cancelled) {
        setServices(Array.isArray(list) ? list : [])
        setProfessionalsCount(countData?.count ?? 1)
      }
    })
    return () => { cancelled = true }
  }, [category, getToken])

  const categoryName = (category || '').replace(/_/g, ' ')

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">{categoryName}</h1>
        <p className="text-slate-500 mt-1">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-medium text-emerald-800">
            {professionalsCount} professional{professionalsCount !== 1 ? 's' : ''} available
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => (
          <Card key={svc.id || svc.slug} hover className="overflow-hidden flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <h2 className="font-semibold text-slate-900 text-lg">{svc.name}</h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {svc.rating} · ({Number(svc.reviews).toLocaleString()} reviews)
              </p>
              <p className="text-lg font-bold text-teal-600 mt-2">₹{svc.price}</p>
              <Link to={`/hiredashboard/services/${category}/${svc.slug}`} className="mt-4">
                <Button variant="outline" className="w-full rounded-lg border-2">
                  View details & Add
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {services.length === 0 && (
        <Card className="p-10 text-center overflow-hidden">
          <p className="text-slate-500">No services in this category yet. Try another.</p>
        </Card>
      )}
    </div>
  )
}
