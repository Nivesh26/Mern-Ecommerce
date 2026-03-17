import { Link } from 'react-router-dom'
import ctaBackground from '../assets/traditional-mortar-and-pestle-for-grinding-ingredients-photo.jpeg'

const CTA = () => {
  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ctaBackground})` }}
      >
        {/* Light Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Discover Your Path to Natural Wellness
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Explore our extensive collection of authentic Ayurvedic products and experience the healing power of nature
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop"
              className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/aboutus"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA