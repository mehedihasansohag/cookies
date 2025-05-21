
const express = require('express');
const Platform = require('../models/platform.model');
const { auth, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all platforms
router.get('/', async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform by ID
router.get('/:id', async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }
    res.json(platform);
  } catch (error) {
    console.error('Get platform error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create platform (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, url, description, logo } = req.body;
    
    const platform = new Platform({
      name,
      url,
      description,
      logo
    });
    
    await platform.save();
    res.status(201).json(platform);
  } catch (error) {
    console.error('Create platform error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update platform (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, url, description, logo } = req.body;
    
    const platform = await Platform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }
    
    if (name) platform.name = name;
    if (url) platform.url = url;
    if (description !== undefined) platform.description = description;
    if (logo) platform.logo = logo;
    
    await platform.save();
    res.json(platform);
  } catch (error) {
    console.error('Update platform error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete platform (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }
    
    await platform.deleteOne();
    res.json({ message: 'Platform deleted' });
  } catch (error) {
    console.error('Delete platform error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
