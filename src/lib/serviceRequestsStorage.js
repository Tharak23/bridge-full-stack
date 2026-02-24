const STORAGE_KEY = 'bridge_service_requests'

function getRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRequests(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function addRequest(request) {
  const list = getRequests()
  const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const entry = {
    id,
    category: request.category || 'other',
    description: request.description || '',
    preferredDate: request.preferredDate || null,
    budgetMin: request.budgetMin ?? null,
    budgetMax: request.budgetMax ?? null,
    status: 'open',
    createdAt: new Date().toISOString(),
    createdByUserId: request.createdByUserId || null,
    applicants: [],
    assignedProviderId: null,
    assignedProviderName: null,
  }
  list.unshift(entry)
  saveRequests(list)
  return entry
}

export function getRequestById(id) {
  return getRequests().find((r) => r.id === id)
}

export function getOpenRequests() {
  return getRequests().filter((r) => r.status === 'open')
}

export function getRequestsByUser(userId) {
  return getRequests().filter((r) => r.createdByUserId === userId)
}

export function addApplicant(requestId, applicant) {
  const list = getRequests().map((r) => {
    if (r.id !== requestId) return r
    if (r.applicants.some((a) => a.providerId === applicant.providerId)) return r
    return { ...r, applicants: [...r.applicants, { ...applicant, appliedAt: new Date().toISOString() }] }
  })
  saveRequests(list)
  return list.find((r) => r.id === requestId)
}

export function assignProvider(requestId, providerId, providerName) {
  const list = getRequests().map((r) =>
    r.id === requestId ? { ...r, status: 'assigned', assignedProviderId: providerId, assignedProviderName: providerName } : r
  )
  saveRequests(list)
  return list.find((r) => r.id === requestId)
}

export { getRequests }
