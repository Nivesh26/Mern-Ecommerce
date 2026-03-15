import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export type NotificationFromAPI = {
  _id: string
  orderId: string
  orderDisplayId: string
  message: string
  read: boolean
  createdAt: string
}

export async function getNotifications(): Promise<{
  success: boolean
  notifications: NotificationFromAPI[]
  unreadCount: number
}> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load notifications.')
  return data
}

export async function markNotificationRead(id: string): Promise<{ success: boolean }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to update.')
  return data
}
