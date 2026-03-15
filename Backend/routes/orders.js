import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const TAX_RATE = 0.13;

// POST /api/orders – create order from cart (logged-in user), then clear cart
router.post('/', protect, async (req, res) => {
  try {
    const { items: itemsBody, paymentMethod = 'cod' } = req.body;
    if (!Array.isArray(itemsBody) || itemsBody.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }
    const valid = itemsBody.every(
      (i) =>
        i &&
        i.productId &&
        typeof i.productName === 'string' &&
        typeof i.quantity === 'number' &&
        i.quantity >= 1 &&
        typeof i.price === 'number' &&
        i.price >= 0
    );
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Each item must have productId, productName, quantity, and price.' });
    }

    const user = await User.findById(req.userId).select('fullName email').lean();
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const items = itemsBody.map((i) => ({
      productId: i.productId,
      productName: String(i.productName).trim(),
      quantity: Math.max(1, Math.floor(i.quantity)),
      price: Number(i.price),
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;

    const order = await Order.create({
      user: req.userId,
      customerName: user.fullName,
      customerEmail: user.email,
      items,
      subtotal,
      tax,
      total,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'cod',
    });

    await Cart.findOneAndUpdate({ user: req.userId }, { $set: { items: [], itemCount: 0, totalQuantity: 0 } });

    const orderObj = order.toObject();
    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: {
        _id: orderObj._id,
        id: `ORD-${String(orderObj._id).slice(-6).toUpperCase()}`,
        customerName: orderObj.customerName,
        customerEmail: orderObj.customerEmail,
        items: orderObj.items,
        subtotal: orderObj.subtotal,
        tax: orderObj.tax,
        total: orderObj.total,
        status: orderObj.status,
        paymentMethod: orderObj.paymentMethod,
        createdAt: orderObj.createdAt,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create order.' });
  }
});

// GET /api/orders/my-orders – list current user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    const ordersForClient = orders.map((o) => ({
      _id: o._id,
      id: `ORD-${String(o._id).slice(-6).toUpperCase()}`,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      date: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : '',
      status: o.status,
      items: o.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
      })),
      total: o.total,
    }));
    res.json({ success: true, orders: ordersForClient });
  } catch (error) {
    console.error('My orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get orders.' });
  }
});

// GET /api/orders – list all orders (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const admin = await User.findById(req.userId).select('role').lean();
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized. Admin only.' });
    }
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    const ordersForClient = orders.map((o) => ({
      _id: o._id,
      id: `ORD-${String(o._id).slice(-6).toUpperCase()}`,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      date: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : '',
      status: o.status,
      items: o.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
      })),
      total: o.total,
    }));
    res.json({ success: true, orders: ordersForClient });
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to list orders.' });
  }
});

// PUT /api/orders/:id/status – update order status (admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const admin = await User.findById(req.userId).select('role').lean();
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized. Admin only.' });
    }
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    order.status = status;
    await order.save();

    const orderDisplayId = `ORD-${String(order._id).slice(-6).toUpperCase()}`;
    const message = `Your order ${orderDisplayId} status is now ${status}.`;
    await Notification.create({
      user: order.user,
      orderId: order._id,
      orderDisplayId,
      message,
    });

    res.json({ success: true, order: order.toObject() });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update status.' });
  }
});

export default router;
