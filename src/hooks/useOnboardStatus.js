import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { fetchApiJson } from '../lib/api'

export function useOnboardStatus() {
  const { getToken, isLoaded } = useAuth()
  const [status, setStatus] = useState({ loading: true, onboarded: false, role: null })

  useEffect(() => {
    if (!isLoaded) return
    let cancelled = false
    getToken()
      .then((token) => {
        if (!token || cancelled) return
        return fetchApiJson('/api/users/me', {}, getToken)
      })
      .then((data) => {
        if (cancelled || !data) return
        setStatus({
          loading: false,
          onboarded: !!data.onboarded,
          role: data.role || null,
        })
      })
      .catch(() => {
        if (!cancelled) setStatus({ loading: false, onboarded: false, role: null })
      })
    return () => { cancelled = true }
  }, [isLoaded, getToken])

  return status
}
