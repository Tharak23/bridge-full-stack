import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LocationContext = createContext(null)
const STORAGE_KEY = 'bridge_hire_location'

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    try {
      if (location) localStorage.setItem(STORAGE_KEY, location)
      else localStorage.removeItem(STORAGE_KEY)
    } catch (_) {}
  }, [location])

  const setLocation = useCallback((value) => {
    setLocationState(typeof value === 'function' ? value((prev) => prev) : value)
  }, [])

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('Location not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocationState('Current location'),
      () => setLocationState('')
    )
  }, [])

  return (
    <LocationContext.Provider value={{ location, setLocation, detectLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocationContext() {
  const ctx = useContext(LocationContext)
  if (!ctx) return { location: '', setLocation: () => {}, detectLocation: () => {} }
  return ctx
}
