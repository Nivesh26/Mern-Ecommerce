import { Link } from 'react-router-dom'
import { FaUser, FaShoppingCart } from 'react-icons/fa'
import { getUser } from '../api/auth'

const Header = () => {
  const user = getUser()

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">Nivesh</span>
          </Link>
        </div>
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-red-600">Home</Link></li>
          <li><Link to="/new" className="hover:text-red-600">New</Link></li>
          <li><Link to="/shop" className="hover:text-red-600">Shop</Link></li>
          <li><Link to="/aboutus" className="hover:text-red-600">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-red-600">Contact</Link></li>
        </ul>

        <div className="hidden md:flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-full px-5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-64"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Cart"
              >
                <FaShoppingCart className="w-5 h-5" />
              </Link>
              <Link
                to="/profile"
                className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Profile"
              >
                <FaUser className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header