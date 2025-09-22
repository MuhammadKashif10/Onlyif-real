const Property = require('../models/Property');
const CashOffer = require('../models/CashOffer');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get seller overview statistics
// @route   GET /api/seller/:id/overview
// @access  Private (Seller only)
const getSellerOverview = async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    // Verify the seller can only access their own data
    if (req.user.role !== 'seller' || req.user.id !== sellerId) {
      return res.status(403).json(
        errorResponse('Access denied. You can only view your own overview.', 403)
      );
    }

    // Get seller's properties
    const properties = await Property.find({ 
      owner: sellerId, 
      isDeleted: false 
    }).select('_id price status dateListed');

    const propertyIds = properties.map(p => p._id);

    // Get cash offers for seller's properties
    const offers = await CashOffer.find({
      property: { $in: propertyIds },
      isDeleted: false
    }).select('status offerAmount property');

    // Calculate statistics
    const stats = {
      totalOffers: offers.length,
      pendingOffers: offers.filter(offer => 
        ['submitted', 'under_review', 'inspection_scheduled', 'inspection_completed', 'offer_made', 'negotiating'].includes(offer.status)
      ).length,
      acceptedOffers: offers.filter(offer => 
        ['accepted', 'closed'].includes(offer.status)
      ).length,
      averageOfferValue: 0,
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      soldProperties: properties.filter(p => p.status === 'sold').length,
      averagePropertyValue: 0,
      totalViews: 0, // This would need to be calculated from property view counts
      totalInquiries: offers.length // Using offers as inquiries for now
    };

    // Calculate average offer value
    if (offers.length > 0) {
      const validOffers = offers.filter(offer => offer.offerAmount && offer.offerAmount > 0);
      if (validOffers.length > 0) {
        stats.averageOfferValue = Math.round(
          validOffers.reduce((sum, offer) => sum + offer.offerAmount, 0) / validOffers.length
        );
      }
    }

    // Calculate average property value
    if (properties.length > 0) {
      const validProperties = properties.filter(p => p.price && p.price > 0);
      if (validProperties.length > 0) {
        stats.averagePropertyValue = Math.round(
          validProperties.reduce((sum, p) => sum + p.price, 0) / validProperties.length
        );
      }
    }

    // Calculate total views from properties
    const propertiesWithViews = await Property.find({ 
      owner: sellerId, 
      isDeleted: false 
    }).select('viewCount');
    
    stats.totalViews = propertiesWithViews.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    res.json(
      successResponse(
        stats,
        'Seller overview retrieved successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching seller overview:', error);
    res.status(500).json(
      errorResponse('Failed to fetch seller overview', 500)
    );
  }
};

// @desc    Get seller's properties with detailed information
// @route   GET /api/seller/:id/listings
// @access  Private (Seller only)
const getSellerListings = async (req, res) => {
  try {
    const sellerId = req.params.id;
    
    // Verify the seller can only access their own data
    if (req.user.role !== 'seller' || req.user.id !== sellerId) {
      return res.status(403).json(
        errorResponse('Access denied. You can only view your own listings.', 403)
      );
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Optional status filter

    // Build filter
    const filter = { 
      owner: sellerId, 
      isDeleted: false 
    };
    
    if (status) {
      filter.status = status;
    }

    // Get total count
    const total = await Property.countDocuments(filter);

    // Get properties with populated data
    const properties = await Property.find(filter)
      .populate('agents.agent', 'name email phone')
      .select('title address price beds baths squareMeters status images dateListed viewCount daysOnMarket propertyType')
      .sort({ dateListed: -1 })
      .skip(skip)
      .limit(limit);

    // Get offer counts for each property
    const propertyIds = properties.map(p => p._id);
    const offerCounts = await CashOffer.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$property',
          totalOffers: { $sum: 1 },
          pendingOffers: {
            $sum: {
              $cond: [
                {
                  $in: ['$status', ['submitted', 'under_review', 'inspection_scheduled', 'inspection_completed', 'offer_made', 'negotiating']]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Create a map for quick lookup
    const offerCountMap = {};
    offerCounts.forEach(count => {
      offerCountMap[count._id.toString()] = {
        totalOffers: count.totalOffers,
        pendingOffers: count.pendingOffers
      };
    });

    // Enhance properties with offer data
    const enhancedProperties = properties.map(property => {
      const propertyObj = property.toObject();
      const offers = offerCountMap[property._id.toString()] || { totalOffers: 0, pendingOffers: 0 };
      
      return {
        ...propertyObj,
        inquiries: offers.totalOffers,
        pendingInquiries: offers.pendingOffers,
        views: propertyObj.viewCount || 0,
        primaryImage: propertyObj.images?.find(img => img.isPrimary)?.url || propertyObj.images?.[0]?.url || null
      };
    });

    const paginationMeta = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };

    res.json(
      successResponse(
        enhancedProperties,
        'Seller listings retrieved successfully',
        200,
        paginationMeta
      )
    );
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    res.status(500).json(
      errorResponse('Failed to fetch seller listings', 500)
    );
  }
};

// @desc    Get detailed seller analytics with chart data
// @route   GET /api/sellers/:id/analytics
// @access  Private (Seller only)
const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const timeRange = req.query.timeRange || '6months';
    
    // Verify the seller can only access their own data
    if (req.user.role !== 'seller' || req.user.id !== sellerId) {
      return res.status(403).json(
        errorResponse('Access denied. You can only view your own analytics.', 403)
      );
    }

    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default: // 6months
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    // Get seller's properties
    const properties = await Property.find({ 
      owner: sellerId, 
      isDeleted: false,
      dateListed: { $gte: startDate }
    }).select('_id title price status dateListed viewCount');

    const propertyIds = properties.map(p => p._id);

    // Get cash offers for the time period
    const offers = await CashOffer.find({
      property: { $in: propertyIds },
      isDeleted: false,
      createdAt: { $gte: startDate }
    }).select('status offerAmount property createdAt');

    // Calculate basic analytics
    const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const totalInquiries = offers.length;
    const totalOffers = offers.filter(offer => 
      ['offer_made', 'negotiating', 'accepted', 'closed'].includes(offer.status)
    ).length;
    
    const averageViewsPerListing = properties.length > 0 ? Math.round(totalViews / properties.length) : 0;
    const conversionRate = totalViews > 0 ? ((totalOffers / totalViews) * 100).toFixed(1) : 0;

    // Find top performing listing
    const topPerformingListing = properties.reduce((top, current) => {
      if (!top || (current.viewCount || 0) > (top.viewCount || 0)) {
        return current;
      }
      return top;
    }, null);

    // Generate monthly chart data
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      // Count properties listed in this month
      const monthProperties = properties.filter(p => {
        const listedDate = new Date(p.dateListed);
        return listedDate >= monthDate && listedDate < nextMonthDate;
      });
      
      // Count offers made in this month
      const monthOffers = offers.filter(o => {
        const offerDate = new Date(o.createdAt);
        return offerDate >= monthDate && offerDate < nextMonthDate;
      });
      
      // Calculate views for properties listed in this month
      const monthViews = monthProperties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      
      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        views: monthViews,
        inquiries: monthOffers.length,
        offers: monthOffers.filter(o => 
          ['offer_made', 'negotiating', 'accepted', 'closed'].includes(o.status)
        ).length
      });
    }

    const analyticsData = {
      totalViews,
      totalInquiries,
      totalOffers,
      averageViewsPerListing,
      conversionRate: parseFloat(conversionRate),
      topPerformingListing: topPerformingListing ? {
        id: topPerformingListing._id.toString(),
        title: topPerformingListing.title,
        views: topPerformingListing.viewCount || 0
      } : null,
      chartData: monthlyData
    };

    res.json(
      successResponse(
        analyticsData,
        'Seller analytics retrieved successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json(
      errorResponse('Failed to fetch seller analytics', 500)
    );
  }
};

module.exports = {
  getSellerOverview,
  getSellerListings,
  getSellerAnalytics
};