import { useState } from 'react'
import Header from '../User Components/Header.tsx'
import Footer from '../User Components/Footer.tsx'
import productImage from '../assets/176775850311hn1.webp'
import prdoductImage2 from '../assets/SpecialChyawanprash.webp'
import prdoductImage3 from '../assets/SoanPapdi.webp'
import productImage4 from '../assets/Ghee.webp'

const New = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(1000)
  const maxPriceLimit = 10000

  const products = [

    {
      id: 1,
      name: 'Dant Kanti Natural Toothpaste 43g (Buy 11+ 1 Free) Hanger',
      price: 450,
      image: productImage,
      category: 'Digestive Care'
    },
    {
      id: 2,
      name: 'Special Chyawanprash',
      price: 650,
      image: prdoductImage2,
      category: 'Immunity Boosters'
    },
    {
      id: 3,
      name: 'Soan Papdi',
      price: 550,
      image: prdoductImage3,
      category: 'Herbal Supplements'
    },
    {
      id: 4,
      name: 'Cow\'s Ghee',
      price: 350,
      image: productImage4,
      category: 'Skin & Hair Care'
    },
    {
      id: 5,
      name: 'Soan Papdi',
      price: 550,
      image: prdoductImage3,
      category: 'Herbal Supplements'
    },
    {
      id: 6,
      name: 'Cow\'s Ghee',
      price: 350,
      image: productImage4,
      category: 'Skin & Hair Care'
    }
  ]

  const categories = ['All', 'Digestive Care', 'Immunity Boosters', 'Herbal Supplements', 'Skin & Hair Care', 'Oils & Massage', 'Ayurvedic Medicines']

  const handleAddToCart = (productId: number) => {
    console.log('Added to cart:', productId)
    // Add to cart logic here
  }

  // Filter products based on selected category and price range
  const filteredProducts = products.filter((product) => {
    // Category filter
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory
    
    // Price range filter
    const priceMatch = product.price >= minPrice && product.price <= maxPrice
    
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">New</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
                
                {/* Category Filter */}
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
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h3>
                  
                  {/* Price Display */}
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

                  {/* Min Price Slider */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-600 mb-2">Minimum Price</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      value={minPrice}
                      onChange={(e) => {
                        const newMin = Number(e.target.value)
                        if (newMin <= maxPrice) {
                          setMinPrice(newMin)
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(minPrice / maxPriceLimit) * 100}%, #e5e7eb ${(minPrice / maxPriceLimit) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>

                  {/* Max Price Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Maximum Price</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPriceLimit}
                      value={maxPrice}
                      onChange={(e) => {
                        const newMax = Number(e.target.value)
                        if (newMax >= minPrice) {
                          setMaxPrice(newMax)
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(maxPrice / maxPriceLimit) * 100}%, #2563eb ${(maxPrice / maxPriceLimit) * 100}%, #2563eb 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex flex-col">
                      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                      <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-2">
                        <span className="text-xl font-bold text-gray-800">Rs. {product.price}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
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

export default New