const HIRE_KEY = 'bridge_hire_profile'
const PROVIDER_KEY = 'bridge_provider_profile'

function getStored(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function getHireProfile() {
  return getStored(HIRE_KEY)
}

export function saveHireProfile(data) {
  return setStored(HIRE_KEY, { ...getStored(HIRE_KEY), ...data })
}

export function getProviderProfile() {
  return getStored(PROVIDER_KEY)
}

export function saveProviderProfile(data) {
  return setStored(PROVIDER_KEY, { ...getStored(PROVIDER_KEY), ...data })
}
