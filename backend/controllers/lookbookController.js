const Lookbook = require('../models/Lookbook');

// @desc    Get all Lookbook photos (Public)
// @route   GET /api/lookbook
const getPhotos = async (req, res) => {
  try {
    const photos = await Lookbook.find({}).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lookbook' });
  }
};

// @desc    Add a new photo to the Lookbook (Admin Only)
// @route   POST /api/lookbook
const addPhoto = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const photo = await Lookbook.create({ imageUrl, caption });
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add photo' });
  }
};

// @desc    Delete a photo (Admin Only)
// @route   DELETE /api/lookbook/:id
const deletePhoto = async (req, res) => {
  try {
    const photo = await Lookbook.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(200).json({ message: 'Photo removed from gallery' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete photo' });
  }
};

module.exports = { getPhotos, addPhoto, deletePhoto };