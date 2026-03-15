import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { getAuthToken } from '../api/auth'
import { getCart, saveCart, mapCartToItems } from '../api/cart'

export type CartProduct = {
  id?: number | string
  name: string
  price: number
  image: string | { default?: string }
  category?: string
  description?: string
  stock?: number
}

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock?: number
}

const CART_STORAGE_KEY = 'nivesh-cart'

function getImageUrl(image: string | { default?: string }): string {
  if (typeof image === 'string') return image
  return (image?.default as string) ?? ''
}

function getCartItemId(product: CartProduct): string {
  if (product.id != null) return `product-${product.id}`
  return `product-${product.name.replace(/\s+/g, '-').slice(0, 40)}`
}

/** Convert context items to API payload */
function itemsToPayload(items: CartItem[]): { productId: string; quantity: number }[] {
  return items.map((i) => ({
    productId: i.id.replace(/^product-/, ''),
    quantity: i.quantity,
  }))
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  itemCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      if (raw) return JSON.parse(raw) as CartItem[]
    } catch (_) {}
    return []
  })
  const isMounted = useRef(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshCart = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return
    try {
      const { cart } = await getCart()
      setItems(mapCartToItems(cart || []))
    } catch (_) {
      // keep current local cart on error
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    const token = getAuthToken()
    if (token) {
      getCart()
        .then((data) => {
          if (isMounted.current) setItems(mapCartToItems(data.cart || []))
        })
        .catch(() => {})
    }
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (_) {}
  }, [items])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null
      saveCart(itemsToPayload(items)).catch(() => {})
    }, 500)
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [items])

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    const stock = product.stock ?? undefined
    if (stock !== undefined && stock <= 0) return
    const id = getCartItemId(product)
    const image = getImageUrl(product.image)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      const addQty = stock !== undefined
        ? Math.min(quantity, Math.max(0, stock - (existing?.quantity ?? 0)))
        : quantity
      if (addQty < 1 && !existing) return prev
      if (existing) {
        const newQty = stock !== undefined
          ? Math.min(existing.quantity + quantity, stock)
          : existing.quantity + quantity
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: newQty, ...(stock !== undefined && { stock }) } : i
        )
      }
      return [
        ...prev,
        { id, name: product.name, price: product.price, image, quantity: addQty, ...(stock !== undefined && { stock }) }
      ]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const capped = i.stock !== undefined ? Math.min(quantity, i.stock) : quantity
        return { ...i, quantity: capped }
      })
    )
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    itemCount,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
