import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MessageCircle, Star, User, Send } from 'lucide-react'

const DUMMY_PROFESSIONALS = [
  { id: 'ajay', name: 'Ajay K.', category: 'Electrical', timesBooked: 3, rating: 4.9, lastService: 'Fan & light repair', imagePlaceholder: true },
  { id: 'ravi', name: 'Ravi K.', category: 'AC Repair', timesBooked: 2, rating: 4.8, lastService: 'AC service', imagePlaceholder: true },
  { id: 'priya', name: 'Priya M.', category: 'AC & Appliances', timesBooked: 1, rating: 4.79, lastService: 'AC installation', imagePlaceholder: true },
  { id: 'vikram', name: 'Vikram S.', category: 'Electronics', timesBooked: 2, rating: 4.82, lastService: 'TV repair', imagePlaceholder: true },
]

export default function ProfessionalsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const openFromState = location.state?.openProfile || (location.state?.openConversation && { id: location.state.openConversation.id, name: location.state.openConversation.name })
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [threadMessages, setThreadMessages] = useState({})
  const [feedbackRatings, setFeedbackRatings] = useState({})
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({})

  useEffect(() => {
    if (openFromState?.id) {
      setSelectedId(openFromState.id)
      navigate('/hiredashboard/professionals', { replace: true, state: {} })
    }
  }, [openFromState?.id, navigate])

  const filtered = DUMMY_PROFESSIONALS.filter(
    (p) => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  )
  const selected = DUMMY_PROFESSIONALS.find((p) => p.id === selectedId)
  const messages = selectedId ? (threadMessages[selectedId] || []) : []

  const handleSend = () => {
    const text = messageInput.trim()
    if (!text || !selectedId) return
    setThreadMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { id: Date.now(), text, fromMe: true, time: 'Just now' }],
    }))
    setMessageInput('')
  }

  const handleFeedbackClick = (professionalId, stars) => {
    setFeedbackRatings((prev) => ({ ...prev, [professionalId]: stars }))
  }

  const handleSubmitFeedback = () => {
    if (!selectedId || feedbackRatings[selectedId] == null) return
    setFeedbackSubmitted((prev) => ({ ...prev, [selectedId]: feedbackRatings[selectedId] }))
  }

  const selectedRating = selectedId ? (feedbackSubmitted[selectedId] ?? feedbackRatings[selectedId]) : null

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Professionals</h1>
      <p className="text-slate-500 mb-6">Previous professionals you&apos;ve worked with. View profile and chat.</p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 shrink-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((p) => (
              <Card
                key={p.id}
                className={`p-4 cursor-pointer transition-all border ${
                  selectedId === p.id ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.category}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Booked {p.timesBooked} time{p.timesBooked !== 1 ? 's' : ''} · ★ {p.rating}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {selected ? (
            <>
              <Card className="border border-slate-200/80 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-teal-600" />
                    Profile
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    <div className="h-20 w-20 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-bold">
                      {selected.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xl">{selected.name}</p>
                      <p className="text-slate-600">{selected.category}</p>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {selected.rating} rating
                      </p>
                      <p className="text-sm text-slate-500">Booked with you {selected.timesBooked} time{selected.timesBooked !== 1 ? 's' : ''}</p>
                      {selected.lastService && (
                        <p className="text-sm text-slate-500 mt-0.5">Last: {selected.lastService}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Give feedback</h3>
                  <p className="text-sm text-slate-500 mb-3">How was your experience with {selected.name}?</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const isSelected = (selectedRating ?? 0) >= n
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleFeedbackClick(selected.id, n)}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50 text-amber-600'
                              : 'border-slate-200 bg-white text-slate-400 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'
                          }`}
                        >
                          <Star className={`h-5 w-5 ${isSelected ? 'fill-amber-400' : ''}`} />
                        </button>
                      )
                    })}
                  </div>
                  {selectedRating != null && (
                    <p className="text-sm text-slate-600 mt-2">
                      {feedbackSubmitted[selected.id] != null
                        ? `Thanks! You rated ${feedbackSubmitted[selected.id]} star${feedbackSubmitted[selected.id] !== 1 ? 's' : ''}.`
                        : `${selectedRating} star${selectedRating !== 1 ? 's' : ''} selected.`}
                    </p>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    className="mt-3"
                    onClick={handleSubmitFeedback}
                    disabled={selectedRating == null || feedbackSubmitted[selected.id] != null}
                  >
                    {feedbackSubmitted[selected.id] != null ? 'Submitted' : 'Submit feedback'}
                  </Button>
                </div>
              </Card>

              <Card className="border border-slate-200/80 flex flex-col flex-1 min-h-[320px] overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
                  <MessageCircle className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-slate-900">Chat with {selected.name}</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[200px]">
                  {messages.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-6">No messages yet. Say hello!</p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
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
                  <Button size="icon" className="shrink-0 rounded-lg" onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="border border-slate-200/80 flex-1 flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
              <User className="h-16 w-16 text-slate-300 mb-4" />
              <p className="font-medium text-slate-600">Select a professional</p>
              <p className="text-slate-500 text-sm mt-1">Choose from the list to view their profile and chat.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
