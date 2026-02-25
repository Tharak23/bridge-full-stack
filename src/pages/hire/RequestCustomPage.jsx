import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft } from 'lucide-react'
import { addRequest } from '@/lib/serviceRequestsStorage'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    addRequest({
      category: form.category.value,
      description: form.description.value.trim(),
      preferredDate: form.preferredDate.value || null,
      budgetMin: form.budget.value ? parseInt(form.budget.value, 10) : null,
      createdByUserId: 'hire-user',
    })
    toast.success('Request submitted.')
    navigate('/hiredashboard/bookings?tab=requests')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link
        to="/hiredashboard/bookings?tab=requests"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Services requested
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Request custom work</h1>
      <p className="text-slate-500 mb-6">Describe the work you need. Professionals can apply and you choose who to assign.</p>
      <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              name="category"
              defaultValue="plumbing"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">What do you need?</label>
            <textarea
              name="description"
              placeholder="Describe the work..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred date</label>
              <Input type="date" name="preferredDate" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget (₹)</label>
              <Input type="number" name="budget" placeholder="Optional" min={0} className="w-full" />
            </div>
          </div>
          <div className="pt-1">
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" /> Submit request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
