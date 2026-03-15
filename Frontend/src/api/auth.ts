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

export function setAuthToken(token: string) {
  localStorage.setItem('token', token)
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

export function setUser(user: { id: string; fullName: string; email: string; phoneNumber: string; role: string }) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUser() {
  const u = localStorage.getItem('user')
  return u ? JSON.parse(u) : null
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
