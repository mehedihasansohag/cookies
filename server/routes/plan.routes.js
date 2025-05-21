
const express = require('express');
const Plan = require('../models/plan.model');
const { auth, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find().populate('platforms');
    console.log(plans)
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get plan by ID
router.get('/:id', async (req, res) => {
  try {
    console.log("msddsn")
    const plan = await Plan.findById(req.params.id).populate('platforms');
    if (!plan) {
      return res.status(404).json({ message: 'Plan not foundasd..' });
    }
    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create plan (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      platforms,
      durationValue,
      durationType,
      stickerText,
      stickerColor,
      showOnHomepage,
      homepageOrder
    } = req.body;
    
    const plan = new Plan({
      name,
      description,
      price,
      platforms,
      durationValue,
      durationType,
      stickerText,
      stickerColor,
      showOnHomepage,
      homepageOrder
    });
    
    await plan.save();
    
    // Populate platforms before returning
    const savedPlan = await Plan.findById(plan._id).populate('platforms');
    res.status(201).json(savedPlan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plan (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      platforms,
      durationValue,
      durationType,
      stickerText,
      stickerColor,
      showOnHomepage,
      homepageOrder
    } = req.body;
    
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Update fields
    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (platforms) plan.platforms = platforms;
    if (durationValue !== undefined) plan.durationValue = durationValue;
    if (durationType) plan.durationType = durationType;
    if (stickerText !== undefined) plan.stickerText = stickerText;
    if (stickerColor !== undefined) plan.stickerColor = stickerColor;
    if (showOnHomepage !== undefined) plan.showOnHomepage = showOnHomepage;
    if (homepageOrder !== undefined) plan.homepageOrder = homepageOrder;
    
    await plan.save();
    
    // Populate platforms before returning
    const updatedPlan = await Plan.findById(plan._id).populate('platforms');
    res.json(updatedPlan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    await plan.deleteOne();
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
