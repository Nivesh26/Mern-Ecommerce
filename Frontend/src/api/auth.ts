const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: { id: string; fullName: string; email: string; phoneNumber: string; role: string }
}

export interface SignupResponse {
  success: boolean
  message: string
  token?: string
  user?: { id: string; fullName: string; email: string; phoneNumber: string; role: string }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // 401 = invalid credentials, 4xx/5xx = other error
    const message = data?.message || (res.status === 401 ? 'Invalid email or password.' : 'Login failed.')
    throw new Error(message)
  }
  return data
}

export async function signup(fullName: string, email: string, phoneNumber: string, password: string): Promise<SignupResponse> {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phoneNumber, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Signup failed.')
  return data
}

// Session storage: login lasts only until tab/browser is closed (no persistence across tabs)
const AUTH_TOKEN_KEY = 'token'
const AUTH_USER_KEY = 'user'

// Clear any legacy auth from localStorage so session is tab-only
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function setAuthToken(token: string) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setUser(user: { id: string; fullName: string; email: string; phoneNumber: string; role: string }) {
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function getUser() {
  const u = sessionStorage.getItem(AUTH_USER_KEY)
  return u ? JSON.parse(u) : null
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/auth/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to delete account.')
  return data
}

export type CustomerItem = {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  address?: string
  role: string
  createdAt?: string
}

export async function getCustomers(): Promise<{ success: boolean; customers: CustomerItem[] }> {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/auth/customers`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to load customers.')
  return data
}

export async function deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw new Error('Not logged in.')
  const res = await fetch(`${API_URL}/api/auth/customers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to delete customer.')
  return data
}
