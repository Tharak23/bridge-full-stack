/**
 * Backend API client for Bridge.
 * Uses VITE_API_URL; sends Clerk JWT for authenticated routes.
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

export function getApiUrl(path = '') {
  const base = BASE_URL.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Fetch from the backend. For routes that require auth, pass getToken (e.g. from useAuth().getToken).
 * @param {string} path - Path (e.g. '/' or '/api/...')
 * @param {RequestInit} [options] - fetch options
 * @param {() => Promise<string|null>} [getToken] - Optional. Call to get Clerk JWT for Authorization header.
 */
export async function fetchApi(path, options = {}, getToken) {
  const url = getApiUrl(path)
  const headers = new Headers(options.headers)

  if (getToken && typeof getToken === 'function') {
    const token = await getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })
  return res
}

/**
 * Fetch JSON from the backend. Same as fetchApi but returns parsed JSON; throws on non-ok.
 */
export async function fetchApiJson(path, options = {}, getToken) {
  const res = await fetchApi(path, options, getToken)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
