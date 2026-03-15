import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getStoreStatus(): Promise<{ success: boolean; storeOpen: boolean }> {
  const res = await fetch(`${API_URL}/api/store/status`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to get store status.')
  return data
}

export async function updateStoreStatus(storeOpen: boolean): Promise<{ success: boolean; storeOpen: boolean; message: string }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/store/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ storeOpen }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to update store status.')
  return data
}
