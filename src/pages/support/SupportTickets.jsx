import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Ticket, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const DUMMY_TICKETS = [
  { id: 'T-891', subject: 'Double charge on booking', status: 'open', priority: 'high', created: '2h ago', user: 'Rahul M.' },
  { id: 'T-890', subject: 'Provider no-show — need refund', status: 'in_progress', priority: 'high', created: '5h ago', user: 'Priya S.' },
  { id: 'T-889', subject: 'Change booking date', status: 'resolved', priority: 'medium', created: '1d ago', user: 'Vikram K.' },
  { id: 'T-888', subject: 'App login issue', status: 'resolved', priority: 'low', created: '2d ago', user: 'Anita R.' },
]

const statusIcon = { open: AlertCircle, in_progress: Clock, resolved: CheckCircle }
const statusColor = { open: 'text-amber-600 bg-amber-50', in_progress: 'text-blue-600 bg-blue-50', resolved: 'text-emerald-600 bg-emerald-50' }

export default function SupportTickets() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? DUMMY_TICKETS : DUMMY_TICKETS.filter((t) => t.status === filter)

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Tickets</h1>
      <p className="text-slate-500 mb-6">Problems and requests raised by users</p>

      <div className="flex gap-2 mb-6">
        {['all', 'open', 'in_progress', 'resolved'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === f ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => {
          const Icon = statusIcon[t.status] || Ticket
          const colorClass = statusColor[t.status] || 'text-slate-600 bg-slate-50'
          return (
            <Card key={t.id} className="p-4 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-4">
                <span className={`inline-flex p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-slate-500">{t.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${colorClass}`}>{t.status.replace('_', ' ')}</span>
                    {t.priority === 'high' && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">High</span>
                    )}
                  </div>
                  <h2 className="font-semibold text-slate-900 mt-1">{t.subject}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{t.user} · {t.created}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
