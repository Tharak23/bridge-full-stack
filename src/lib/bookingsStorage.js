const STORAGE_KEY = 'bridge_my_bookings'

function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveBookings(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function addBooking(booking) {
  const list = getBookings()
  const next = [{ ...booking, id: booking.id || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` }, ...list]
  saveBookings(next)
  return next[0]
}

export function getBookingById(id) {
  return getBookings().find((b) => b.id === id)
}

export function updateBookingStatus(id, status) {
  const list = getBookings().map((b) => (b.id === id ? { ...b, status } : b))
  saveBookings(list)
  return list.find((b) => b.id === id)
}

export function updateBooking(id, updates) {
  const list = getBookings().map((b) => (b.id === id ? { ...b, ...updates } : b))
  saveBookings(list)
  return list.find((b) => b.id === id)
}

export { getBookings }
