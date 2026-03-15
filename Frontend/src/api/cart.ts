import { getAuthToken } from './auth'
import { productImageUrl } from './products'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export type CartItemFromAPI = {
  productId: string
  product: {
    _id: string
    name: string
    price: number
    imageUrls?: string[]
    category?: string
    description?: string
  } | null
  quantity: number
}

export type CartItemForAPI = { productId: string; quantity: number }

export async function getCart(): Promise<{ success: boolean; cart: CartItemFromAPI[] }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load cart.')
  return data
}

export async function saveCart(items: CartItemForAPI[]): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/cart`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to save cart.')
  return data
}

/** Map API cart entries to CartItem shape (id, name, price, image, quantity) */
export function mapCartToItems(cart: CartItemFromAPI[]): { id: string; name: string; price: number; image: string; quantity: number }[] {
  return cart
    .filter((entry) => entry.product)
    .map((entry) => ({
      id: `product-${entry.product!._id}`,
      name: entry.product!.name,
      price: entry.product!.price,
      image: (entry.product!.imageUrls || [])[0] ? productImageUrl((entry.product!.imageUrls || [])[0]) : '',
      quantity: entry.quantity,
    }))
}
