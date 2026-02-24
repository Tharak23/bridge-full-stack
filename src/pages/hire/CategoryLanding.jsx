import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Plus } from 'lucide-react'
import { CATEGORY_BLOG, SERVICE_OPTIONS } from '@/data/hireDummy'

export default function CategoryLanding() {
  const { category } = useParams()
  const navigate = useNavigate()
  const blog = CATEGORY_BLOG[category] || CATEGORY_BLOG.other
  const options = SERVICE_OPTIONS[category] || SERVICE_OPTIONS.other
  const categoryName = (category || '').replace(/_/g, ' ')

  const handleAdd = (slug) => {
    navigate(`/hiredashboard/services/${category}/select/${slug}`)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/hiredashboard" className="hover:text-teal-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700 capitalize">{categoryName}</span>
      </nav>

      {/* Blog-like intro */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{blog.title}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="text-slate-600 text-lg leading-relaxed">{blog.intro}</p>
          </div>
          <div className="w-full md:w-80 h-48 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-medium shrink-0">
            {blog.imagePlaceholder}
          </div>
        </div>
      </section>

      {/* Service options (problems) - Upwork style */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Services we offer</h2>
        <p className="text-slate-500 mb-6">Choose the service you need. Click Add to select tier and book.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {options.map((opt) => (
            <Card key={opt.slug} hover className="overflow-hidden">
              <div className="p-5 flex flex-col">
                <h3 className="font-semibold text-slate-900 text-lg">{opt.name}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {opt.rating} ({opt.reviews.toLocaleString()} reviews)
                </p>
                <p className="text-lg font-bold text-teal-600 mt-2">₹{opt.price}</p>
                <Button
                  className="w-full mt-4 rounded-lg gap-2"
                  onClick={() => handleAdd(opt.slug)}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
