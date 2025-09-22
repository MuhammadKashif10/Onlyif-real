const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadFields } = require('../middleware/uploadMiddleware');

// Import all controller functions
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  assignAgent,
  getPriceCheck,
  getSellerProperties,
  getPropertyStats,
  submitPropertyPublic,
  getFilterOptions,
  getFavoriteProperties,
  createPropertyWithFiles
} = require('../controllers/propertyController');

// Public routes
router.get('/', asyncHandler(getAllProperties));
router.get('/stats', asyncHandler(getPropertyStats));
router.get('/filter-options', asyncHandler(getFilterOptions));
router.get('/favorites/:userId?', authMiddleware, asyncHandler(getFavoriteProperties));
router.get('/:id', asyncHandler(getPropertyById));
router.get('/:id/price-check', asyncHandler(getPriceCheck));
router.post('/public-submit', asyncHandler(submitPropertyPublic));

// Protected routes (require authentication)
router.post('/', authMiddleware, asyncHandler(createProperty));
router.put('/:id', authMiddleware, asyncHandler(updateProperty));
router.delete('/:id', authMiddleware, asyncHandler(deleteProperty));
router.post('/:id/assign-agent', authMiddleware, asyncHandler(assignAgent));

// File upload route - this handles property creation with files
router.post('/upload', authMiddleware, uploadFields, asyncHandler(createPropertyWithFiles));

module.exports = router;