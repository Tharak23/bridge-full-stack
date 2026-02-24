import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getOpenRequests, addApplicant } from '@/lib/serviceRequestsStorage'
import { Briefcase, Calendar, IndianRupee } from 'lucide-react'

const PROVIDER_DUMMY = { id: 'pro-1', name: 'Ajay K.' }

function formatDate(d) {
  if (!d) return 'Any date'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AvailableJobs() {
  const requests = getOpenRequests()
  const [appliedIds, setAppliedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('bridge_provider_applied')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const handleApply = (requestId) => {
    addApplicant(requestId, {
      providerId: PROVIDER_DUMMY.id,
      providerName: PROVIDER_DUMMY.name,
      message: 'I can help with this. Experienced in this category.',
    })
    setAppliedIds((prev) => {
      const next = [...prev, requestId]
      localStorage.setItem('bridge_provider_applied', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Available jobs</h1>
      <p className="text-slate-500 mb-8">Custom requests from customers. Apply to get assigned.</p>

      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No open requests right now</p>
          <p className="text-slate-500 text-sm mt-1">When customers post custom work, it will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const applied = appliedIds.includes(req.id)
            return (
              <Card key={req.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{req.description || 'Custom request'}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                        <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">{req.category}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {formatDate(req.preferredDate)}
                        </span>
                        {req.budgetMin && (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" /> ₹{req.budgetMin}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={applied}
                      variant={applied ? 'secondary' : 'default'}
                      onClick={() => handleApply(req.id)}
                    >
                      {applied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
