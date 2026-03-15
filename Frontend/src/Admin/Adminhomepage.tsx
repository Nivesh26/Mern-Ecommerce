import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../AdminComponent/Navbar'
import { getProducts, type ProductItem } from '../api/products'
import { getCustomers } from '../api/auth'

const CATEGORY_COLORS: Record<string, string> = {
  'Digestive Care': '#22c55e',
  'Immunity Boosters': '#3b82f6',
  'Herbal Supplements': '#f59e0b',
  'Skin & Hair Care': '#ec4899',
  'Oils & Massage': '#8b5cf6',
  'Ayurvedic Medicines': '#06b6d4',
}
const DEFAULT_COLOR = '#94a3b8'

const Adminhomepage = () => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [customers, setCustomers] = useState<{ _id: string; fullName: string; email: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([getProducts(), getCustomers()])
      .then(([prodRes, custRes]) => {
        if (!cancelled) {
          setProducts(prodRes.products || [])
          setCustomers(custRes.customers || [])
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const productCount = products.length
  const inStockCount = products.filter((p) => (p.stock ?? 0) > 0).length
  const lowStockCount = products.filter((p) => (p.stock ?? 0) <= 5 && (p.stock ?? 0) >= 0).length
  const customerCount = customers.length

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    const cat = p.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})
  const totalForPie = Object.values(categoryCounts).reduce((a, b) => a + b, 0)
  const pieData = totalForPie > 0
    ? Object.entries(categoryCounts).map(([label, count]) => ({
        label,
        value: Math.round((count / totalForPie) * 100),
        color: CATEGORY_COLORS[label] || DEFAULT_COLOR,
      }))
    : []

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 8
  let currentAngle = -90
  const segments = pieData.map((d) => {
    const ratio = d.value / 100
    const angleDeg = ratio * 360
    const startAngle = (currentAngle * Math.PI) / 180
    currentAngle += angleDeg
    const endAngle = (currentAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = angleDeg > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { ...d, path }
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="ml-64 min-h-screen p-6">
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{greeting()}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Here’s what’s happening with your store today.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Static alert icon – no dropdown, for display only */}
            <span
              className="relative inline-flex p-2 rounded-lg text-gray-500 bg-gray-100 border border-gray-200 cursor-default"
              title="Alerts"
              aria-label="Alerts (static)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" aria-hidden />
            </span>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
        </div>

        {/* Summary cards – real data */}
        {loading ? (
          <div className="mt-6 text-gray-500">Loading dashboard…</div>
        ) : (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Link to="/adminorders" className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md hover:border-green-200 transition-all block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">—</p>
                <p className="text-xs text-gray-500 mt-1">Connect orders to see sales</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Link>
          <Link to="/adminorders" className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">—</p>
                <p className="text-xs text-gray-500 mt-1">View orders page</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Link>
          <Link to="/adminproduct" className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md hover:border-violet-200 transition-all block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{productCount}</p>
                <p className="text-xs text-gray-500 mt-1">{inStockCount} in stock</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </Link>
          <Link to="/admincustomer" className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md hover:border-amber-200 transition-all block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{customerCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Registered users</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Middle row: Products by category + Recent Orders */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products by Category */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Products by Category</h2>
            <p className="text-sm text-gray-500 mt-0.5">Share of catalog</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
              {pieData.length > 0 ? (
                <>
                  <svg width={size} height={size} className="shrink-0">
                    {segments.map((seg) => (
                      <path
                        key={seg.label}
                        d={seg.path}
                        fill={seg.color}
                        className="hover:opacity-90 transition-opacity"
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </svg>
                  <ul className="space-y-2 w-full">
                    {pieData.map((d) => (
                      <li key={d.label} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-gray-700">{d.label}</span>
                        <span className="font-medium text-gray-800 ml-auto">{d.value}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-500 text-sm py-4">No products yet. Add products to see breakdown.</p>
              )}
            </div>
          </div>

          {/* Recent Orders – no orders API yet */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest orders</p>
              </div>
              <Link to="/adminorders" className="text-sm font-medium text-green-600 hover:text-green-700">View all</Link>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No orders yet. Orders are managed on the Orders page.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Products list – real data */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your catalog (latest first)</p>
          <div className="mt-4 overflow-x-auto">
            {products.length === 0 ? (
              <p className="py-6 text-center text-gray-500 text-sm">No products yet. Add products in the Products page.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.slice(0, 8).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-800">{product.name}</td>
                      <td className="py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="py-3 text-sm text-right tabular-nums">{(product.stock ?? 0)}</td>
                      <td className="py-3 text-sm font-medium text-gray-800 text-right tabular-nums">Rs. {product.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {products.length > 8 && (
            <p className="mt-2 text-sm text-gray-500 text-right">Showing 8 of {products.length}. <Link to="/adminproduct" className="text-green-600 hover:text-green-700">View all</Link></p>
          )}
        </div>

        {/* Quick info strip – real low stock */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/adminorders" className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 hover:bg-green-100/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Orders delivered today</p>
              <p className="text-2xl font-bold text-green-900">—</p>
            </div>
          </Link>
          <Link to="/adminorders" className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4 hover:bg-amber-100/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Pending orders</p>
              <p className="text-2xl font-bold text-amber-900">—</p>
            </div>
          </Link>
          <Link to="/adminproduct" className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4 hover:bg-blue-100/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Low stock alerts</p>
              <p className="text-2xl font-bold text-blue-900">{lowStockCount}</p>
            </div>
          </Link>
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Adminhomepage
