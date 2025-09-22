const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');
const corelogicService = require('../services/corelogicService');
const emailService = require('../services/emailService');
const { successResponse, errorResponse, paginationMeta } = require('../utils/responseFormatter');
const Purchase = require('../models/Purchase');

// @desc    Create property listing
// @route   POST /api/properties
// @access  Private (Seller only)
const createProperty = async (req, res) => {
  try {
    // Only sellers can create properties
    if (req.user.role !== 'seller') {
      return res.status(403).json(
        errorResponse('Only sellers can create property listings', 403)
      );
    }

    const propertyData = {
      ...req.body,
      owner: req.user.id,
      status: 'pending' // Default to pending until media/admin approval
    };

    // Handle image uploads from req.files
    if (req.files && req.files.length > 0) {
      const imagesArray = [];
      let mainImageUrl = null;

      // Process each uploaded file
      req.files.forEach((file, index) => {
        const imageUrl = `/uploads/${file.filename}`; // Adjust path as needed
        
        imagesArray.push({
          url: imageUrl,
          isPrimary: index === 0, // First image is primary
          order: index
        });

        // Set first image as main image
        if (index === 0) {
          mainImageUrl = imageUrl;
        }
      });

      // Set image fields
      propertyData.images = imagesArray;
      propertyData.mainImage = { url: mainImageUrl };
      propertyData.finalImageUrl = { url: mainImageUrl };
    } else {
      // No images uploaded
      propertyData.images = [];
      propertyData.mainImage = { url: null };
      propertyData.finalImageUrl = { url: null };
    }

    const property = await Property.create(propertyData);
    
    res.status(201).json(
      successResponse(property, 'Property listing created successfully')
    );
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json(
      errorResponse('Failed to create property listing', 500)
    );
  }
};

// @desc    Get property details
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    let property;
    const { id } = req.params;
    //   const purchased = await Purchase.findOne({
    //   user: req.user._id,
    //   property: id,
    //   status: 'paid'
    // });

    // if (!purchased) {
    //   return res.status(403).json({ message: 'Payment required to view this property' });
    // }
    // Check if the parameter is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Search by ObjectId
      property = await Property.findById(id)
        .populate('owner', 'name email')
        .populate('agents.agent', 'name email phone');
    } else {
      // Search by slug
      property = await Property.findOne({ slug: id })
        .populate('owner', 'name email')
        .populate('agents.agent', 'name email phone');
    }

    if (!property) {
      return res.status(404).json(
        errorResponse('Property not found', 404)
      );
    }

    // Normalize single property to flat structure
    const propertyObj = property.toObject();
    console.log("🚀 ~ getPropertyById ~ propertyObj:", propertyObj.agents[0].agent._id)
    
    // Normalize address to string format
    const addressString = propertyObj.address && typeof propertyObj.address === 'object' 
      ? `${propertyObj.address.street}, ${propertyObj.address.city}, ${propertyObj.address.state} ${propertyObj.address.zipCode}`
      : propertyObj.address || 'Address not available';
    
    // Get main image URL
    let mainImageUrl = null;
    if (propertyObj.mainImage && propertyObj.mainImage.url) {
      mainImageUrl = propertyObj.mainImage.url;
    } else if (propertyObj.images && propertyObj.images.length > 0 && propertyObj.images[0].url) {
      mainImageUrl = propertyObj.images[0].url;
    }
    
    // Extract contact phone
    const contactPhone = propertyObj.contactInfo && propertyObj.contactInfo.phone 
      ? propertyObj.contactInfo.phone 
      : null;
    
    // Transform coordinates
    let coordinates = null;
    if (propertyObj.location && propertyObj.location.coordinates && propertyObj.location.coordinates.length === 2) {
      coordinates = {
        lng: propertyObj.location.coordinates[0],
        lat: propertyObj.location.coordinates[1]
      };
    }
    
    const normalizedProperty = {
      id: propertyObj._id.toString(),
      title: propertyObj.title || '',
      address: addressString,
      city: propertyObj.address?.city || '',
      state: propertyObj.address?.state || '',
      zipCode: propertyObj.address?.zipCode || '',
      price: propertyObj.price || 0,
      beds: propertyObj.beds || 0,
      baths: propertyObj.baths || 0,
      size: propertyObj.squareMeters || 0,
      yearBuilt: propertyObj.yearBuilt || null,
      propertyType: propertyObj.propertyType || '',
      status: propertyObj.status || 'pending',
      description: propertyObj.description || '',
      features: propertyObj.features || [],
      images: propertyObj.images || [],
      mainImage: mainImageUrl,
      coordinates: coordinates,
      contactPhone: contactPhone,
      featured: propertyObj.featured || false,
      dateListed: propertyObj.dateListed || propertyObj.createdAt,
      daysOnMarket: propertyObj.daysOnMarket || 0,
      slug: propertyObj.slug, // Include slug in response
      agent: propertyObj.agents && propertyObj.agents.length > 0 && propertyObj.agents[0].agent 
        ? {
            id: propertyObj.agents[0].agent._id.toString(),
            name: propertyObj.agents[0].agent.name || 'Agent Name',
            phone: propertyObj.agents[0].agent.phone || contactPhone || '',
            email: propertyObj.agents[0].agent.email || ''
          }
        : null
    };

    res.json(
      successResponse(
        normalizedProperty,
        'Property retrieved successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json(
      errorResponse('Server error while fetching property', 500)
    );
  }
};

// @desc    Update property
// @route   PATCH /api/properties/:id
// @access  Private (Owner/Agent/Admin)
const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Check permissions
  const canEdit = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin' ||
    (property.assignedAgent && req.user.id === property.assignedAgent.toString())
  );

  if (!canEdit) {
    return res.status(403).json(
      errorResponse('Not authorized to edit this property', 403)
    );
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email').populate('assignedAgent', 'name email');

  res.json(
    successResponse(updatedProperty, 'Property updated successfully')
  );
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin only)
const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Only owner or admin can delete
  const canDelete = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin'
  );

  if (!canDelete) {
    return res.status(403).json(
      errorResponse('Not authorized to delete this property', 403)
    );
  }

  await Property.findByIdAndDelete(req.params.id);

  res.json(
    successResponse(null, 'Property deleted successfully')
  );
};

// @desc    Assign agent to property
// @route   POST /api/properties/:id/assign-agent
// @access  Private (Seller only)
const assignAgent = async (req, res) => {
  const { agentId } = req.body;
  
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Only property owner can assign agent
  if (req.user.id !== property.owner.toString()) {
    return res.status(403).json(
      errorResponse('Only property owner can assign agent', 403)
    );
  }

  // Verify agent exists and has correct role
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    return res.status(400).json(
      errorResponse('Invalid agent ID', 400)
    );
  }

  property.assignedAgent = agentId;
  await property.save();

  // Create notification for agent
  await Notification.create({
    user: agentId,
    type: 'new_assignment',
    title: 'New Property Assignment',
    message: `You have been assigned to help with property: ${property.title}`,
    data: { propertyId: property._id, propertyTitle: property.title }
  });

  // Send email notification
  await emailService.sendNotificationEmail(agent, 'new_assignment', {
    propertyTitle: property.title
  });

  res.json(
    successResponse(property, 'Agent assigned successfully')
  );
};

// @desc    Get CoreLogic price check
// @route   GET /api/properties/:id/price-check
// @access  Private (Owner/Agent/Admin)
const getPriceCheck = async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Check permissions
  const canAccess = (
    req.user.id === property.owner.toString() ||
    req.user.role === 'admin' ||
    (property.assignedAgent && req.user.id === property.assignedAgent.toString())
  );

  if (!canAccess) {
    return res.status(403).json(
      errorResponse('Not authorized to access price check', 403)
    );
  }

  try {
    const priceEstimate = await corelogicService.getPriceEstimate(property);
    
    res.json(
      successResponse(priceEstimate, 'Price check completed successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Price check service unavailable', 500)
    );
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 0; // 0 means no limit - show all
  const skip = limit > 0 ? (page - 1) * limit : 0;

  // Build filter object - Updated to include active, pending and public properties
  const filter = { status: { $in: ['active', 'pending', 'public'] } };
  
  if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
  if (req.query.state) filter.state = new RegExp(req.query.state, 'i');
  if (req.query.minPrice) filter.price = { ...filter.price, $gte: req.query.minPrice };
  if (req.query.maxPrice) filter.price = { ...filter.price, $lte: req.query.maxPrice };
  if (req.query.beds) filter.beds = { $gte: req.query.beds };
  if (req.query.baths) filter.baths = { $gte: req.query.baths };
  
  // Add featured filter
  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  const total = await Property.countDocuments(filter);
  
  let query = Property.find(filter)
    .populate('owner', 'name email')
    .populate('agents.agent', 'name email')
    .sort({ featured: -1, dateListed: -1 })
    .skip(skip);
    
  // Only apply limit if specified (> 0)
  if (limit > 0) {
    query = query.limit(limit);
  }
  
  const properties = await query;

  // Normalize properties to flat structure for frontend compatibility
  const normalizedProperties = properties.map(property => {
    const propertyObj = property.toObject();
    
    // Normalize address to string format
    const addressString = propertyObj.address && typeof propertyObj.address === 'object' 
      ? `${propertyObj.address.street}, ${propertyObj.address.city}, ${propertyObj.address.state} ${propertyObj.address.zipCode}`
      : propertyObj.address || 'Address not available';
    
    // Get main image URL - prioritize mainImage, then first image, then null
    let mainImageUrl = null;
    if (propertyObj.mainImage && propertyObj.mainImage.url) {
      mainImageUrl = propertyObj.mainImage.url;
    } else if (propertyObj.images && propertyObj.images.length > 0 && propertyObj.images[0].url) {
      mainImageUrl = propertyObj.images[0].url;
    }
    
    // Extract contact phone from nested contactInfo
    const contactPhone = propertyObj.contactInfo && propertyObj.contactInfo.phone 
      ? propertyObj.contactInfo.phone 
      : null;
    
    // Transform coordinates for frontend
    let coordinates = null;
    if (propertyObj.location && propertyObj.location.coordinates && propertyObj.location.coordinates.length === 2) {
      coordinates = {
        lng: propertyObj.location.coordinates[0], // GeoJSON uses [longitude, latitude]
        lat: propertyObj.location.coordinates[1]
      };
    }
    
    // Return normalized flat structure
    return {
      id: propertyObj._id.toString(), // Convert MongoDB _id to string id
      title: propertyObj.title || '',
      address: addressString, // Flat string address
      city: propertyObj.address?.city || '',
      state: propertyObj.address?.state || '',
      zipCode: propertyObj.address?.zipCode || '',
      price: propertyObj.price || 0,
      beds: propertyObj.beds || 0,
      baths: propertyObj.baths || 0,
      size: propertyObj.squareMeters || 0, // Map squareMeters to size
      yearBuilt: propertyObj.yearBuilt || null,
      propertyType: propertyObj.propertyType || '',
      status: propertyObj.status || 'pending',
      description: propertyObj.description || '',
      features: propertyObj.features || [],
      images: propertyObj.images || [],
      mainImage: mainImageUrl, // Flat string URL instead of object
      coordinates: coordinates,
      contactPhone: contactPhone, // Flat contact phone
      featured: propertyObj.featured || false,
      dateListed: propertyObj.dateListed || propertyObj.createdAt,
      daysOnMarket: propertyObj.daysOnMarket || 0,
      slug: propertyObj.slug, // Add slug to response
      // Agent information (if available)
      agent: propertyObj.agents && propertyObj.agents.length > 0 && propertyObj.agents[0].agent 
        ? {
            id: propertyObj.agents[0].agent._id || propertyObj.agents[0].agent,
            name: propertyObj.agents[0].agent.name || 'Agent Name',
            phone: propertyObj.agents[0].agent.phone || contactPhone || '',
            email: propertyObj.agents[0].agent.email || ''
          }
        : null
    };
  });

  res.json(
    successResponse(
      normalizedProperties,
      'Properties retrieved successfully',
      200,
      paginationMeta(page, limit, total)
    )
  );
};

// Add new function for property stats
const getPropertyStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ status: 'public' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const avgPriceResult = await Property.aggregate([
      { $match: { status: 'public' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    
    const stats = {
      totalProperties: totalProperties || 0,
      soldProperties: soldProperties || 0,
      averagePrice: avgPriceResult[0]?.avgPrice || 0,
      activeListings: totalProperties || 0
    };
    
    res.json(successResponse(stats, 'Property stats retrieved successfully'));
  } catch (error) {
    // Return fallback stats if database query fails
    const fallbackStats = {
      totalProperties: 150,
      soldProperties: 45,
      averagePrice: 450000,
      activeListings: 150
    };
    res.json(successResponse(fallbackStats, 'Property stats retrieved successfully'));
  }
};

// @desc    Get seller's properties
// @route   GET /api/seller/properties
// @access  Private (Seller only)
const getSellerProperties = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json(
      errorResponse('Only sellers can access this endpoint', 403)
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter by owner (current seller)
  const filter = { owner: req.user.id };
  
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('assignedAgent', 'name email')
    .sort({ dateListed: -1 })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse(
      properties,
      'Seller properties retrieved successfully',
      200,
      paginationMeta(page, limit, total)
    )
  );
};

// @desc    Submit property publicly (no authentication required)
// @route   POST /api/properties/public-submit
// @access  Public
const submitPropertyPublic = async (req, res) => {
  try {
    const {
      title, address, city, state, zipCode, price, beds, baths, 
      squareMeters, propertyType, yearBuilt, description, features,
      contactName, contactEmail, contactPhone, images, timeframe,
      latitude = 39.8283, longitude = -98.5795  // Use valid default coordinates
    } = req.body;

    // Validation for required fields
    const requiredFields = {
      title, address, city, state, zipCode, price, beds, baths,
      squareMeters, propertyType, contactName, contactEmail, contactPhone
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create or find user
    let user = await User.findOne({ email: contactEmail });
    if (!user) {
      // Generate a temporary password for public submissions
      const tempPassword = Math.random().toString(36).slice(-12) + 'Temp123!';
      
      user = new User({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        password: tempPassword, // Add temporary password
        role: 'seller',
        isVerified: false
      });
      await user.save();
    }

    // Process images if provided
    const processedImages = images && images.length > 0 
      ? images.map((img, index) => ({
          url: img.url || img.preview || '',
          caption: img.caption || '',
          isPrimary: index === 0,
          order: index
        }))
      : [];

    // Create property data
    const propertyData = {
      owner: user._id,
      title,
      address: {
        street: address,
        city,
        state,
        zipCode,
        country: 'US'
      },
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || -98.5795, parseFloat(latitude) || 39.8283]  // Use valid defaults
      },
      propertyType,
      price: parseFloat(price),
      beds: parseInt(beds),
      baths: parseFloat(baths),
      squareMeters: parseFloat(squareMeters),
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
      description: description || '',
      contactInfo: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone
      },
      images: processedImages,
      status: 'draft'
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully',
      data: {
        propertyId: property._id,
        status: property.status
      }
    });

  } catch (error) {
    console.error('Property submission error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${validationErrors.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during property submission'
    });
  }
};

// @desc    Get filter options for properties
// @route   GET /api/properties/filter-options
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    // Get unique property types
    const propertyTypes = await Property.distinct('propertyType', { status: 'public' });
    
    // Get unique cities
    const cities = await Property.distinct('city', { status: 'public' });
    
    // Get price range
    const priceStats = await Property.aggregate([
      { $match: { status: 'public' } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    // Get size range
    const sizeStats = await Property.aggregate([
      { $match: { status: 'public' } },
      {
        $group: {
          _id: null,
          minSize: { $min: '$squareMeters' },
          maxSize: { $max: '$squareMeters' }
        }
      }
    ]);
    
    const filterOptions = {
      propertyTypes: propertyTypes.filter(type => type), // Remove null/undefined values
      cities: cities.filter(city => city), // Remove null/undefined values
      priceRange: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 1000000
      },
      sizeRange: {
        min: sizeStats[0]?.minSize || 0,
        max: sizeStats[0]?.maxSize || 465 // 5000 sq ft converted to sq m
      }
    };
    
    res.json(
      successResponse(filterOptions, 'Filter options retrieved successfully')
    );
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json(
      errorResponse('Failed to retrieve filter options', 500)
    );
  }
};

// ...    Get user's favorite properties
// @route   GET /api/properties/favorites/:userId?
// @access  Private
const getFavoriteProperties = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Find user's favorite properties
    const user = await User.findById(userId).populate({
      path: 'favorites',
      match: { isDeleted: false, status: { $in: ['active', 'public'] } },
      populate: {
        path: 'owner',
        select: 'name email avatar'
      }
    });

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 404)
      );
    }

    res.json(
      successResponse(
        user.favorites || [],
        'Favorite properties retrieved successfully'
      )
    );
  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    res.status(500).json(
      errorResponse('Failed to fetch favorite properties', 500)
    );
  }
};

// ...    Create property with file uploads
// @route   POST /api/properties/upload
// @access  Private
const createPropertyWithFiles = async (req, res) => {
  console.log('🏠 Creating property with files...');
  
  try {
    // Validate user authentication and role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be logged in to create a property.'
      });
    }

    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only sellers can create property listings.'
      });
    }

    // Extract and validate form data
    const {
      title, street, city, state, zipCode, price, beds, baths,
      squareMeters, propertyType, yearBuilt, description,
      contactName, contactEmail, contactPhone, lotSize
    } = req.body;

    console.log('📝 Form data received:', {
      title, street, city, state, zipCode, price, beds, baths,
      squareMeters, propertyType, contactName, contactEmail
    });

    // Comprehensive field validation
    const requiredFields = {
      title: 'Property title',
      street: 'Street address', 
      city: 'City',
      state: 'State',
      zipCode: 'ZIP code',
      price: 'Price',
      beds: 'Number of bedrooms',
      baths: 'Number of bathrooms',
      squareMeters: 'Square meters',
      propertyType: 'Property type',
      contactName: 'Contact name',
      contactEmail: 'Contact email',
      contactPhone: 'Contact phone'
    };

    const missingFields = [];
    const invalidFields = [];

    // Check for missing required fields
    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = req.body[key];
      if (!value && value !== 0) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: `Please provide the following required fields: ${missingFields.join(', ')}.`,
        missingFields
      });
    }

    // Validate data types and ranges
    try {
      const numericPrice = parseFloat(price);
      const numericBeds = parseInt(beds);
      const numericBaths = parseFloat(baths);
      const numericSquareMeters = parseFloat(squareMeters);
      const numericYearBuilt = yearBuilt ? parseInt(yearBuilt) : undefined;
      const numericLotSize = lotSize ? parseFloat(lotSize) : undefined;

      // Validate numeric ranges
      if (isNaN(numericPrice) || numericPrice <= 0) {
        invalidFields.push('Price must be a positive number');
      }
      if (isNaN(numericBeds) || numericBeds < 0) {
        invalidFields.push('Bedrooms must be a non-negative number');
      }
      if (isNaN(numericBaths) || numericBaths < 0) {
        invalidFields.push('Bathrooms must be a non-negative number');
      }
      if (isNaN(numericSquareMeters) || numericSquareMeters <= 0) {
        invalidFields.push('Square meters must be a positive number');
      }
      if (yearBuilt && (isNaN(numericYearBuilt) || numericYearBuilt < 1800 || numericYearBuilt > new Date().getFullYear() + 2)) {
        invalidFields.push('Year built must be between 1800 and ' + (new Date().getFullYear() + 2));
      }
      if (lotSize && (isNaN(numericLotSize) || numericLotSize < 0)) {
        invalidFields.push('Lot size must be a non-negative number');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        invalidFields.push('Contact email must be a valid email address');
      }

      // Validate ZIP code format
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(zipCode)) {
        invalidFields.push('ZIP code must be in format 12345 or 12345-6789');
      }

      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid field values',
          message: 'Please correct the following errors: ' + invalidFields.join(', '),
          invalidFields
        });
      }
    } catch (validationError) {
      console.error('❌ Data validation error:', validationError);
      return res.status(400).json({
        success: false,
        error: 'Data validation failed',
        message: 'Invalid data format provided. Please check your input values.'
      });
    }

    // Process uploaded files with error handling
    const images = [];
    const floorPlans = [];
    const videos = [];

    try {
      if (req.files) {
        console.log('📁 Processing uploaded files:', Object.keys(req.files));
        
        // Process property images
        if (req.files.images && Array.isArray(req.files.images)) {
          req.files.images.forEach((file, index) => {
            try {
              images.push({
                url: `/uploads/images/${file.filename}`,
                caption: file.originalname,
                isPrimary: index === 0,
                order: index
              });
              console.log(`✅ Processed image ${index + 1}: ${file.filename}`);
            } catch (fileError) {
              console.error(`❌ Error processing image ${index + 1}:`, fileError);
              throw new Error(`Failed to process image file: ${file.originalname}`);
            }
          });
        }

        // Process floor plans
        if (req.files.floorPlans && Array.isArray(req.files.floorPlans)) {
          req.files.floorPlans.forEach((file, index) => {
            try {
              floorPlans.push({
                url: `/uploads/floorplans/${file.filename}`,
                caption: file.originalname,
                order: index
              });
              console.log(`✅ Processed floor plan ${index + 1}: ${file.filename}`);
            } catch (fileError) {
              console.error(`❌ Error processing floor plan ${index + 1}:`, fileError);
              throw new Error(`Failed to process floor plan file: ${file.originalname}`);
            }
          });
        }

        // Process videos
        if (req.files.videos && Array.isArray(req.files.videos)) {
          req.files.videos.forEach((file, index) => {
            try {
              videos.push({
                url: `/uploads/videos/${file.filename}`,
                caption: file.originalname,
                order: index
              });
              console.log(`✅ Processed video ${index + 1}: ${file.filename}`);
            } catch (fileError) {
              console.error(`❌ Error processing video ${index + 1}:`, fileError);
              throw new Error(`Failed to process video file: ${file.originalname}`);
            }
          });
        }
      }
    } catch (fileProcessingError) {
      console.error('❌ File processing error:', fileProcessingError);
      return res.status(400).json({
        success: false,
        error: 'File processing failed',
        message: fileProcessingError.message || 'Failed to process uploaded files.'
      });
    }

    // Use default coordinates for US properties (center of continental US)
    // In production, you should implement proper geocoding
    const defaultCoordinates = [-98.5795, 39.8283]; // Center of continental US

    // Create property data object
    const propertyData = {
      owner: req.user.id, // Use authenticated user's ID
      title: title.trim(),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        zipCode: zipCode.trim(),
        country: 'US'
      },
      location: {
        type: 'Point',
        coordinates: defaultCoordinates
      },
      price: parseFloat(price),
      beds: parseInt(beds),
      baths: parseFloat(baths),
      squareMeters: parseFloat(squareMeters),
      propertyType: propertyType.toLowerCase().replace(/\s+/g, '-'),
      description: description ? description.trim() : '',
      contactInfo: {
        name: contactName.trim(),
        email: contactEmail.trim().toLowerCase(),
        phone: contactPhone.trim()
      },
      images,
      floorPlans,
      videos,
      status: 'active',
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
      lotSize: lotSize ? parseFloat(lotSize) : undefined,
      // Set mainImage to first uploaded image
      mainImage: images.length > 0 ? {
        url: images[0].url,
        caption: images[0].caption
      } : null,
      finalImageUrl: images.length > 0 ? {
        url: images[0].url
      } : null
    };

    console.log('💾 Saving property to database...');
    
    // Save to database with comprehensive error handling
    let savedProperty;
    try {
      const property = new Property(propertyData);
      savedProperty = await property.save();
      console.log('✅ Property saved successfully:', savedProperty._id);
    } catch (dbError) {
      console.error('❌ Database save error:', dbError);
      
      // Handle specific MongoDB validation errors
      if (dbError.name === 'ValidationError') {
        const validationErrors = Object.values(dbError.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Property data validation failed: ' + validationErrors.join(', '),
          validationErrors
        });
      } else if (dbError.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Duplicate entry',
          message: 'A property with similar details already exists.'
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: 'Failed to save property to database. Please try again.'
        });
      }
    }

    // Success response
    console.log('🎉 Property created successfully with files');
    res.status(201).json({
      success: true,
      data: savedProperty,
      message: 'Property created successfully with files',
      filesUploaded: {
        images: images.length,
        floorPlans: floorPlans.length,
        videos: videos.length
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in createPropertyWithFiles:', error);
    
    // Log detailed error for debugging
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while creating the property. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { 
        debug: {
          message: error.message,
          stack: error.stack
        }
      })
    });
  }
};

module.exports = {
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
  createPropertyWithFiles  // Ensure this is exported
};