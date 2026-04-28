import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useToast } from '@/context/ToastContext'
import { fetchApiJson } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft } from 'lucide-react'

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

export default function RequestCustomPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { getToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const preferredDate = form.preferredDate.value || null
    const body = {
      category: form.category.value,
      description: form.description.value.trim(),
      preferredDate: preferredDate || null,
      budgetMin: form.budget.value ? parseInt(form.budget.value, 10) : null,
      locationText: null,
    }
    try {
      await fetchApiJson(
        '/api/custom-requests',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        getToken
      )
      toast.success('Request submitted.')
      navigate('/hiredashboard/bookings?tab=requests')
    } catch (err) {
      toast.error(err.data?.error || err.message || 'Could not submit request')
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link
        to="/hiredashboard/bookings?tab=requests"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Services requested
      </Link>
      <h1 className="mb-2 text-3xl font-black text-[var(--color-text)]">Request custom work</h1>
      <p className="mb-6 text-[var(--color-text-muted)]">Describe the work you need. Professionals can apply and you choose who to assign.</p>
      <Card className="overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Category</label>
            <select
              name="category"
              defaultValue="plumbing"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[#fff8f8] px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">What do you need?</label>
            <textarea
              name="description"
              placeholder="Describe the work..."
              rows={3}
              className="w-full resize-none rounded-[1.5rem] border border-[var(--color-border)] bg-[#fff8f8] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Preferred date</label>
              <Input type="date" name="preferredDate" className="w-full bg-[#fff8f8]" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Budget (₹)</label>
              <Input type="number" name="budget" placeholder="Optional" min={0} className="w-full bg-[#fff8f8]" />
            </div>
          </div>
          <div className="pt-1">
            <Button type="submit" className="gap-2 rounded-full px-6">
              <Send className="h-4 w-4" /> Submit request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
