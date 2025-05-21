const express = require('express');
const Cookie = require('../models/cookie.model');
const { auth, adminOnly, managerOrAbove } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all cookies (admin/manager only)
router.get('/', auth, managerOrAbove, async (req, res) => {
  try {
    const cookies = await Cookie.find()
      .populate('platformId')
      .populate('planId');
    
    res.json(cookies);
  } catch (error) {
    console.error('Get cookies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cookies by plan ID
router.get('/plan/:planId', auth, async (req, res) => {
  try {
    // Get all cookies for the plan
    const cookies = await Cookie.find({ planId: req.params.planId })
      .populate('platformId')
      .populate('planId');
    
    // Sort cookies: pinned first, then by updatedAt date
    cookies.sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // If both are pinned, sort by pinnedAt
      if (a.isPinned && b.isPinned && a.pinnedAt && b.pinnedAt) {
        return new Date(a.pinnedAt).getTime() - new Date(b.pinnedAt).getTime();
      }
      
      // Otherwise sort by updatedAt (newest first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    res.json(cookies);
  } catch (error) {
    console.error('Get cookies by plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cookie by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const cookie = await Cookie.findById(req.params.id)
      .populate('platformId')
      .populate('planId');
    
    if (!cookie) {
      return res.status(404).json({ message: 'Cookie not found' });
    }
    
    res.json(cookie);
  } catch (error) {
    console.error('Get cookie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create cookie (admin/manager only)
router.post('/', auth, managerOrAbove, async (req, res) => {
  try {
    const {
      platformId,
      planId,
      name,
      value,
      domain,
      expirationDate,
      cookieData,
      platform,
      isPinned
    } = req.body;
    console.log(name,
      )
    const cookie = new Cookie({
      platformId,
      planId,
      name,
      value,
      domain,
      expirationDate,
      cookieData,
      platform,
      isPinned,
      pinnedAt: isPinned ? new Date() : null
    });
    
    await cookie.save();
    
    // Populate references before returning
    const savedCookie = await Cookie.findById(cookie._id)
      .populate('platformId')
      .populate('planId');
    
    res.status(201).json(savedCookie);
  } catch (error) {
    console.error('Create cookie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cookie (admin/manager only)
router.put('/:id', auth, managerOrAbove, async (req, res) => {
  try {
    const {
      platformId,
      planId,
      name,
      value,
      domain,
      expirationDate,
      cookieData,
      platform,
      isPinned
    } = req.body;
    
    const cookie = await Cookie.findById(req.params.id);
    if (!cookie) {
      return res.status(404).json({ message: 'Cookie not found' });
    }
    
    // Update fields
    if (platformId) cookie.platformId = platformId;
    if (planId) cookie.planId = planId;
    if (name !== undefined) cookie.name = name;
    if (value !== undefined) cookie.value = value;
    if (domain !== undefined) cookie.domain = domain;
    if (expirationDate !== undefined) cookie.expirationDate = expirationDate;
    if (cookieData !== undefined) cookie.cookieData = cookieData;
    if (platform !== undefined) cookie.platform = platform;
    
    // Handle pin status
    if (isPinned !== undefined && cookie.isPinned !== isPinned) {
      cookie.isPinned = isPinned;
      cookie.pinnedAt = isPinned ? new Date() : null;
    }
    
    await cookie.save();
    
    // Populate references before returning
    const updatedCookie = await Cookie.findById(cookie._id)
      .populate('platformId')
      .populate('planId');
    
    res.json(updatedCookie);
  } catch (error) {
    console.error('Update cookie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle pinned status
router.patch('/:id/pin', auth, managerOrAbove, async (req, res) => {
  try {
    const cookie = await Cookie.findById(req.params.id);
    if (!cookie) {
      return res.status(404).json({ message: 'Cookie not found' });
    }
    
    // Toggle the pinned status
    cookie.isPinned = !cookie.isPinned;
    cookie.pinnedAt = cookie.isPinned ? new Date() : null;
    
    await cookie.save();
    
    // Populate references before returning
    const updatedCookie = await Cookie.findById(cookie._id)
      .populate('platformId')
      .populate('planId');
    
    res.json(updatedCookie);
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete cookie (admin/manager only)
router.delete('/:id', auth, managerOrAbove, async (req, res) => {
  try {
    const cookie = await Cookie.findById(req.params.id);
    if (!cookie) {
      return res.status(404).json({ message: 'Cookie not found' });
    }
    
    await cookie.deleteOne();
    res.json({ message: 'Cookie deleted' });
  } catch (error) {
    console.error('Delete cookie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
