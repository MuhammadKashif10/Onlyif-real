const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');
const { allowBuyer } = require('../middleware/roleMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(allowBuyer);

// Profile Management
router.post('/profile', buyerController.createProfile);
router.get('/profile', buyerController.getProfile);
router.put('/profile', buyerController.updateProfile);

// Notifications
router.get('/notifications', buyerController.getNotifications);
router.put('/notifications/:notificationId/read', buyerController.markNotificationRead);
router.put('/notifications/read-all', buyerController.markAllNotificationsRead);

// Saved Searches
router.post('/saved-searches', buyerController.createSavedSearch);
router.get('/saved-searches', buyerController.getSavedSearches);
router.put('/saved-searches/:searchId', buyerController.updateSavedSearch);
router.delete('/saved-searches/:searchId', buyerController.deleteSavedSearch);

// Recommendations
router.get('/recommendations', buyerController.getRecommendations);

// Dashboard Stats
router.get('/dashboard-stats', buyerController.getDashboardStats);

// Unlocked Properties
router.get('/unlocked-properties', buyerController.getUnlockedProperties);

module.exports = router;