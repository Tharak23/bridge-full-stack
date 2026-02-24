import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, Zap, Wind, Sparkles, Scissors, Tv, MoreHorizontal, Send } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DUMMY_CATEGORIES, FEATURED_NEAR_YOU, HOW_IT_WORKS, POPULAR_PROFESSIONALS } from '@/data/hireDummy'
import { addRequest } from '@/lib/serviceRequestsStorage'

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  wind: Wind,
  sparkles: Sparkles,
  scissors: Scissors,
  tv: Tv,
  'more-horizontal': MoreHorizontal,
}

const categoryColors = [
  'bg-teal-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-slate-600',
]

const CATEGORY_OPTIONS = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'ac_appliances', label: 'AC & Appliances' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'cleaning_pest', label: 'Cleaning & Pest' },
  { value: 'other', label: 'Other' },
]

export default function HireHome() {
  const navigate = useNavigate()
  const [categories] = useState(DUMMY_CATEGORIES)
  const [requestCategory, setRequestCategory] = useState('plumbing')
  const [requestDesc, setRequestDesc] = useState('')
  const [requestDate, setRequestDate] = useState('')
  const [requestBudget, setRequestBudget] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const handleSubmitRequest = (e) => {
    e.preventDefault()
    addRequest({
      category: requestCategory,
      description: requestDesc,
      preferredDate: requestDate || null,
      budgetMin: requestBudget ? parseInt(requestBudget, 10) : null,
      createdByUserId: 'hire-user',
    })
    setRequestSent(true)
    setRequestDesc('')
    setRequestDate('')
    setRequestBudget('')
    setTimeout(() => navigate('/hiredashboard/bookings?tab=requests'), 500)
  }

  return (
    <>
      <section className="bg-teal-700 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Scale your home with <em className="italic text-teal-200">trusted professionals</em>
          </motion.h1>
          <motion.p
            className="text-teal-100 text-lg md:text-xl max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Book vetted experts for plumbing, electrical, appliances, cleaning, and more.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Service categories</h2>
        <p className="text-slate-500 mb-8">Choose a category to browse services</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {categories.map((cat, i) => {
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
                  <Card hover className="h-full">
                    <div className="p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]">
                      <span
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClass} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors text-sm">
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

      <section className="container mx-auto px-4 py-12 md:py-14 border-t border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Featured near you</h2>
        <p className="text-slate-500 mb-8">Popular services in your area</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURED_NEAR_YOU.map((item) => (
            <Link
              key={item.name}
              to={`/hiredashboard/services/${item.category}`}
              className="block"
            >
              <Card hover className="h-full">
                <div className="p-6 flex flex-col">
                  <span className="font-bold text-slate-900 text-lg block mb-1">{item.name}</span>
                  <p className="text-sm text-slate-500 mb-2">★ {item.rating} · {item.price}</p>
                  <span className="text-sm text-teal-600 font-medium">View services →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">How it works</h2>
        <p className="text-slate-500 mb-8">Book in three simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="overflow-hidden">
              <div className="p-6 flex flex-col">
                <span className="inline-flex w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold items-center justify-center mb-3">
                  {item.step}
                </span>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14 border-t border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Popular professionals</h2>
        <p className="text-slate-500 mb-8">Trusted experts by category</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_PROFESSIONALS.map(({ name, category, slug, rating }) => (
            <Link key={name} to={`/hiredashboard/services/${slug}`} className="block min-h-[120px]">
              <Card hover className="h-full min-h-[120px] flex">
                <div className="p-6 flex flex-col justify-center w-full">
                  <span className="font-bold text-slate-900 text-lg block mb-1">{name}</span>
                  <span className="text-sm text-slate-500 block mb-2">{category} · ★ {rating}</span>
                  <span className="text-sm text-teal-600 font-medium">View services →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Request custom work</h2>
        <p className="text-slate-500 mb-6">Describe the work you need. Professionals can apply and you choose who to assign.</p>
        {requestSent && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-medium">
            Request submitted. View it in My Bookings → Services requested.
          </div>
        )}
        <Card className="overflow-hidden max-w-2xl">
          <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={requestCategory}
                onChange={(e) => setRequestCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What do you need?</label>
              <textarea
                value={requestDesc}
                onChange={(e) => setRequestDesc(e.target.value)}
                placeholder="Describe the work..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred date</label>
                <Input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
                <Input type="number" placeholder="Optional" value={requestBudget} onChange={(e) => setRequestBudget(e.target.value)} min={0} className="w-full" />
              </div>
            </div>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" /> Submit request
            </Button>
          </form>
        </Card>
      </section>
    </>
  )
}
