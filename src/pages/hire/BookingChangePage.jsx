import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBookingById, updateBooking } from '@/lib/bookingsStorage'
import { Calendar as CalendarIcon } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const TIME_SLOTS = [
  { id: 'morning', label: '9:00 AM – 12:00 PM' },
  { id: 'afternoon', label: '12:00 PM – 4:00 PM' },
  { id: 'evening', label: '4:00 PM – 8:00 PM' },
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

export default function BookingChangePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const booking = id ? getBookingById(id) : null
  const [serviceDate, setServiceDate] = useState(null)
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    if (booking?.serviceDate) setServiceDate(new Date(booking.serviceDate))
    if (booking?.timeSlotLabel) {
      const found = TIME_SLOTS.find((s) => s.label === booking.timeSlotLabel)
      if (found) setTimeSlot(found)
    }
  }, [booking])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const m1 = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const grid1 = buildMonth(m1.getFullYear(), m1.getMonth())

  const handleDayClick = (year, month, day) => {
    if (!day) return
    const d = new Date(year, month, day)
    if (d < today) return
    setServiceDate(d)
  }

  const handleSave = () => {
    if (!booking || !serviceDate) return
    updateBooking(booking.id, {
      serviceDate: serviceDate.toISOString(),
      timeSlot: timeSlot.id,
      timeSlotLabel: timeSlot.label,
    })
    navigate(`/hiredashboard/bookings/${booking.id}`)
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-slate-500 mb-4">Booking not found.</p>
        <Button as={Link} to="/hiredashboard/bookings">My Bookings</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/hiredashboard" className="hover:text-teal-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/hiredashboard/bookings" className="hover:text-teal-600">My Bookings</Link>
        <span className="mx-2">/</span>
        <Link to={`/hiredashboard/bookings/${id}`} className="hover:text-teal-600">{booking.serviceName}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Change date & time</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Change booking</h1>
      <p className="text-slate-500 mb-8">Choose a new date and time slot for {booking.serviceName}.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => setMonthOffset((o) => o - 1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">←</button>
            <span className="font-semibold text-slate-900">{m1.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button type="button" onClick={() => setMonthOffset((o) => o + 1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">→</button>
          </div>
          <Card className="p-4">
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
                      isPast ? 'text-slate-300 cursor-not-allowed' : isSelected ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </Card>
          <button type="button" onClick={() => setServiceDate(null)} className="mt-2 text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" /> Clear date
          </button>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Time slot</h2>
            <div className="space-y-2">
              {TIME_SLOTS.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    timeSlot.id === s.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input type="radio" name="slot" value={s.id} checked={timeSlot.id === s.id} onChange={() => setTimeSlot(s)} className="sr-only" />
                  <span className="text-slate-900 font-medium">{s.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Selected: {serviceDate ? serviceDate.toLocaleDateString() : 'No date'} · {timeSlot.label}</p>
            <Button className="w-full mt-6" onClick={handleSave} disabled={!serviceDate}>
              Save new date & time
            </Button>
            <Button variant="ghost" className="w-full mt-2" as={Link} to={`/hiredashboard/bookings/${id}`}>
              Cancel
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
