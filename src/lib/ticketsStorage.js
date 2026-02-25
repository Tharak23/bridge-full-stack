const STORAGE_KEY = 'bridge_support_tickets'

function getTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTickets(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function getAllTickets() {
  return getTickets()
}

export function getTicketsByStatus(status) {
  return getTickets().filter((t) => t.status === status)
}

export function createTicket({ subject, description, user, priority = 'medium' }) {
  const list = getTickets()
  const id = `T-${Date.now()}`
  const ticket = {
    id,
    subject,
    description: description || '',
    user: user || 'Unknown',
    priority,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  list.unshift(ticket)
  saveTickets(list)
  return ticket
}

export function updateTicketStatus(id, status) {
  const list = getTickets().map((t) =>
    t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
  )
  saveTickets(list)
  return list.find((t) => t.id === id)
}

export function getTicketById(id) {
  return getTickets().find((t) => t.id === id)
}
