import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const TIME_SLOTS = [
  { id: 'morning', label: '9:00 AM – 12:00 PM', slot: 'Morning' },
  { id: 'afternoon', label: '12:00 PM – 4:00 PM', slot: 'Afternoon' },
  { id: 'evening', label: '4:00 PM – 8:00 PM', slot: 'Evening' },
]

function buildMonth(year, month) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const last = new Date(year, month + 1, 0)
  const daysInMonth = last.getDate()
  const arr = []
  for (let i = 0; i < startPad; i++) arr.push(null)
  for (let d = 1; d <= daysInMonth; d++) arr.push(d)
  return arr
}

export default function BookingDatePage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(null)
  const [serviceDate, setServiceDate] = useState(null)
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [visits, setVisits] = useState(1)
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bridge_booking_draft')
      if (raw) setDraft(JSON.parse(raw))
    } catch (_) {}
  }, [])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const m1 = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const grid1 = buildMonth(m1.getFullYear(), m1.getMonth())

  const pricePer = draft?.tier?.price ?? 30
  const total = pricePer * visits

  const handleDayClick = (year, month, day) => {
    if (!day) return
    const d = new Date(year, month, day)
    if (d < today) return
    setServiceDate(d)
  }

  const handleBookService = () => {
    sessionStorage.setItem(
      'bridge_booking_draft',
      JSON.stringify({
        ...draft,
        serviceDate: serviceDate?.toISOString?.(),
        timeSlot: timeSlot?.id,
        timeSlotLabel: timeSlot?.label,
        visits,
        total,
      })
    )
    navigate('/hiredashboard/booking/confirm')
  }

  if (!draft) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-slate-500 mb-4">No booking in progress. Choose a service first.</p>
        <Button as={Link} to="/hiredashboard">Browse services</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/hiredashboard" className="hover:text-teal-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/hiredashboard/services/${draft.category}`} className="hover:text-teal-600">Service</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Book on a date</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Book service on your preferred day
      </h1>
      <p className="text-slate-500 mb-8">
        {draft.serviceName} — Choose date and time slot. You won&apos;t be charged until the job is done.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Calendar - single date for service */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setMonthOffset((o) => o - 1)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              ←
            </button>
            <span className="font-semibold text-slate-900">
              {m1.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => setMonthOffset((o) => o + 1)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              →
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm max-w-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">Service date</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {grid1.map((day, i) => {
                if (day === null) return <span key={`e-${i}`} />
                const d = new Date(m1.getFullYear(), m1.getMonth(), day)
                const isPast = d < today
                const isSelected = serviceDate && d.getTime() === serviceDate.getTime()
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDayClick(m1.getFullYear(), m1.getMonth(), day)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      isPast
                        ? 'text-slate-300 cursor-not-allowed'
                        : isSelected
                          ? 'bg-teal-600 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setServiceDate(null)}
            className="mt-3 text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4" /> Clear date
          </button>
        </div>

        {/* Right: Service booking card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 overflow-hidden shadow-lg rounded-2xl border border-slate-200">
            <div className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">{draft.serviceName}</h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-slate-900">₹{total}</span>
                <span className="text-slate-500 text-sm">service amount</span>
              </div>
              <div className="space-y-3 mb-4">
                <div className="rounded-xl border border-slate-200 p-3">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Service date</label>
                  <p className="text-slate-900 font-medium">{serviceDate ? serviceDate.toLocaleDateString() : 'Select date'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Time slot</label>
                  <select
                    value={timeSlot?.id}
                    onChange={(e) => setTimeSlot(TIME_SLOTS.find((s) => s.id === e.target.value) || TIME_SLOTS[0])}
                    className="w-full bg-transparent text-slate-900 font-medium outline-none border-none p-0"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Number of visits</label>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-medium">{visits} {visits === 1 ? 'visit' : 'visits'}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVisits((v) => Math.max(1, v - 1))}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisits((v) => v + 1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className="w-full rounded-xl h-12 text-base font-semibold"
                onClick={handleBookService}
                disabled={!serviceDate}
              >
                Book service
              </Button>
              <p className="text-center text-sm text-slate-500 mt-3">You won&apos;t be charged yet</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
