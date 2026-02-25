import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, User } from 'lucide-react'

const INITIAL_MESSAGES = [
  { id: 1, from: 'support', text: 'Hi! How can we help you today?', time: '10:00' },
  { id: 2, from: 'user', text: 'I need to reschedule my AC service booking.', time: '10:02' },
  { id: 3, from: 'support', text: 'Sure. Please share your booking ID or registered phone number.', time: '10:03' },
]

export default function SupportChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: 'user', text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
    ])
    setInput('')
    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'support',
          text: "Thanks. We'll look into it and get back to you shortly.",
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 800)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Chat</h1>
      <p className="text-slate-500 mb-6">Live support chat (demo)</p>

      <Card className="border border-slate-200/80 overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Support</p>
              <p className="text-xs text-slate-500">Usually replies in a few minutes</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.from === 'user' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                <p className="text-sm">{m.text}</p>
                <p className={`text-xs mt-1 ${m.from === 'user' ? 'text-teal-100' : 'text-slate-500'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
          <Button onClick={send} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
