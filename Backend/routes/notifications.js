import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications – current user's notifications (newest first)
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const list = notifications.map((n) => ({
      _id: n._id,
      orderId: n.orderId,
      orderDisplayId: n.orderDisplayId,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    }));
    const unreadCount = await Notification.countDocuments({ user: req.userId, read: false });
    res.json({ success: true, notifications: list, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get notifications.' });
  }
});

// PATCH /api/notifications/:id/read – mark as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.userId });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update.' });
  }
});

export default router;
