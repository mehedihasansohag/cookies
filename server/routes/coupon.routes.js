
const express = require('express');
const Coupon = require('../models/coupon.model');
const { auth, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all coupons (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().populate('planId');
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get coupons for a specific plan
router.get('/plan/:planId', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      planId: req.params.planId,
      active: true
    }).populate('planId');
    
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons by plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, planId } = req.body;
    
    if (!code || !planId) {
      return res.status(400).json({ message: 'Coupon code and plan ID are required' });
    }
    
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      planId,
      active: true
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }
    
    // Check if coupon is expired
    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { code, discount, planId, expirationDate, active } = req.body;
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      planId,
      expirationDate,
      active: active !== undefined ? active : true
    });
    
    await coupon.save();
    
    // Populate plan before returning
    const savedCoupon = await Coupon.findById(coupon._id).populate('planId');
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update coupon (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { code, discount, planId, expirationDate, active } = req.body;
    
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Check if new code already exists (if code is being changed)
    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon && existingCoupon._id.toString() !== coupon._id.toString()) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      coupon.code = code.toUpperCase();
    }
    
    if (discount !== undefined) coupon.discount = discount;
    if (planId) coupon.planId = planId;
    if (expirationDate !== undefined) coupon.expirationDate = expirationDate;
    if (active !== undefined) coupon.active = active;
    
    await coupon.save();
    
    // Populate plan before returning
    const updatedCoupon = await Coupon.findById(coupon._id).populate('planId');
    res.json(updatedCoupon);
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete coupon (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    await coupon.deleteOne();
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
