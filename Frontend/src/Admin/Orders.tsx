import React, { useState } from 'react'
import Navbar from '../AdminComponent/Navbar'

type OrderItem = {
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

type Order = {
  id: string
  customerName: string
  customerEmail: string
  date: string
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: OrderItem[]
  total: number
}

// Static mock orders
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ram Kumar',
    customerEmail: 'ram.kumar@example.com',
    date: '2025-03-14',
    status: 'Confirmed',
    total: 2450,
    items: [
      { productName: 'Chyawanprash 500g', quantity: 2, price: 450 },
      { productName: 'Triphala Tablets', quantity: 1, price: 350 },
      { productName: 'Ashwagandha Powder', quantity: 1, price: 1200 },
    ],
  },
  {
    id: 'ORD-002',
    customerName: 'Sita Sharma',
    customerEmail: 'sita.sharma@example.com',
    date: '2025-03-13',
    status: 'Shipped',
    total: 1890,
    items: [
      { productName: 'Digestive Care Syrup', quantity: 1, price: 590 },
      { productName: 'Herbal Tea - Tulsi', quantity: 3, price: 433 },
    ],
  },
  {
    id: 'ORD-003',
    customerName: 'Anita Gurung',
    customerEmail: 'anita.g@example.com',
    date: '2025-03-12',
    status: 'Delivered',
    total: 3200,
    items: [
      { productName: 'Immunity Booster Capsules', quantity: 2, price: 800 },
      { productName: 'Aloe Vera Gel', quantity: 1, price: 650 },
      { productName: 'Sesame Massage Oil', quantity: 1, price: 950 },
    ],
  },
  {
    id: 'ORD-004',
    customerName: 'Bikash Thapa',
    customerEmail: 'bikash.t@example.com',
    date: '2025-03-15',
    status: 'Pending',
    total: 750,
    items: [
      { productName: 'Ayurvedic Toothpaste', quantity: 2, price: 375 },
    ],
  },
]

const statusColors: Record<Order['status'], string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

// Status can only move forward: Pending → Confirmed → Shipped → Delivered (admin cannot change back)
const STATUS_FLOW: Order['status'][] = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

function getAllowedStatusOptions(currentStatus: Order['status']): Order['status'][] {
  const idx = STATUS_FLOW.indexOf(currentStatus)
  return idx === -1 ? [currentStatus] : STATUS_FLOW.slice(idx)
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(() => [...MOCK_ORDERS])
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_ORDERS[0]?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
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
                {filteredOrders.map((order) => (
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
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
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
                ))}
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
