import { useState } from 'react'
import Header from '../User Components/Header.tsx'
import Footer from '../User Components/Footer.tsx'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add form submission logic here
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Page Title */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Contact Us
            </h1>
          </div>
        </section>

        {/* Form & Location Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product inquiry</option>
                      <option value="order">Order & delivery</option>
                      <option value="wellness">Wellness consultation</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Your message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Shop Location & Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop Location & Details</h2>
                <div className="space-y-6">
                  {/* Location Card */}
                  <div>
                    <div className="flex items-start mb-4">
                      <div className="bg-amber-100 rounded-full p-3 mr-4 shrink-0">
                        <FaMapMarkerAlt className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Visit Us</h3>
                        <p className="text-gray-700 leading-relaxed">
                          Patan Durbar Square, Lalitpur<br />
                          Kathmandu Valley, Nepal
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-3 mr-4 shrink-0">
                      <FaPhone className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                      <a
                        href="tel:+9779808000000"
                        className="text-gray-700 hover:text-green-600 transition-colors"
                      >
                        +977 9808000000
                      </a>
                      <span className="text-gray-500 mx-2">|</span>
                      <a
                        href="tel:01121212"
                        className="text-gray-700 hover:text-green-600 transition-colors"
                      >
                        01 121212
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <div className="bg-amber-100 rounded-full p-3 mr-4 shrink-0">
                      <FaEnvelope className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                      <a
                        href="mailto:info@nivesh.com"
                        className="text-gray-700 hover:text-green-600 transition-colors"
                      >
                        info@nivesh.com
                      </a>
                    </div>
                  </div>

                  {/* Google Map */}
                  <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
