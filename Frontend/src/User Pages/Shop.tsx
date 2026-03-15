import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../User Components/Header'
import Footer from '../User Components/Footer'
import { useCart } from '../context/CartContext'
import { getProducts, productImageUrl, type ProductItem } from '../api/products'

const Shop = () => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(10000)
  const maxPriceLimit = 10000
  const { addItem } = useCart()

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((res) => { if (!cancelled) setProducts(res.products || []) })
      .catch(() => { if (!cancelled) setProducts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const categories = ['All', 'Digestive Care', 'Immunity Boosters', 'Herbal Supplements', 'Skin & Hair Care', 'Oils & Massage', 'Ayurvedic Medicines']

  const handleAddToCart = (product: ProductItem) => {
    const firstImage = (product.imageUrls || [])[0]
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: firstImage ? productImageUrl(firstImage) : '',
      category: product.category,
      description: product.description
    })
  }

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory
    const priceMatch = product.price >= minPrice && product.price <= maxPrice
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Shop</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Min</p>
                      <p className="text-sm font-semibold text-gray-800">Rs. {minPrice}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Max</p>
                      <p className="text-sm font-semibold text-gray-800">Rs. {maxPrice}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs text-gray-600 mb-2">Minimum Price</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      value={minPrice}
                      onChange={(e) => {
                        const newMin = Number(e.target.value)
                        if (newMin <= maxPrice) setMinPrice(newMin)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(minPrice / maxPriceLimit) * 100}%, #e5e7eb ${(minPrice / maxPriceLimit) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Maximum Price</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      value={maxPrice}
                      onChange={(e) => {
                        const newMax = Number(e.target.value)
                        if (newMax >= minPrice) setMaxPrice(newMax)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(maxPrice / maxPriceLimit) * 100}%, #16a34a ${(maxPrice / maxPriceLimit) * 100}%, #16a34a 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Loading products…</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                    >
                      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-100">
                        {(product.imageUrls || [])[0] ? (
                          <img
                            src={productImageUrl((product.imageUrls || [])[0])}
                            alt={product.name}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-56 flex items-center justify-center text-gray-400 bg-gray-100">
                            No image
                          </div>
                        )}
                      </Link>

                      <div className="p-3 flex flex-col">
                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mb-2">
                          <span className="text-xl font-bold text-gray-800">Rs. {product.price}</span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Shop
