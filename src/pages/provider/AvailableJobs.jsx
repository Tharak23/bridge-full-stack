import { useState, useEffect, useCallback } from 'react'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/context/ToastContext'
import { Briefcase, Calendar, IndianRupee, MapPin, User } from 'lucide-react'
import PageLoader from '@/components/PageLoader'

function formatDate(d) {
  if (!d) return 'Any date'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return 'Any date'
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AvailableJobs() {
  const toast = useToast()
  const { getToken } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [messageByReq, setMessageByReq] = useState({})
  const [applyingId, setApplyingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchApiJson('/api/custom-requests/feed', {}, getToken)
      setRequests(Array.isArray(data) ? data : [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    load()
  }, [load])

  const handleApply = async (requestId) => {
    setApplyingId(requestId)
    const message = messageByReq[requestId]?.trim() || null
    try {
      await fetchApiJson(
        `/api/custom-requests/${requestId}/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        },
        getToken
      )
      toast.success('Application sent.')
      setMessageByReq((prev) => ({ ...prev, [requestId]: '' }))
      load()
    } catch (e) {
      toast.error(e.data?.error || e.message || 'Could not apply')
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Available jobs</h1>
      <p className="text-slate-500 mb-8">Custom requests from customers. Apply to get assigned when they accept you.</p>

      {loading ? (
        <PageLoader message="Loading requests…" />
      ) : requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No open requests right now</p>
          <p className="text-slate-500 text-sm mt-1">When customers post custom work, it will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{req.description || 'Custom request'}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                      <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">{(req.category || '').replace(/_/g, ' ')}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {formatDate(req.preferredDate)}
                      </span>
                      {req.budgetMin != null && (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" /> ₹{req.budgetMin}
                        </span>
                      )}
                      {req.hireCity && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {req.hireCity}
                        </span>
                      )}
                      {req.hireName && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" /> {req.hireName}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={!!applyingId}
                    onClick={() => handleApply(req.id)}
                  >
                    {applyingId === req.id ? 'Applying…' : 'Apply'}
                  </Button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Message to customer (optional)</label>
                  <Input
                    placeholder="e.g. I can do this tomorrow. 5+ years experience."
                    value={messageByReq[req.id] || ''}
                    onChange={(e) => setMessageByReq((prev) => ({ ...prev, [req.id]: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
