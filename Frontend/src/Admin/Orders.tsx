import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../AdminComponent/Navbar'
import { getOrders, updateOrderStatus as updateOrderStatusAPI, type OrderFromAPI } from '../api/orders'

type OrderItem = {
  productName: string
  quantity: number
  price: number
}

type Order = {
  _id: string
  id: string
  customerName: string
  customerEmail: string
  date: string
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered'
  items: OrderItem[]
  total: number
}

function mapApiOrderToOrder(api: OrderFromAPI): Order {
  return {
    _id: api._id,
    id: api.id,
    customerName: api.customerName,
    customerEmail: api.customerEmail,
    date: api.date,
    status: api.status,
    items: api.items,
    total: api.total,
  }
}

const statusColors: Record<Order['status'], string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
}

const STATUS_FLOW: Order['status'][] = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

function getAllowedStatusOptions(currentStatus: Order['status']): Order['status'][] {
  const idx = STATUS_FLOW.indexOf(currentStatus)
  return idx === -1 ? [currentStatus] : STATUS_FLOW.slice(idx)
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getOrders()
      .then((res) => {
        if (!cancelled) setOrders((res.orders || []).map(mapApiOrderToOrder))
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load orders')
        toast.error(err instanceof Error ? err.message : 'Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const order = orders.find((o) => o._id === orderId || o.id === orderId)
    if (!order) return
    try {
      await updateOrderStatusAPI(order._id, status)
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status } : o)))
      toast.success(`Status updated to ${status}. Customer has been notified.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const q = searchQuery.trim().toLowerCase()
  const filteredOrders = q
    ? orders.filter(
        (order) =>
          order.id.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.customerEmail.toLowerCase().includes(q) ||
          order.items.some((item) => item.productName.toLowerCase().includes(q))
      )
    : orders

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 min-h-screen p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">View and manage customer orders</p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">{error}</div>
        )}

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">All orders</h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <input
                type="search"
                placeholder="Search by order ID, customer, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (Rs.)</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading orders…</td>
                  </tr>
                ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                          className={`min-w-[7rem] px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer ${statusColors[order.status]}`}
                        >
                          {getAllowedStatusOptions(order.status).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-right tabular-nums">Rs. {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setExpandedId((prev) => (prev === order.id ? null : order.id))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          {expandedId === order.id ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              Hide
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Show
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                              <h3 className="text-sm font-semibold text-gray-800">Ordered products</h3>
                            </div>
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Price (Rs.)</th>
                                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Subtotal (Rs.)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx} className="border-b border-gray-50 last:border-0">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.productName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-right tabular-nums">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-right tabular-nums">{item.price.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right tabular-nums">
                                      Rs. {(item.quantity * item.price).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
                              <span className="text-sm font-semibold text-gray-800">Order total: Rs. {order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
                )}
              </tbody>
            </table>
          </div>

          {(filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Orders
