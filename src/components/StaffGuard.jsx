import { useLocation, Navigate } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'

const ROLE_KEY = 'bridge_staff_role'

/**
 * Protects admin/support routes when bridge_staff_role is set in localStorage.
 * - For /admin: allow if role is 'admin' or role not set (demo).
 * - For /support: allow if role is 'support' or role not set (demo).
 */
export function StaffGuard({ children }) {
  const location = useLocation()
  const toast = useToast()
  const role = typeof localStorage !== 'undefined' ? localStorage.getItem(ROLE_KEY) : null

  const path = location.pathname
  const isAdmin = path.startsWith('/admin')
  const isSupport = path.startsWith('/support')

  if (role != null && role !== '') {
    if (isAdmin && role !== 'admin') {
      toast.error('Access restricted to admin.')
      return <Navigate to="/" replace />
    }
    if (isSupport && role !== 'support') {
      toast.error('Access restricted to support.')
      return <Navigate to="/" replace />
    }
  }

  return children
}
