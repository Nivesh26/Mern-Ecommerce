import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../api/auth'

/**
 * Protects user-only routes (profile, cart, etc.): must be logged in.
 * If not logged in, redirect to login.
 */
const RequireAuth = () => {
  const user = getUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default RequireAuth
