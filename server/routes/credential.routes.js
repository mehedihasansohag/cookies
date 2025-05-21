
const express = require('express');
const Credential = require('../models/credential.model');
const { auth, adminOnly, managerOrAbove } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all credentials (admin/manager only)
router.get('/', auth, managerOrAbove, async (req, res) => {
  try {
    const credentials = await Credential.find()
      .populate('platformId')
      .populate('planId');
    
    res.json(credentials);
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get credentials by plan ID
router.get('/plan/:planId', auth, async (req, res) => {
  try {
    const credentials = await Credential.find({ planId: req.params.planId })
      .populate('platformId')
      .populate('planId')
      .sort({ updatedAt: -1 });
    
    res.json(credentials);
  } catch (error) {
    console.error('Get credentials by plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get credential by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)
      .populate('platformId')
      .populate('planId');
    
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    res.json(credential);
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create credential (admin/manager only)
router.post('/', auth, managerOrAbove, async (req, res) => {
  try {
    const {
      platformId,
      planId,
      username,
      password,
      email,
      notes,
      domain,
      platform
    } = req.body;
    
    const credential = new Credential({
      platformId,
      planId,
      username,
      password,
      email,
      notes,
      domain,
      platform
    });
    
    await credential.save();
    
    // Populate references before returning
    const savedCredential = await Credential.findById(credential._id)
      .populate('platformId')
      .populate('planId');
    
    res.status(201).json(savedCredential);
  } catch (error) {
    console.error('Create credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update credential (admin/manager only)
router.put('/:id', auth, managerOrAbove, async (req, res) => {
  try {
    const {
      platformId,
      planId,
      username,
      password,
      email,
      notes,
      domain,
      platform
    } = req.body;
    
    const credential = await Credential.findById(req.params.id);
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    // Update fields
    if (platformId) credential.platformId = platformId;
    if (planId) credential.planId = planId;
    if (username !== undefined) credential.username = username;
    if (password !== undefined) credential.password = password;
    if (email !== undefined) credential.email = email;
    if (notes !== undefined) credential.notes = notes;
    if (domain !== undefined) credential.domain = domain;
    if (platform !== undefined) credential.platform = platform;
    
    await credential.save();
    
    // Populate references before returning
    const updatedCredential = await Credential.findById(credential._id)
      .populate('platformId')
      .populate('planId');
    
    res.json(updatedCredential);
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete credential (admin/manager only)
router.delete('/:id', auth, managerOrAbove, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id);
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    await credential.deleteOne();
    res.json({ message: 'Credential deleted' });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
