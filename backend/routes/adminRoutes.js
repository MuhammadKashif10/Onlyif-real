const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { allowAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllUsers,
  toggleUserSuspension,
  deleteUser,
  deleteProperty,
  resetAssignments,
  getTermsLogs,
  changeAdminPassword
} = require('../controllers/adminController');
const Property = require('../models/Property');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// All admin routes require admin role
router.use(authMiddleware, allowAdmin);

router.get('/users', asyncHandler(getAllUsers));
router.patch('/users/:id/suspend', asyncHandler(toggleUserSuspension));
router.delete('/users/:id', asyncHandler(deleteUser));
router.delete('/properties/:id', asyncHandler(deleteProperty));
router.post('/assignments/reset', asyncHandler(resetAssignments));
router.get('/terms-logs', asyncHandler(getTermsLogs));

// Password Change Route
router.post('/change-password', asyncHandler(changeAdminPassword));

// Add this route to your existing adminRoutes.js file
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  try {
    // Get total properties count
    const totalProperties = await Property.countDocuments({ isDeleted: false });
    
    // Get total agents count (users with role 'agent')
    const totalAgents = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    
    // Get total users count (all users except admins)
    const totalUsers = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller', 'agent'] }, 
      isDeleted: false 
    });
    
    // Get pending approvals count (properties with status 'pending')
    const pendingApprovals = await Property.countDocuments({ 
      status: 'pending', 
      isDeleted: false 
    });
    
    // Get recent payments count (transactions from last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = await Transaction.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    });
    
    // Calculate monthly revenue (sum of completed transactions this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenueResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;
    
    const stats = {
      totalProperties,
      totalAgents,
      totalUsers,
      pendingApprovals,
      recentPayments,
      monthlyRevenue
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      data: {
        totalProperties: 0,
        totalAgents: 0,
        totalUsers: 0,
        pendingApprovals: 0,
        recentPayments: 0,
        monthlyRevenue: 0
      }
    });
  }
}));
// Individual count endpoints
router.get('/properties/count', asyncHandler(async (req, res) => {
  try {
    const count = await Property.countDocuments({ isDeleted: false });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching properties count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties count',
      count: 0
    });
  }
}));

router.get('/agents/count', asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching agents count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents count',
      count: 0
    });
  }
}));

router.get('/users/count', asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller', 'agent'] }, 
      isDeleted: false 
    });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users count',
      count: 0
    });
  }
}));

router.get('/payments/monthly-revenue', asyncHandler(async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenueResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const revenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;
    
    res.json({
      success: true,
      revenue
    });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly revenue',
      revenue: 0
    });
  }
}));

router.get('/activity', asyncHandler(async (req, res) => {
  try {
    // Get recent activities from different sources
    const recentProperties = await Property.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name')
      .select('title createdAt status');
    
    const recentAgents = await User.find({ 
      role: 'agent', 
      isDeleted: false 
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');
    
    const recentPayments = await Transaction.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('amount createdAt');
    
    // Format activities
    const activities = [];
    
    recentProperties.forEach(property => {
      activities.push({
        id: `property-${property._id}`,
        type: 'property',
        message: `New property listed: ${property.title}`,
        timestamp: property.createdAt,
        status: property.status
      });
    });
    
    recentAgents.forEach(agent => {
      activities.push({
        id: `agent-${agent._id}`,
        type: 'agent',
        message: `Agent registration: ${agent.name}`,
        timestamp: agent.createdAt,
        status: 'pending'
      });
    });
    
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment._id}`,
        type: 'payment',
        message: `Payment received: $${payment.amount}`,
        timestamp: payment.createdAt,
        status: 'completed'
      });
    });
    
    // Sort by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      activities: activities.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity',
      activities: []
    });
  }
}));
router.delete('/properties/:id', asyncHandler(deleteProperty));
router.post('/assignments/reset', asyncHandler(resetAssignments));
router.get('/terms-logs', asyncHandler(getTermsLogs));

// New stats endpoints as requested
router.get('/stats/properties', asyncHandler(async (req, res) => {
  try {
    const total = await Property.countDocuments({ isDeleted: false });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching properties stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties stats'
    });
  }
}));

router.get('/stats/agents', asyncHandler(async (req, res) => {
  try {
    const total = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching agents stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents stats'
    });
  }
}));

router.get('/stats/users', asyncHandler(async (req, res) => {
  try {
    const total = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller'] }, 
      isDeleted: false 
    });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching users stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users stats'
    });
  }
}));

// Add missing agents endpoint
router.get('/agents', asyncHandler(async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isDeleted: false })
      .select('name email phone isActive createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents'
    });
  }
}));

// Get all properties (admin only)
router.get('/properties', asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    
    // Build query
    let query = { isDeleted: false };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } },
        { 'address.zipCode': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If limit is 0, return all properties without pagination
    if (limit === 0) {
      const properties = await Property.find(query)
        .populate('owner', 'name email')
        .populate('assignedAgent', 'name email')
        .sort({ createdAt: -1 });
      
      return res.json({
        success: true,
        data: properties,
        message: 'Properties fetched successfully'
      });
    }
    
    // With pagination
    const skip = (page - 1) * limit;
    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Property.countDocuments(query);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Properties fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
}));

// Add these routes after the existing properties route
router.patch('/properties/:id/approve', asyncHandler(async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',  // Changed from 'approved' to 'active'
        approvedAt: new Date(),
        approvedBy: req.user._id
      },
      { new: true }
    ).populate('owner', 'name email')
     .populate('assignedAgent', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property,
      message: 'Property approved and activated successfully'
    });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve property'
    });
  }
}));

router.patch('/properties/:id/reject', asyncHandler(async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: property,
      message: 'Property rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject property'
    });
  }
}));

router.patch('/properties/:id/assign-agent', asyncHandler(async (req, res) => {
  try {
    const { agentId } = req.body;
    const propertyId = req.params.id;
    
    // Enhanced validation
    console.log('=== AGENT ASSIGNMENT DEBUG ===');
    console.log('Property ID:', propertyId);
    console.log('Agent ID:', agentId);
    console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
    
    // Validate required fields
    if (!agentId) {
      console.log('ERROR: Missing agentId');
      return res.status(400).json({
        success: false,
        message: 'Agent ID is required'
      });
    }

    // Validate ObjectId format
    if (!agentId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('ERROR: Invalid agentId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID format'
      });
    }

    // Verify agent exists and has correct role
    console.log('Verifying agent exists...');
    const agent = await User.findById(agentId);
    if (!agent) {
      console.log('ERROR: Agent not found');
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    if (agent.role !== 'agent') {
      console.log('ERROR: User is not an agent, role:', agent.role);
      return res.status(400).json({
        success: false,
        message: 'Selected user is not an agent'
      });
    }

    console.log('Agent verified:', { id: agent._id, name: agent.name, role: agent.role });

    // Find the property
    console.log('Searching for property...');
    const property = await Property.findById(propertyId);
    
    if (!property) {
      console.log('ERROR: Property not found');
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    console.log('Property found:', { id: property._id, title: property.title });

    // Check if agent is already assigned
    const existingAgentIndex = property.agents.findIndex(
      agentEntry => agentEntry.agent.toString() === agentId && agentEntry.isActive
    );

    if (existingAgentIndex !== -1) {
      console.log('ERROR: Agent already assigned');
      return res.status(400).json({
        success: false,
        message: 'Agent is already assigned to this property'
      });
    }

    // Add new agent to the agents array
    const newAgent = {
      agent: agentId,
      role: 'listing',
      commissionRate: 3,
      assignedAt: new Date(),
      assignedBy: req.user.id,
      isActive: true
    };
    
    console.log('Adding agent:', newAgent);
    property.agents.push(newAgent);

    // Save the property with validation
    console.log('Saving property...');
    const savedProperty = await property.save({ validateBeforeSave: true });
    console.log('Property saved successfully');

    // Populate the agent details for response
    await savedProperty.populate('agents.agent', 'name email');
    console.log('=== ASSIGNMENT SUCCESSFUL ===');

    res.json({
      success: true,
      data: savedProperty,
      message: 'Agent assigned successfully'
    });
  } catch (error) {
    console.error('=== ASSIGNMENT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to assign agent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

router.patch('/properties/:id', asyncHandler(async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name email')
     .populate('agents.agent', 'name email'); // Fixed: populate agents array instead of assignedAgent
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property'
    });
  }
}));

// Remove this line:
// router.post('/agents', asyncHandler(createAgent));

module.exports = router;