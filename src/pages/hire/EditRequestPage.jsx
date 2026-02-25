import { useParams, useNavigate, Link } from 'react-router-dom'
import { getRequestById, updateRequest } from '@/lib/serviceRequestsStorage'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

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

export default function EditRequestPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const request = getRequestById(id)

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Card className="p-8 text-center">
          <p className="text-slate-600 mb-4">Request not found.</p>
          <Link to="/hiredashboard/bookings?tab=requests">
            <Button variant="outline">Back to requests</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    updateRequest(id, {
      category: form.category.value,
      description: form.description.value.trim(),
      preferredDate: form.preferredDate.value || null,
      budgetMin: form.budget.value ? parseInt(form.budget.value, 10) : null,
    })
    navigate('/hiredashboard/bookings?tab=requests')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link
        to="/hiredashboard/bookings?tab=requests"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to requests
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit service request</h1>
      <p className="text-slate-500 mb-6">Update the details below. Only open requests can be edited.</p>
      <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              name="category"
              defaultValue={request.category}
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
              defaultValue={request.description}
              placeholder="Describe the work..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred date</label>
              <Input
                type="date"
                name="preferredDate"
                defaultValue={request.preferredDate ? request.preferredDate.slice(0, 10) : ''}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Budget (₹)</label>
              <Input
                type="number"
                name="budget"
                placeholder="Optional"
                defaultValue={request.budgetMin ?? ''}
                min={0}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">Save changes</Button>
            <Link to="/hiredashboard/bookings?tab=requests">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
