const STORAGE_KEY = 'bridge_payments'

function getPayments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePayments(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function getPaymentsByBookingId(bookingId) {
  return getPayments().filter((p) => p.bookingId === bookingId)
}

export function addPayment({ bookingId, serviceName, location, amount, status = 'Paid' }) {
  const list = getPayments()
  const entry = {
    id: `pay-${Date.now()}`,
    bookingId,
    serviceName,
    location: location || '—',
    amount,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status,
    createdAt: new Date().toISOString(),
  }
  list.unshift(entry)
  savePayments(list)
  return entry
}

export function upsertPaymentByBookingId({ bookingId, serviceName, location, amount, status = 'Paid' }) {
  const list = getPayments()
  const idx = list.findIndex((p) => p.bookingId === bookingId)
  const now = new Date()
  const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (idx === -1) {
    const entry = {
      id: `pay-${Date.now()}`,
      bookingId,
      serviceName,
      location: location || '—',
      amount,
      date,
      status,
      createdAt: now.toISOString(),
    }
    list.unshift(entry)
    savePayments(list)
    return entry
  }

  const existing = list[idx]
  const updated = {
    ...existing,
    serviceName: serviceName || existing.serviceName,
    location: location || existing.location,
    amount: amount ?? existing.amount,
    status,
    date,
  }
  list[idx] = updated
  savePayments(list)
  return updated
}

export function getAllPayments() {
  return getPayments()
}

export function updatePaymentStatusByBookingId(bookingId, status) {
  const list = getPayments().map((p) => (p.bookingId === bookingId ? { ...p, status } : p))
  savePayments(list)
}
