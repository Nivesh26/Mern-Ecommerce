import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export type CartProduct = {
  id?: number | string
  name: string
  price: number
  image: string | { default?: string }
  category?: string
  description?: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
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

type CartContextValue = {
  items: CartItem[]
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  itemCount: number
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

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (_) {}
  }, [items])

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    const id = getCartItemId(product)
    const image = getImageUrl(product.image)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        { id, name: product.name, price: product.price, image, quantity }
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
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    itemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
