const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export type ProductItem = {
  _id: string
  name: string
  description: string
  price: number
  category: string
  imageUrls: string[]
  createdAt?: string
}

/** Full URL for a product image path (e.g. /uploads/products/xxx.jpg) */
export function productImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return ''
  if (pathOrUrl.startsWith('http')) return pathOrUrl
  return `${API_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export async function getProducts(): Promise<{ success: boolean; products: ProductItem[] }> {
  const res = await fetch(`${API_URL}/api/products`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load products.')
  return data
}

export async function getProduct(id: string): Promise<{ success: boolean; product: ProductItem }> {
  const res = await fetch(`${API_URL}/api/products/${id}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load product.')
  return data
}

function getAuthToken(): string | null {
  return sessionStorage.getItem('token')
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; product: ProductItem }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result?.message || 'Failed to create product.')
  return result
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; product: ProductItem }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result?.message || 'Failed to update product.')
  return result
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const token = getAuthToken()
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to delete product.')
  return data
}
