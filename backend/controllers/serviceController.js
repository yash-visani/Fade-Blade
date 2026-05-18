const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new service (Admin only)
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;
    const service = await Service.create({ name, description, category, price, duration });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a service (Admin only)
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Mongoose 6+ uses deleteOne()
    await Service.deleteOne({ _id: req.params.id }); 
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getServices, createService, deleteService };