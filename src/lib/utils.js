export function formatDate(d, options = {}) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

export function formatCurrency(amount) {
  if (amount == null) return '—'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export function getBookingStatusLabel(status) {
  const labels = {
    accepted: 'Confirmed',
    ongoing: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  return labels[String(status)] || String(status).replace(/_/g, ' ')
}
