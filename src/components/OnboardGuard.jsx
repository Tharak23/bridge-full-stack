import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboardStatus } from '../hooks/useOnboardStatus'

/**
 * Redirects to /onboard if user hasn't completed onboarding.
 * If desiredRole is 'hire', redirects service_provider to /dashboard.
 * If desiredRole is 'service_provider', redirects hire to /hiredashboard.
 */
export default function OnboardGuard({ children, desiredRole }) {
  const navigate = useNavigate()
  const { loading, onboarded, role } = useOnboardStatus()

  useEffect(() => {
    if (loading) return
    if (!onboarded) {
      navigate('/onboard', { replace: true })
      return
    }
    if (desiredRole === 'hire' && role === 'service_provider') {
      navigate('/dashboard', { replace: true })
      return
    }
    if (desiredRole === 'service_provider' && role === 'hire') {
      navigate('/hiredashboard', { replace: true })
      return
    }
  }, [loading, onboarded, role, desiredRole, navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        Loading…
      </div>
    )
  }
  if (!onboarded) return null
  if (desiredRole === 'hire' && role === 'service_provider') return null
  if (desiredRole === 'service_provider' && role === 'hire') return null

  return children
}
