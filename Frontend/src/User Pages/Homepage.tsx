import { useState, useEffect } from 'react'
import Header from '../User Components/Header.tsx'
import Footer from '../User Components/Footer.tsx'
import Hero from '../User Components/Hero.tsx'
import Feature from '../User Components/Feature.tsx'
import Bestselling from '../User Components/Bestselling.tsx'
import NewProduct from '../User Components/NewProduct.tsx'
import CTA from '../User Components/CTA.tsx'
import { getProducts, type ProductItem } from '../api/products'

const Homepage = () => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((res) => { if (!cancelled) setProducts(res.products || []) })
      .catch(() => { if (!cancelled) setProducts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <Header />
      <Hero />
      <Feature />
      <Bestselling products={products} loading={loading} />
      <CTA />
      <NewProduct products={products} loading={loading} />
      <Footer />
    </div>
  )
}

export default Homepage