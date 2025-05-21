
const express = require('express');
const TutorialVideo = require('../models/tutorial.model');
const { auth, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all tutorial videos
router.get('/', async (req, res) => {
  try {
    const tutorials = await TutorialVideo.find();
    res.json(tutorials);
  } catch (error) {
    console.error('Get tutorials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tutorial by ID
router.get('/:id', async (req, res) => {
  try {
    const tutorial = await TutorialVideo.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.json(tutorial);
  } catch (error) {
    console.error('Get tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tutorial video (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, type, thumbnailUrl, contentUrl } = req.body;
    
    if (!['login', 'login-mobile', 'cookie', 'cookie-mobile'].includes(type)) {
      return res.status(400).json({ message: 'Invalid tutorial type' });
    }
    
    const tutorial = new TutorialVideo({
      title,
      description,
      type,
      thumbnailUrl,
      contentUrl
    });
    
    await tutorial.save();
    res.status(201).json(tutorial);
  } catch (error) {
    console.error('Create tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tutorial video (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, type, thumbnailUrl, contentUrl } = req.body;
    
    const tutorial = await TutorialVideo.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    if (type && !['login', 'login-mobile', 'cookie', 'cookie-mobile'].includes(type)) {
      return res.status(400).json({ message: 'Invalid tutorial type' });
    }
    
    // Update fields
    if (title) tutorial.title = title;
    if (description !== undefined) tutorial.description = description;
    if (type) tutorial.type = type;
    if (thumbnailUrl) tutorial.thumbnailUrl = thumbnailUrl;
    if (contentUrl) tutorial.contentUrl = contentUrl;
    
    await tutorial.save();
    res.json(tutorial);
  } catch (error) {
    console.error('Update tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tutorial video (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const tutorial = await TutorialVideo.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    await tutorial.deleteOne();
    res.json({ message: 'Tutorial deleted' });
  } catch (error) {
    console.error('Delete tutorial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
