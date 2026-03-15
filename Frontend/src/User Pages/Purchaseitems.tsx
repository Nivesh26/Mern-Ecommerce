import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../User Components/Header'
import Footer from '../User Components/Footer'
import { getMyOrders, type OrderFromAPI } from '../api/orders'

const statusColors: Record<OrderFromAPI['status'], string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
}

const Purchaseitems = () => {
  const [orders, setOrders] = useState<OrderFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getMyOrders()
      .then((res) => {
        if (!cancelled) setOrders(res.orders || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">View your purchase history</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
              Loading your orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <p className="text-gray-800 font-medium mb-2">No orders yet</p>
              <p className="text-gray-500 text-sm mb-6">Orders you place will appear here.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Start Shopping
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer hover:bg-gray-50/50"
                    onClick={() => setExpandedId((prev) => (prev === order._id ? null : order._id))}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-500">{order.date}</span>
                      <span className="text-lg font-bold text-gray-900">Rs. {order.total.toLocaleString()}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order._id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expandedId === order._id && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Items</p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="pb-2 text-left font-semibold text-gray-600">Product</th>
                            <th className="pb-2 text-right font-semibold text-gray-600 w-14">Qty</th>
                            <th className="pb-2 text-right font-semibold text-gray-600 w-24">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-2.5 text-gray-800">{item.productName}</td>
                              <td className="py-2.5 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                              <td className="py-2.5 text-right font-medium text-gray-900 tabular-nums">
                                Rs. {(item.quantity * item.price).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                        <span className="font-bold text-gray-900">Total: Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link to="/cart" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Purchaseitems
