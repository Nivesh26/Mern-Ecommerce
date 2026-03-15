import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getStoreStatus } from '../api/store'

type StoreStatusContextValue = {
  storeOpen: boolean
  loading: boolean
  refreshStoreStatus: () => Promise<void>
}

const StoreStatusContext = createContext<StoreStatusContextValue | null>(null)

export function StoreStatusProvider({ children }: { children: ReactNode }) {
  const [storeOpen, setStoreOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  const refreshStoreStatus = useCallback(async () => {
    try {
      const data = await getStoreStatus()
      setStoreOpen(data.storeOpen ?? true)
    } catch {
      setStoreOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshStoreStatus()
  }, [refreshStoreStatus])

  const value: StoreStatusContextValue = {
    storeOpen,
    loading,
    refreshStoreStatus,
  }

  return <StoreStatusContext.Provider value={value}>{children}</StoreStatusContext.Provider>
}

export function useStoreStatus() {
  const ctx = useContext(StoreStatusContext)
  if (!ctx) throw new Error('useStoreStatus must be used within StoreStatusProvider')
  return ctx
}
