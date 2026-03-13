import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Header from '../User Components/Header'
import Footer from '../User Components/Footer'
import SuggestionProduct from '../User Components/SuggestionProduct'
import { useCart } from '../context/CartContext'
import productImage from '../assets/176775850311hn1.webp'

// Single default product when page is opened directly (no state from shop)
const DEFAULT_PRODUCT = {
  name: 'Dant Kanti Natural Toothpaste 43g (Buy 11+ 1 Free) Hanger',
  price: 450,
  image: productImage,
  category: 'Digestive Care',
  description: 'Authentic Ayurvedic toothpaste with natural ingredients for strong teeth and healthy gums. Made with traditional herbs for complete oral care.'
}

const SAMPLE_REVIEWS = [
  { name: 'Sita Sharma', rating: 5, date: 'Mar 5, 2025', comment: 'Very effective and natural. My whole family uses it. Teeth feel clean and fresh.' },
  { name: 'Ram Kumar', rating: 4, date: 'Feb 28, 2025', comment: 'Good quality Ayurvedic toothpaste. Would recommend for daily use.' },
  { name: 'Anita Gurung', rating: 5, date: 'Feb 15, 2025', comment: 'Authentic product. Fast delivery from Nivesh. Will buy again.' }
]

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const Productdetail = () => {
  const location = useLocation()
  const productFromShop = location.state?.product as { id?: number; name: string; price: number; image: string; category: string; description?: string } | undefined
  const product = productFromShop ?? DEFAULT_PRODUCT
  const description = product.description ?? 'Authentic Ayurvedic product from Nivesh.'

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: 'id' in product ? product.id : undefined,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description
    })
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Static for now: do not add reviews, just reset form
    setReviewForm({ rating: 5, comment: '' })
  }

  const reviews = SAMPLE_REVIEWS

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-green-600">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>

          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6 md:p-10">
              <img
                src={typeof product.image === 'string' ? product.image : (product.image as { default?: string })?.default ?? productImage}
                alt={product.name}
                className="w-full max-w-md object-contain rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <p className="text-sm font-medium text-green-600 mb-1">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-gray-800 mb-6">Rs. {product.price}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-10 bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
            <p className="text-gray-500 text-sm mb-6">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>

            {/* Write a review */}
            <form onSubmit={handleReviewSubmit} className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        className="p-1 rounded focus:outline-none"
                        aria-label={`${star} stars`}
                      >
                        <svg
                          className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
                  <textarea
                    id="review-comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Submit review
                </button>
              </div>
            </form>

            {/* Review list */}
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{review.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 pl-14">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          <SuggestionProduct />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Productdetail
