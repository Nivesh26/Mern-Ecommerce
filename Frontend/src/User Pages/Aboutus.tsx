import { Link } from 'react-router-dom'
import Header from '../User Components/Header.tsx'
import Footer from '../User Components/Footer.tsx'
import { FaLeaf, FaShieldAlt, FaHeart, FaRecycle, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'
import storyImage from '../assets/traditional-mortar-and-pestle-for-grinding-ingredients-photo.jpeg'

const Aboutus = () => {
  const values = [
    {
      icon: FaCheckCircle,
      title: 'Authenticity',
      description: 'Genuine Ayurvedic products sourced from trusted suppliers and traditional practitioners'
    },
    {
      icon: FaShieldAlt,
      title: 'Quality & Safety',
      description: 'Rigorous quality checks ensuring safe, effective, and pure Ayurvedic formulations'
    },
    {
      icon: FaHeart,
      title: 'Trust & Transparency',
      description: 'Building lasting relationships through honest practices and clear communication'
    },
    {
      icon: FaRecycle,
      title: 'Sustainability',
      description: 'Eco-friendly practices preserving nature while promoting wellness'
    }
  ]

  const offerings = [
    'Authentic Ayurvedic Medicines',
    'Herbal Supplements & Tonics',
    'Traditional Oils & Massage Products',
    'Natural Skin & Hair Care Solutions',
    'Digestive & Immunity Boosters',
    'Wellness Consultations',
    'Customized Ayurvedic Remedies'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Page Title */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Nivesh 
            </h1>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="order-2 md:order-1">
                <img
                  src={storyImage}
                  alt="Traditional Ayurvedic ingredients"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              </div>
              {/* Text Content */}
              <div className="order-1 md:order-2 space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Nivesh Shop was born from a deep reverence for the ancient wisdom of Ayurveda and a commitment to bringing authentic, traditional healing to the people of Nepal. Nestled in the historic Patan Durbar Square, our shop stands as a bridge between the rich cultural heritage of the Newar community and the timeless principles of Ayurvedic medicine.
                </p>
                <p className="text-lg">
                  Our journey began with a vision to preserve and share the authentic Ayurvedic knowledge that has been passed down through generations. We believe that true wellness comes from understanding the harmony between nature, body, and mind—principles deeply embedded in both Ayurvedic philosophy and Nepalese cultural traditions. Every product we offer is carefully selected to ensure it meets the highest standards of authenticity and efficacy, honoring the legacy of this ancient healing science.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <FaLeaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To provide authentic Ayurvedic wellness solutions that honor traditional knowledge while meeting modern health needs. We are dedicated to sourcing genuine products, educating our community about Ayurvedic principles, and fostering a holistic approach to health and well-being.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 rounded-full p-3 mr-4">
                    <FaHeart className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become Nepal's most trusted destination for authentic Ayurvedic products and knowledge. We envision a future where traditional healing wisdom is accessible to all, creating a healthier, more balanced community rooted in the timeless principles of Ayurveda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
              Our Roots in Patan Durbar Square
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              Located in the heart of Patan Durbar Square, a UNESCO World Heritage Site, our shop is surrounded by centuries of Newar culture and architectural splendor. This historic location reflects our commitment to preserving traditional knowledge while serving the modern community.
            </p>

            {/* Location Card */}
            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              {/* Google Map */}
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4567890123!2d85.3244!3d27.6731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sPatan%20Durbar%20Square%2C%20Lalitpur%2044600!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Patan Durbar Square Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 text-center group"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-gradient-to-br from-green-100 to-amber-100 rounded-full p-4 group-hover:from-green-200 group-hover:to-amber-200 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-green-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">What We Offer</h2>
            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-xl shadow-lg p-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offerings.map((offering, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 shrink-0" />
                    <span className="text-gray-700 text-lg">{offering}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience Authentic Ayurvedic Wellness
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Visit our store in Patan Durbar Square or explore our products online. We're here to guide you on your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#location"
                className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Visit Our Store
              </a>
              <Link
                to="/shop"
                className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Aboutus
