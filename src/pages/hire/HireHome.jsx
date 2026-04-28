import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Wrench, Zap, Wind, Sparkles, Scissors, Tv, BookOpen, Briefcase, MoreHorizontal, Send } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DUMMY_CATEGORIES, FEATURED_NEAR_YOU, HOW_IT_WORKS, POPULAR_PROFESSIONALS } from '@/data/hireDummy'
import { fetchApiJson } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  wind: Wind,
  sparkles: Sparkles,
  scissors: Scissors,
  tv: Tv,
  'book-open': BookOpen,
  briefcase: Briefcase,
  'more-horizontal': MoreHorizontal,
}

const categoryColors = [
  'bg-[#c1121f]',
  'bg-[#111111]',
  'bg-[#d72638]',
  'bg-[#2a2a2a]',
  'bg-[#b80f1a]',
  'bg-[#3b3b3b]',
  'bg-[#c1121f]',
  'bg-[#1a1a1a]',
  'bg-[#d72638]',
]

const CATEGORY_OPTIONS = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'ac_appliances', label: 'AC & Appliances' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'cleaning_pest', label: 'Cleaning & Pest' },
  { value: 'salon_spa', label: 'Salon & Spa' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'professional_works', label: 'Other professional works' },
  { value: 'other', label: 'Other' },
]

export default function HireHome() {
  const navigate = useNavigate()
  const toast = useToast()
  const { getToken } = useAuth()
  const [searchParams] = useSearchParams()
  const searchQ = (searchParams.get('q') || '').trim().toLowerCase()
  const [categories] = useState(DUMMY_CATEGORIES)
  const [requestCategory, setRequestCategory] = useState('plumbing')
  const [requestDesc, setRequestDesc] = useState('')
  const [requestDate, setRequestDate] = useState('')
  const [requestBudget, setRequestBudget] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const filteredCategories = useMemo(
    () =>
      !searchQ
        ? DUMMY_CATEGORIES
        : DUMMY_CATEGORIES.filter(
            (c) => c.name.toLowerCase().includes(searchQ) || c.slug.toLowerCase().includes(searchQ)
          ),
    [searchQ]
  )
  const filteredFeatured = useMemo(
    () =>
      !searchQ
        ? FEATURED_NEAR_YOU
        : FEATURED_NEAR_YOU.filter((f) => f.name.toLowerCase().includes(searchQ) || (f.category && f.category.toLowerCase().includes(searchQ))),
    [searchQ]
  )
  const filteredPopular = useMemo(
    () =>
      !searchQ
        ? POPULAR_PROFESSIONALS
        : POPULAR_PROFESSIONALS.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQ) ||
              (p.category && p.category.toLowerCase().includes(searchQ)) ||
              (p.slug && p.slug.toLowerCase().includes(searchQ))
          ),
    [searchQ]
  )

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    if (!requestDesc.trim()) {
      toast.error('Please describe what you need.')
      return
    }
    try {
      await fetchApiJson(
        '/api/custom-requests',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: requestCategory,
            description: requestDesc.trim(),
            preferredDate: requestDate || null,
            budgetMin: requestBudget ? parseInt(requestBudget, 10) : null,
            locationText: null,
          }),
        },
        getToken
      )
      setRequestSent(true)
      setRequestDesc('')
      setRequestDate('')
      setRequestBudget('')
      toast.success('Request submitted. View in My Bookings → Services requested.')
      setTimeout(() => navigate('/hiredashboard/bookings?tab=requests'), 500)
    } catch (err) {
      toast.error(err.data?.error || err.message || 'Could not submit request')
    }
  }

  return (
    <>
      {searchQ && (
        <section className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Search results for <strong className="text-[var(--color-text)]">&quot;{searchParams.get('q')}&quot;</strong>
            {filteredCategories.length === 0 && filteredFeatured.length === 0 && filteredPopular.length === 0 && (
              <span className="mt-1 block text-[var(--color-text-subtle)]">No matches. Try a different term.</span>
            )}
            </p>
          </div>
        </section>
      )}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[#111111] py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.45),transparent_32%)]" />
        <div className="container relative mx-auto max-w-5xl px-4 text-center">
          <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ffd7db]">
            Red edition
          </span>
          <motion.h1
            className="mb-6 text-4xl font-black leading-tight md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Request, book, and manage services with a stronger <em className="italic text-[#ffd7db]">Bridge experience</em>
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-white/72 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore categories, send work requests, track payments, and manage bookings in a bold red, white, and black interface.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <div className="mb-6 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">Request My Work</span>
          <h2 className="text-3xl font-black text-[var(--color-text)]">Request custom work</h2>
          <p className="text-[var(--color-text-muted)]">Describe the work you need. Professionals can apply and you choose who to assign.</p>
        </div>
        {requestSent && (
          <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-muted)] p-4 text-sm font-medium text-[var(--color-primary)]">
            Request submitted. View it in My Bookings → Services requested.
          </div>
        )}
        <Card className="max-w-5xl overflow-hidden border-0 bg-transparent shadow-none">
          <form onSubmit={handleSubmitRequest} className="grid gap-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-lg)] md:grid-cols-[1.15fr_0.85fr] md:p-8">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Category</label>
              <select
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[#fff8f8] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">What do you need?</label>
              <textarea
                value={requestDesc}
                onChange={(e) => setRequestDesc(e.target.value)}
                placeholder="Describe the work..."
                rows={3}
                className="w-full resize-none rounded-[1.5rem] border border-[var(--color-border)] bg-[#fff8f8] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
              />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Preferred date</label>
                  <Input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="w-full bg-[#fff8f8]" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Budget (₹)</label>
                  <Input type="number" placeholder="Optional" value={requestBudget} onChange={(e) => setRequestBudget(e.target.value)} min={0} className="w-full bg-[#fff8f8]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#111111] p-6 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd7db]">Quick submit</p>
                <h3 className="mt-3 text-2xl font-black">Turn your request into bookings faster</h3>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Use the request form to outline scope, timing, and budget. The workflow stays the same, only the presentation is refreshed.
                </p>
              </div>
              <div className="pt-6">
                <Button type="submit" className="w-full gap-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
                <Send className="h-4 w-4" /> Submit request
              </Button>
              </div>
            </div>
          </form>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="mb-1 text-3xl font-black text-[var(--color-text)]">Service categories</h2>
        <p className="mb-8 text-[var(--color-text-muted)]">Choose a category to browse services</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-5">
          {filteredCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Wrench
            const colorClass = categoryColors[i % categoryColors.length]
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="min-h-[140px]"
              >
                <Link to={`/hiredashboard/services/${cat.slug}`} className="block h-full group">
                  <Card hover className="h-full border border-[var(--color-border)]">
                    <div className="p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
                      <span
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClass} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
                        {cat.name}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <h2 className="mb-1 text-3xl font-black text-[var(--color-text)]">Featured near you</h2>
          <p className="mb-8 text-[var(--color-text-muted)]">Popular services in your area</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {filteredFeatured.map((item) => (
            <Link
              key={item.name}
              to={`/hiredashboard/services/${item.category}`}
              className="block"
            >
              <Card hover className="h-full">
                <div className="p-6 flex flex-col">
                  <span className="mb-1 block text-lg font-bold text-[var(--color-text)]">{item.name}</span>
                  <p className="mb-2 text-sm text-[var(--color-text-muted)]">★ {item.rating} · {item.price}</p>
                  <span className="text-sm font-medium text-[var(--color-primary)]">View services →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="mb-1 text-3xl font-black text-[var(--color-text)]">How it works</h2>
        <p className="mb-8 text-[var(--color-text-muted)]">Book in three simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="overflow-hidden">
              <div className="p-6 flex flex-col">
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-muted)] font-black text-[var(--color-primary)]">
                  {item.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="mb-1 text-3xl font-black text-[var(--color-text)]">Popular professionals</h2>
        <p className="mb-8 text-[var(--color-text-muted)]">Trusted professionals by category</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPopular.map(({ name, category, slug, rating }) => (
            <Link key={name} to={`/hiredashboard/services/${slug}`} className="block min-h-[120px]">
              <Card hover className="h-full min-h-[120px] flex">
                <div className="p-6 flex flex-col justify-center w-full">
                  <span className="mb-1 block text-lg font-bold text-[var(--color-text)]">{name}</span>
                  <span className="mb-2 block text-sm text-[var(--color-text-muted)]">{category} · ★ {rating}</span>
                  <span className="text-sm font-medium text-[var(--color-primary)]">View services →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
