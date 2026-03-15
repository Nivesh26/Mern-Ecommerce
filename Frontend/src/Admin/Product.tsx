import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../AdminComponent/Navbar'
import { getProducts, createProduct, updateProduct, deleteProduct, productImageUrl, type ProductItem } from '../api/products'

const CATEGORIES = ['Digestive Care', 'Immunity Boosters', 'Herbal Supplements', 'Skin & Hair Care', 'Oils & Massage', 'Ayurvedic Medicines']
const MAX_IMAGES = 4

const Product = () => {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: CATEGORIES[0],
    description: '',
    existingImageUrls: [] as string[],
    selectedFiles: [] as File[],
  })

  const totalImages = form.existingImageUrls.length + form.selectedFiles.length
  const canAddMore = totalImages < MAX_IMAGES

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      setProducts(res.products || [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      category: CATEGORIES[0],
      description: '',
      existingImageUrls: [],
      selectedFiles: [],
    })
    setEditingId(null)
  }

  const handleEdit = (product: ProductItem) => {
    setEditingId(product._id)
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || '',
      existingImageUrls: product.imageUrls || [],
      selectedFiles: [],
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList?.length) return
    const add = Array.from(fileList).slice(0, MAX_IMAGES - totalImages)
    e.target.value = ''
    setForm((prev) => ({
      ...prev,
      selectedFiles: [...prev.selectedFiles, ...add].slice(0, MAX_IMAGES - prev.existingImageUrls.length),
    }))
  }

  const removeExistingImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index),
    }))
  }

  const removeSelectedFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseInt(form.price, 10)
    if (!form.name.trim() || isNaN(price) || price < 0) return
    if (totalImages > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('price', String(price))
      formData.append('category', form.category)
      formData.append('description', form.description.trim())
      if (editingId) {
        formData.append('existingImageUrls', JSON.stringify(form.existingImageUrls))
      }
      form.selectedFiles.forEach((file) => formData.append('images', file))
      if (editingId) {
        const res = await updateProduct(editingId, formData)
        toast.success('Product updated.')
        setProducts((prev) => prev.map((p) => (p._id === editingId ? res.product : p)))
      } else {
        const res = await createProduct(formData)
        toast.success('Product added.')
        setProducts((prev) => [res.product, ...prev])
      }
      resetForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      if (editingId === id) resetForm()
      toast.success('Product deleted.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const inputBase =
    'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow'

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 min-h-screen p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your product catalog</p>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Edit product' : 'Add new product'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="md:col-span-2">
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1.5">Product name *</label>
                <input
                  id="product-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Special Chyawanprash"
                  className={inputBase}
                  required
                />
              </div>
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1.5">Price (Rs.) *</label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="450"
                  className={inputBase}
                  required
                />
              </div>
              <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  id="product-category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className={`${inputBase} bg-white`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product images (max {MAX_IMAGES})</label>
                {canAddMore && (
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">{totalImages} / {MAX_IMAGES} images</p>
                {(form.existingImageUrls.length > 0 || form.selectedFiles.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.existingImageUrls.map((url, index) => (
                      <div key={`ex-${index}`} className="relative group">
                        <img
                          src={productImageUrl(url)}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center hover:bg-red-600 shadow"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {form.selectedFiles.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold flex items-center justify-center hover:bg-red-600 shadow"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  id="product-description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short product description..."
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}
              </button>
              {(editingId || form.name || form.price || totalImages > 0) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 border border-green-600 text-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">All products</h2>
            <p className="text-sm text-gray-500 mt-0.5">{loading ? 'Loading…' : `${products.length} products`}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading products…</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No products yet. Add one above.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {(product.imageUrls || [])[0] ? (
                            <img
                              src={productImageUrl((product.imageUrls || [])[0])}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs border border-gray-200">No img</div>
                          )}
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right tabular-nums">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Product
