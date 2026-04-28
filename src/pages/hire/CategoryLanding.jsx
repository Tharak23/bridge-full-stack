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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 text-sm text-[var(--color-text-muted)]">
        <Link to="/hiredashboard" className="hover:text-[var(--color-primary)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize text-[var(--color-text)]">{categoryName}</span>
      </nav>

      {/* Blog-like intro */}
      <section className="mb-10 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-lg)] md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Service category</p>
              <h1 className="mb-4 text-3xl font-black text-[var(--color-text)] md:text-4xl">{blog.title}</h1>
              <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{blog.intro}</p>
            </div>
            <p className="mt-6 text-sm text-[var(--color-text-muted)]">Browse service packages below and continue to booking.</p>
          </div>
          <div className="h-56 w-full overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-slate-200 md:h-auto">
            <img
              src={`https://picsum.photos/seed/${category}/320/192`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Service options (problems) - Upwork style */}
      <section>
        <h2 className="mb-2 text-2xl font-black text-[var(--color-text)]">Services we offer</h2>
        <p className="mb-6 text-[var(--color-text-muted)]">Choose your service. Click Add to select tier and continue booking.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {options.map((opt) => (
            <Card key={opt.slug} hover className="overflow-hidden border border-[var(--color-border)]">
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{opt.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {opt.rating} ({opt.reviews.toLocaleString()} reviews)
                </p>
                  <p className="mt-2 text-xl font-black text-[var(--color-primary)]">₹{opt.price}</p>
                </div>
                <Button
                  className="rounded-full gap-2 px-5"
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
