import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'

const DUMMY_CONVOS = [
  { id: 1, name: 'Customer - AC Repair', preview: 'What time will you arrive?', time: '1h ago' },
  { id: 2, name: 'Support', preview: 'Your payout of ₹8,500 is scheduled.', time: '2d ago' },
]

export default function ProviderMessages() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Messages</h1>
      <p className="text-slate-500 mb-8">Chat with customers and view job-related notifications</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1 space-y-2">
          {DUMMY_CONVOS.map((c) => (
            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4 flex flex-col">
                <p className="font-semibold text-slate-900 text-sm leading-tight">{c.name}</p>
                <p className="text-slate-500 text-xs truncate mt-1.5">{c.preview}</p>
                <p className="text-slate-400 text-xs mt-1.5">{c.time}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="md:col-span-2 flex flex-col min-h-[320px] overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
            <MessageCircle className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium">Select a conversation</p>
            <p className="text-slate-500 text-sm mt-1">When you accept jobs, you can chat with customers here.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
