import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, productImageUrl, type ProductItem } from '../api/products'

const SuggestionProduct = ({ excludeProductId }: { excludeProductId?: string }) => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((res) => {
        if (!cancelled) {
          const all = res.products || []
          const filtered = excludeProductId
            ? all.filter((p) => p._id !== excludeProductId)
            : all
          setProducts(filtered.slice(0, 4))
        }
      })
      .catch(() => { if (!cancelled) setProducts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [excludeProductId])

  return (
    <section className="w-full mt-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">You may also like</h2>
        <p className="text-gray-500 text-sm mt-1">Recommended for you</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No other products at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = (product.imageUrls || [])[0]
            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={productImageUrl(imageUrl)}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-gray-100">No image</div>
                  )}
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-gray-800">Rs. {product.price}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default SuggestionProduct
