
const express = require('express');
const Notification = require('../models/notification.model');
const { auth, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all notifications for admin
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's notifications
router.get('/user', auth, async (req, res) => {
  try {
    // Get notifications for this user or global notifications (no userId)
    const notifications = await Notification.find({
      $or: [
        { userId: req.user._id },
        { userId: null }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, message, priority, expiresAt, userId } = req.body;
    
    const notification = new Notification({
      title,
      message,
      priority: priority || 'medium',
      expiresAt,
      userId,
      isRead: false
    });
    
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if user is authorized to update this notification
    if (
      notification.userId && 
      notification.userId.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
