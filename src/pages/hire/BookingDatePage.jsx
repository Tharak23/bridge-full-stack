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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-5 text-sm text-[var(--color-text-muted)]">
        <Link to="/hiredashboard" className="hover:text-[var(--color-primary)]">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/hiredashboard/services/${draft.category}`} className="hover:text-[var(--color-primary)]">Service</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-text)]">Book on a date</span>
      </nav>

      <h1 className="mb-2 text-3xl font-black text-[var(--color-text)] md:text-4xl">
        Book service on your preferred day
      </h1>
      <p className="mb-8 text-[var(--color-text-muted)]">
        {draft.serviceName} — Choose date and time slot. You won&apos;t be charged until the job is done.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Calendar - single date for service */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthOffset((o) => o - 1)}
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-muted)]"
            >
              ←
            </button>
            <span className="text-lg font-black text-[var(--color-text)]">
              {m1.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => setMonthOffset((o) => o + 1)}
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-muted)]"
            >
              →
            </button>
          </div>
          <div className="max-w-2xl rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-lg)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Service date</p>
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[var(--color-text-muted)]">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
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
                    className={`h-12 w-12 rounded-xl text-base font-semibold transition-colors ${
                      isPast
                        ? 'cursor-not-allowed text-slate-300'
                        : isSelected
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text)] hover:bg-[var(--color-primary-muted)]'
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
            className="mt-3 flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            <CalendarIcon className="h-4 w-4" /> Clear date
          </button>
        </div>

        {/* Right: Service booking card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-lg">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-black text-[var(--color-text)]">{draft.serviceName}</h2>
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[var(--color-text)]">₹{total}</span>
                <span className="text-sm text-[var(--color-text-muted)]">service amount</span>
              </div>
              <div className="space-y-3 mb-4">
                <div className="rounded-xl border border-[var(--color-border)] bg-[#fff8f8] p-3">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Service date</label>
                  <p className="font-medium text-[var(--color-text)]">{serviceDate ? serviceDate.toLocaleDateString() : 'Select date'}</p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[#fff8f8] p-3">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Time slot</label>
                  <select
                    value={timeSlot?.id}
                    onChange={(e) => setTimeSlot(TIME_SLOTS.find((s) => s.id === e.target.value) || TIME_SLOTS[0])}
                    className="w-full border-none bg-transparent p-0 font-medium text-[var(--color-text)] outline-none"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[#fff8f8] p-3">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Number of visits</label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--color-text)]">{visits} {visits === 1 ? 'visit' : 'visits'}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVisits((v) => Math.max(1, v - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-muted)]"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisits((v) => v + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-muted)]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className="h-12 w-full rounded-xl text-base font-semibold"
                onClick={handleBookService}
                disabled={!serviceDate}
              >
                Book service
              </Button>
              <p className="mt-3 text-center text-sm text-[var(--color-text-muted)]">You won&apos;t be charged yet</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
