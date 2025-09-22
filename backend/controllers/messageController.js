const MessageThread = require('../models/MessageThread');
const User = require('../models/User');
const Property = require('../models/Property');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');

// @desc    Get all message threads for user
// @route   GET /api/messages
// @access  Private
const getMessageThreads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const threads = await MessageThread.find({
      participants: req.user.id
    })
    .populate('participants', 'name email avatar role')
    .populate('property', 'title address price')
    .populate('lastMessage.sender', 'name')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await MessageThread.countDocuments({
      participants: req.user.id
    });

    res.json(
      successResponse(
        threads,
        'Message threads retrieved successfully',
        200,
        paginationMeta(page, limit, total)
      )
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error retrieving message threads', 500)
    );
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { recipientId, propertyId, content, threadId } = req.body;

    let thread;

    if (threadId) {
      // Add to existing thread
      thread = await MessageThread.findById(threadId);
      if (!thread) {
        return res.status(404).json(
          errorResponse('Message thread not found', 404)
        );
      }

      // Check if user is participant
      if (!thread.participants.includes(req.user.id)) {
        return res.status(403).json(
          errorResponse('Not authorized to send message in this thread', 403)
        );
      }
    } else {
      // Create new thread or find existing
      const participants = [req.user.id, recipientId].sort();
      
      thread = await MessageThread.findOne({
        participants: { $all: participants },
        property: propertyId
      });

      if (!thread) {
        thread = await MessageThread.create({
          participants,
          property: propertyId,
          messages: []
        });
      }
    }

    // Add message to thread
    const newMessage = {
      sender: req.user.id,
      content,
      timestamp: new Date(),
      read: false
    };

    thread.messages.push(newMessage);
    thread.lastMessage = {
      sender: req.user.id,
      content,
      timestamp: new Date()
    };
    thread.updatedAt = new Date();

    await thread.save();

    // Populate the thread for response
    await thread.populate([
      { path: 'participants', select: 'name email avatar role' },
      { path: 'property', select: 'title address price' },
      { path: 'messages.sender', select: 'name' }
    ]);

    res.status(201).json(
      successResponse(thread, 'Message sent successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error sending message', 500)
    );
  }
};

module.exports = {
  getMessageThreads,
  sendMessage
};