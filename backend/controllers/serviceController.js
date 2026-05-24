const Service = require('../models/Service');

// ==========================================
// PUBLIC FUNCTION
// ==========================================
// @desc    Get all services for the Booking Page
// @route   GET /api/services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching services', error: error.message });
  }
};

// ==========================================
// ADMIN FUNCTIONS
// ==========================================
// @desc    Create a brand new service
// @route   POST /api/services
// @desc    Create a brand new service
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const { name, price, duration, description, category } = req.body;
    
    const service = await Service.create({
      name,
      price,
      duration,
      description,
      category: category || 'Haircut' // <-- FIXED: Automatically sets a category!
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// @desc    Update an existing service
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const { name, price, duration, description, category } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price, duration, description, category: category || 'Haircut' }, // <-- FIXED
      { new: true } 
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

// @desc    Delete a service completely
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service successfully removed from the menu' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};