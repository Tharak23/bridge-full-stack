import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Ticket, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react'
import {
  getAllTickets,
  createTicket,
  updateTicketStatus,
} from '@/lib/ticketsStorage'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/utils'

const statusIcon = { open: AlertCircle, in_progress: Clock, resolved: CheckCircle }
const statusColor = { open: 'text-amber-600 bg-amber-50', in_progress: 'text-blue-600 bg-blue-50', resolved: 'text-emerald-600 bg-emerald-50' }

function timeAgo(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 60000)
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

export default function SupportTickets() {
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [ticketsKey, setTicketsKey] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newUser, setNewUser] = useState('')
  const [newPriority, setNewPriority] = useState('medium')

  const tickets = useMemo(() => getAllTickets(), [ticketsKey])
  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newSubject.trim()) {
      toast.error('Subject is required.')
      return
    }
    createTicket({
      subject: newSubject.trim(),
      description: newDescription.trim(),
      user: newUser.trim() || 'Customer',
      priority: newPriority,
    })
    setTicketsKey((k) => k + 1)
    setNewSubject('')
    setNewDescription('')
    setNewUser('')
    setShowForm(false)
    toast.success('Ticket created.')
  }

  const handleStatus = (id, status) => {
    updateTicketStatus(id, status)
    setTicketsKey((k) => k + 1)
    toast.success(status === 'resolved' ? 'Ticket resolved.' : 'Ticket reopened.')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Tickets</h1>
          <p className="text-slate-500">Problems and requests raised by users</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> New ticket
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-5 border border-slate-200/80">
          <h2 className="font-semibold text-slate-900 mb-3">Create ticket</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Double charge on booking"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Details..."
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
                <Input value={newUser} onChange={(e) => setNewUser(e.target.value)} placeholder="Customer name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create ticket</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

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

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Ticket className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No tickets</p>
          <p className="text-slate-500 text-sm mt-1">Create a ticket above or they will appear when users raise issues.</p>
        </Card>
      ) : (
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
                    {t.description && <p className="text-sm text-slate-600 mt-1">{t.description}</p>}
                    <p className="text-sm text-slate-500 mt-1">{t.user} · {timeAgo(t.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.status !== 'resolved' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatus(t.id, 'resolved')}>
                        Resolve
                      </Button>
                    )}
                    {t.status === 'resolved' && (
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(t.id, 'open')}>
                        Reopen
                      </Button>
                    )}
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
