import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products - list all (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch products.' });
  }
});

// GET /api/products/:id - single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch product.' });
  }
});

// POST /api/products - create (admin only), multipart with images (max 4)
router.post('/', protect, requireAdmin, (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || 'File upload failed.' });
    next();
  });
}, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || price == null || !category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required.' });
    }
    const imageUrls = (req.files || []).map((f) => `/uploads/products/${f.filename}`);
    if (imageUrls.length > 4) {
      return res.status(400).json({ success: false, message: 'Maximum 4 images allowed.' });
    }
    const product = await Product.create({
      name: name.trim(),
      description: (description || '').trim(),
      price: Number(price),
      category: category.trim(),
      imageUrls,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create product.' });
  }
});

// PUT /api/products/:id - update (admin only), multipart with optional new images
router.put('/:id', protect, requireAdmin, (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message || 'File upload failed.' });
    next();
  });
}, async (req, res) => {
  try {
    const { name, description, price, category, existingImageUrls } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category.trim();
    const newPaths = (req.files || []).map((f) => `/uploads/products/${f.filename}`);
    let kept = [];
    try {
      kept = typeof existingImageUrls === 'string' ? JSON.parse(existingImageUrls) : (existingImageUrls || []);
    } catch (_) {}
    if (!Array.isArray(kept)) kept = [];
    product.imageUrls = [...kept, ...newPaths].slice(0, 4);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - delete (admin only)
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete product.' });
  }
});

export default router;
