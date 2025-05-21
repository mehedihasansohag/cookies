
const express = require('express');
const Order = require('../models/order.model');
const Plan = require('../models/plan.model');
const { auth, adminOnly, managerOrAbove } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all orders (admin/manager only)
router.get('/', auth, managerOrAbove, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('planId')
      .sort({ createdAt: -1 });
    
    res.json({planId:orders.planId._id,...orders});
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/user', auth, async (req, res) => {
  try {
    console.log("ok")
    const orders = await Order.find({ userId: req.user._id })
      .populate('planId')
      .sort({ createdAt: -1 });
      const transformedData = orders.map((orse) => {
        return {
          _id: orse._id,
          userId: orse.userId,
          userName: orse.userName,
          planId: orse.planId._id,  // Extract only the ObjectId from planId
          planName: orse.planName,
          expirationDate: orse.expirationDate,
          originalPrice: orse.originalPrice,
          finalPrice: orse.finalPrice,
          paymentMethod: orse.paymentMethod,
          lastFourDigits: orse.lastFourDigits,
          paymentLastFour: orse.paymentLastFour,
          couponCode: orse.couponCode,
          couponDiscount: orse.couponDiscount,
          status: orse.status,
          date: orse.date,
          createdAt: orse.createdAt,
          updatedAt: orse.updatedAt,
          __v: orse.__v,
        };
      });
      
      

      res.json(transformedData);
    // res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('planId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (order.userId.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const {
      planId,
      originalPrice,
      lastFourDigits,
      couponCode,
      couponDiscount,
      paymentMethod
    } = req.body;
    
    // Get the plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Calculate final price
    let finalPrice = originalPrice;
    if (couponDiscount) {
      finalPrice = originalPrice - couponDiscount;
    }
    
    // Calculate expiration date based on plan duration
    let expirationDate = null;
    if (plan.durationValue && plan.durationType) {
      expirationDate = new Date();
      
      switch (plan.durationType) {
        case 'minutes':
          expirationDate.setMinutes(expirationDate.getMinutes() + plan.durationValue);
          break;
        case 'hours':
          expirationDate.setHours(expirationDate.getHours() + plan.durationValue);
          break;
        case 'days':
          expirationDate.setDate(expirationDate.getDate() + plan.durationValue);
          break;
        case 'weeks':
          expirationDate.setDate(expirationDate.getDate() + (plan.durationValue * 7));
          break;
        case 'months':
          expirationDate.setMonth(expirationDate.getMonth() + plan.durationValue);
          break;
        case 'years':
          expirationDate.setFullYear(expirationDate.getFullYear() + plan.durationValue);
          break;
      }
    }
    
    const order = new Order({
      userId: req.user._id,
      userName: req.user.name,
      planId,
      planName: plan.name,
      originalPrice,
      finalPrice,
      lastFourDigits,
      paymentLastFour: lastFourDigits, // For backward compatibility
      couponCode,
      couponDiscount,
      expirationDate,
      paymentMethod: paymentMethod || 'credit_card',
      status: 'pending'
    });
    
    await order.save();
    
    // Populate references before returning
    const savedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('planId');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin/manager only)
router.patch('/:id/status', auth, managerOrAbove, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    // Populate references before returning
    const updatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('planId');
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
