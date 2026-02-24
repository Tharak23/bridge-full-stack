import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send } from 'lucide-react'

const DUMMY_CONVOS = [
  { id: 'ajay', name: 'Ajay K.', preview: 'I will reach by 10 AM tomorrow.', time: '2h ago', service: 'Electrical' },
  { id: 'ravi', name: 'Ravi K.', preview: 'AC repair done. Thanks!', time: '1d ago', service: 'AC Repair' },
  { id: 'support', name: 'Support', preview: 'Your booking #BK-1024 is confirmed.', time: '2d ago', service: null },
]

export default function MessagesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const openFromState = location.state?.openConversation
  const [selectedId, setSelectedId] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState({})

  useEffect(() => {
    if (openFromState?.id) {
      setSelectedId(openFromState.id)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [openFromState?.id, navigate, location.pathname])

  const selected = DUMMY_CONVOS.find((c) => c.id === selectedId) || (openFromState ? { id: openFromState.id, name: openFromState.name, preview: '', time: 'Now', service: null } : null)
  const activeId = selected?.id ?? selectedId
  const threadMessages = activeId ? (messages[activeId] || []) : []

  const handleSend = () => {
    const text = messageInput.trim()
    if (!text || !activeId) return
    setMessages((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        { id: Date.now(), text, fromMe: true, time: 'Just now' },
      ],
    }))
    setMessageInput('')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Messages</h1>
      <p className="text-slate-500 mb-6">Chat with your service providers</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1 space-y-2">
          {DUMMY_CONVOS.map((c) => (
            <Card
              key={c.id}
              className={`cursor-pointer transition-all overflow-hidden ${selectedId === c.id ? 'ring-2 ring-teal-500 border-teal-200' : 'hover:shadow-md'}`}
              onClick={() => setSelectedId(c.id)}
            >
              <div className="p-4 flex flex-col">
                <p className="font-semibold text-slate-900 text-sm leading-tight">{c.name}</p>
                {c.service && <p className="text-xs text-slate-500 mt-0.5">{c.service}</p>}
                <p className="text-slate-500 text-xs truncate mt-1.5">{c.preview}</p>
                <p className="text-slate-400 text-xs mt-1.5">{c.time}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card className="md:col-span-2 flex flex-col min-h-[380px] overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-semibold flex items-center justify-center">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selected.name}</p>
                  {selected.service && <p className="text-xs text-slate-500">{selected.service}</p>}
                </div>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {threadMessages.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-4">No messages yet. Say hello!</p>
                )}
                {threadMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                        m.fromMe ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className={`text-xs mt-1 ${m.fromMe ? 'text-teal-100' : 'text-slate-500'}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="flex-1 rounded-lg"
                />
                <Button size="icon" className="rounded-lg shrink-0" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
              <MessageCircle className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">Select a conversation</p>
              <p className="text-slate-500 text-sm mt-1">When you book a service or click &quot;Message&quot; on a provider, you can chat here.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
