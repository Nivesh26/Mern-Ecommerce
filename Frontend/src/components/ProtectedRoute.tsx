import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../api/auth'

/**
 * Protected route for admin: only users with role 'admin' can access.
 * Others are redirected to home.
 */
const ProtectedRoute = () => {
  const user = getUser()
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
