import { Link } from 'react-router-dom'
import { productImageUrl, type ProductItem } from '../api/products'

const NewProduct = ({ products, loading }: { products: ProductItem[]; loading?: boolean }) => {
  const newProducts = products.slice(0, 4)

  return (
    <section className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            New Products
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading products…</div>
        ) : newProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.map((product) => {
              const imageUrl = (product.imageUrls || [])[0]
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={productImageUrl(imageUrl)}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-gray-100">No image</div>
                    )}
                  </Link>

                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-800">Rs. {product.price}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewProduct
