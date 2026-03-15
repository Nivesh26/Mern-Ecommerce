import { getAuthToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export type OrderItemPayload = {
  productId: string
  productName: string
  quantity: number
  price: number
}

export type CreateOrderPayload = {
  items: OrderItemPayload[]
  paymentMethod?: 'cod'
}

export type OrderItemFromAPI = {
  productName: string
  quantity: number
  price: number
}

export type OrderFromAPI = {
  _id: string
  id: string
  customerName: string
  customerEmail: string
  date: string
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered'
  items: OrderItemFromAPI[]
  total: number
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: OrderFromAPI; message: string }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to place order.')
  return data
}

export async function getOrders(): Promise<{ success: boolean; orders: OrderFromAPI[] }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load orders.')
  return data
}

export async function getMyOrders(): Promise<{ success: boolean; orders: OrderFromAPI[] }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load your orders.')
  return data
}

export async function updateOrderStatus(orderId: string, status: OrderFromAPI['status']): Promise<{ success: boolean; order: OrderFromAPI }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to update status.')
  return data
}
