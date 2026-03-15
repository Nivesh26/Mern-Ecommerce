import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../User Components/Header'
import Footer from '../User Components/Footer'
import { useCart } from '../context/CartContext'
import { useStoreStatus } from '../context/StoreStatusContext'

const Cart = () => {
  const { items, removeItem, updateQuantity } = useCart()
  const { storeOpen } = useStoreStatus()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const selectedItems = items.filter((i) => selectedIds.has(i.id))
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const TAX_RATE = 0.13
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(items.map((i) => i.id)))
    else setSelectedIds(new Set())
  }

  const deleteSelected = () => {
    const count = selectedIds.size
    selectedIds.forEach((id) => removeItem(id))
    setSelectedIds(new Set())
    toast.success(count === 1 ? 'Item removed from cart' : `${count} items removed from cart`)
  }

  const allSelected = items.length > 0 && selectedIds.size === items.length
  const someSelected = selectedIds.size > 0

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const newQty = Math.max(1, quantity)
    updateQuantity(id, newQty)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    toast.success('Removed from cart')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:py-10">
        <div className="max-w-6xl mx-auto">
          {!storeOpen && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Store is closed. Orders are not being accepted at the moment.
            </div>
          )}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 sm:p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center ring-4 ring-gray-50">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold text-lg mb-1">Your cart is empty</p>
              <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">Add products from the shop to get started.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                Continue Shopping
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left: cart items */}
              <div className="flex-1">
                {/* Top bar: Select all + Delete */}
                <div className="bg-white border border-gray-200 rounded-t-xl shadow-sm flex items-center justify-between px-5 py-3.5">
                  <label className={`flex items-center gap-3 select-none ${storeOpen ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => storeOpen && selectAll(e.target.checked)}
                      disabled={!storeOpen}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 accent-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-gray-700 tracking-wide">
                      SELECT ALL ({items.length} ITEM{items.length !== 1 ? 'S' : ''})
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    disabled={!someSelected}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    DELETE
                  </button>
                </div>

                {/* Product list */}
                <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-sm divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 p-5 sm:items-center hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <label className={`shrink-0 pt-0.5 sm:pt-0 ${storeOpen ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => storeOpen && toggleSelect(item.id)}
                            disabled={!storeOpen}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 accent-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </label>
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base leading-snug">{item.name}</h2>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                −
                              </button>
                              <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-100 tabular-nums">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-base font-semibold text-green-600 tabular-nums">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors ml-auto"
                              aria-label="Remove"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: bill */}
              <div className="lg:w-[22rem] shrink-0">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-4 shadow-sm">
                  {/* Bill header */}
                  <div className="border-b border-gray-200 bg-white px-5 py-5">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
                  </div>

                  {/* Line items */}
                  <div className="px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Items</p>
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Description</th>
                          <th className="pb-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-12">Qty</th>
                          <th className="pb-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-20">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {selectedItems.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-10 text-center text-gray-400 text-sm">Select items from cart to include</td>
                          </tr>
                        ) : (
                          selectedItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50">
                              <td className="py-3 pr-3 align-top"><span className="line-clamp-2 text-gray-800">{item.name}</span></td>
                              <td className="py-3 text-right align-top tabular-nums font-medium text-gray-700">{item.quantity}</td>
                              <td className="py-3 text-right align-top tabular-nums font-semibold text-gray-900 whitespace-nowrap">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          )))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="px-5 pb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Summary</p>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="tabular-nums font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (13%)</span>
                        <span className="tabular-nums font-medium text-gray-900">Rs. {tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="tabular-nums font-bold text-gray-900 text-lg">Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 space-y-2">
                    <Link
                      to="/shop"
                      className="flex items-center justify-center gap-2 w-full border border-green-600 text-green-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
                    >
                      Continue Shopping
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      disabled={!storeOpen}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                    >
                      {storeOpen ? 'Proceed to Checkout' : 'Checkout unavailable (store closed)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Cart
