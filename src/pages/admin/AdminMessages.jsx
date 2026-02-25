import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { MessageSquare, User } from 'lucide-react'

const DUMMY_MESSAGES = [
  { id: 1, from: 'Priya S.', subject: 'Booking #B-1024 — timing change', preview: 'Can we move the AC service to 3 PM instead?', time: '2h ago', unread: true },
  { id: 2, from: 'Rahul M.', subject: 'Payment query', preview: 'I was charged twice for the same booking. Can you check?', time: '5h ago', unread: true },
  { id: 3, from: 'Support bot', subject: 'New ticket #T-891', preview: 'Customer requested callback for plumbing emergency.', time: '1d ago', unread: false },
  { id: 4, from: 'Vikram K.', subject: 'Refund request', preview: 'Service was cancelled by provider. Need refund.', time: '2d ago', unread: false },
]

export default function AdminMessages() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Messages</h1>
      <p className="text-slate-500 mb-6">Support and user messages</p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-96 shrink-0 space-y-2">
          {DUMMY_MESSAGES.map((m) => (
            <Card
              key={m.id}
              className={`p-4 cursor-pointer transition-all border ${
                selected?.id === m.id ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
              onClick={() => setSelected(m)}
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 truncate">{m.from}</span>
                    {m.unread && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-600 truncate">{m.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{m.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="flex-1 min-h-[320px] border border-slate-200/80 p-6">
          {selected ? (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <h2 className="font-semibold text-slate-900">{selected.subject}</h2>
              </div>
              <p className="text-sm text-slate-600 mb-2">From: {selected.from}</p>
              <p className="text-slate-700">{selected.preview}</p>
              <p className="text-xs text-slate-500 mt-4">Time: {selected.time}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">Select a message to view</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
