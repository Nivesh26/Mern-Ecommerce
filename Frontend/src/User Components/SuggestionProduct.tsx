import { Link } from 'react-router-dom'
import productImage from '../assets/176775850311hn1.webp'
import productImage2 from '../assets/SpecialChyawanprash.webp'
import productImage3 from '../assets/SoanPapdi.webp'
import productImage4 from '../assets/Ghee.webp'

const SUGGESTED_PRODUCTS = [
  {
    name: 'Dant Kanti Natural Toothpaste 43g (Buy 11+ 1 Free) Hanger',
    price: 450,
    image: productImage,
    category: 'Digestive Care'
  },
  {
    name: 'Special Chyawanprash',
    price: 650,
    image: productImage2,
    category: 'Immunity Boosters'
  },
  {
    name: 'Soan Papdi',
    price: 550,
    image: productImage3,
    category: 'Herbal Supplements'
  },
  {
    name: "Cow's Ghee",
    price: 350,
    image: productImage4,
    category: 'Skin & Hair Care'
  }
]

const SuggestionProduct = () => {
  return (
    <section className="w-full mt-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">You may also like</h2>
        <p className="text-gray-500 text-sm mt-1">Recommended for you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUGGESTED_PRODUCTS.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <Link to="/product" state={{ product }} className="block relative overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <Link to="/product" state={{ product }}>
                <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-lg font-bold text-gray-800">Rs. {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SuggestionProduct
