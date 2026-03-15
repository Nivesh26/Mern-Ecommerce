import express from 'express';
import Store from '../models/Store.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

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

// GET /api/store/status – public, returns whether store is open
router.get('/status', async (req, res) => {
  try {
    let doc = await Store.findOne().lean();
    if (!doc) {
      await Store.create({ open: true });
      doc = { open: true };
    }
    res.json({ success: true, storeOpen: doc.open });
  } catch (error) {
    console.error('Get store status error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to get store status.' });
  }
});

// PUT /api/store/status – admin only, set store open/closed
// Body: { storeOpen: boolean }
router.put('/status', protect, requireAdmin, async (req, res) => {
  try {
    const { storeOpen } = req.body;
    if (typeof storeOpen !== 'boolean') {
      return res.status(400).json({ success: false, message: 'storeOpen must be true or false.' });
    }
    const doc = await Store.findOneAndUpdate({}, { $set: { open: storeOpen } }, { new: true, upsert: true });
    res.json({ success: true, storeOpen: doc.open, message: doc.open ? 'Store is now open.' : 'Store is now closed.' });
  } catch (error) {
    console.error('Update store status error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update store status.' });
  }
});

export default router;
