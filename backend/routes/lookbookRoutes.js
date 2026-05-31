const express = require('express');
const router = express.Router();
const { getPhotos, addPhoto, deletePhoto } = require('../controllers/lookbookController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Route
router.get('/', getPhotos);

// Admin Routes
router.post('/', protect, admin, addPhoto);
router.delete('/:id', protect, admin, deletePhoto);

module.exports = router;