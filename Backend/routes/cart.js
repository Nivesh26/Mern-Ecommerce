import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cart – get current user's cart (with product details)
router.get('/', protect, async (req, res) => {
  try {
    const cartDoc = await Cart.findOne({ user: req.userId }).populate('items.product').lean();
    const items = cartDoc?.items ?? [];
    const cart = items.map((entry) => ({
      productId: entry.product?._id,
      product: entry.product,
      quantity: entry.quantity,
    }));
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get cart.' });
  }
});

// PUT /api/cart – save cart (replace entire cart)
// Body: { items: [ { productId: string, quantity: number }, ... ] }
router.put('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items must be an array.' });
    }
    const valid = items.every((i) => i && typeof i.productId !== 'undefined' && typeof i.quantity === 'number' && i.quantity >= 1);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Each item must have productId and quantity (min 1).' });
    }
    const productIds = [...new Set(items.map((i) => i.productId))];
    const existing = await Product.find({ _id: { $in: productIds } }).select('_id').lean();
    const existingIds = new Set(existing.map((p) => p._id.toString()));
    const invalid = productIds.filter((id) => !existingIds.has(String(id)));
    if (invalid.length > 0) {
      return res.status(400).json({ success: false, message: 'Some product IDs are invalid.', invalid });
    }
    const cartItems = items.map((i) => ({
      product: new mongoose.Types.ObjectId(i.productId),
      quantity: Math.max(1, Math.floor(i.quantity)),
    }));
    const itemCount = cartItems.length;
    const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const userDoc = await User.findById(req.userId).select('email').lean();
    const userEmail = userDoc?.email ?? '';
    await Cart.findOneAndUpdate(
      { user: req.userId },
      { $set: { items: cartItems, userEmail, itemCount, totalQuantity } },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Cart saved.' });
  } catch (error) {
    console.error('Save cart error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to save cart.' });
  }
});

export default router;
