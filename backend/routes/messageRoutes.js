const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { messageLimiter } = require('../middleware/rateLimitMiddleware');
const { validateMessage, validateMongoId } = require('../middleware/validationMiddleware');
const { enforceMessageRouting } = require('../middleware/messageSecurityMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendMessage, getConversation, getUserThreads } = require('../controllers/messageController');

router.get('/', authMiddleware, asyncHandler(getUserThreads));
router.post('/', authMiddleware, messageLimiter, validateMessage, enforceMessageRouting, asyncHandler(sendMessage));
router.get('/:threadId', authMiddleware, validateMongoId, asyncHandler(getConversation));

module.exports = router;