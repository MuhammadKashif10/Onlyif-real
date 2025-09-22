const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, brokerage, yearsOfExperience, specialization } = req.body;

    // Block agent registration - agents can only be created by admin
    if (role === 'agent' || brokerage) {
      return res.status(403).json(
        errorResponse('Agents can only be created by admin', 403)
      );
    }

    // Validate required fields
    if (!firstName  || !email || !password) {
      return res.status(400).json(
        errorResponse('First name, last name, email, and password are required', 400)
      );
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json(
        errorResponse('Password must be at least 8 characters long', 400)
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json(
        errorResponse('User already exists with this email', 409)
      );
    }

    // Combine firstName and lastName into name
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    
    // Only allow buyer and seller roles for public registration
    const userRole = role || 'buyer';
    if (!['buyer', 'seller'].includes(userRole)) {
      return res.status(403).json(
        errorResponse('Only buyer and seller accounts can be created through public registration', 403)
      );
    }

    // Prepare user data
    const userData = {
      name: fullName,
      email: email.toLowerCase().trim(),
      password,
      role: userRole
    };

    // Create user
    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(
        errorResponse(`Validation failed: ${validationErrors.join(', ')}`, 400)
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json(
        errorResponse('User already exists with this email', 409)
      );
    }
    
    res.status(500).json(
      errorResponse('Server error during registration', 500)
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json(
        errorResponse('Invalid credentials', 401)
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(
        errorResponse('Invalid credentials', 401)
      );
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json(
      successResponse(
        {
          user,
          token
        },
        'Login successful'
      )
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error during login', 500)
    );
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json(
      successResponse(user, 'User profile retrieved successfully')
    );
  } catch (error) {
    res.status(500).json(
      errorResponse('Server error retrieving user profile', 500)
    );
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json(
        errorResponse('Email or phone number is required', 400)
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find user by email or phone
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 404)
      );
    }

    // Store OTP in user document
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // In production, send OTP via SMS/Email service
    console.log(`OTP for ${email || phone}: ${otp}`);
    
    res.json(
      successResponse(
        { message: 'OTP sent successfully' },
        'OTP sent successfully'
      )
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json(
      errorResponse('Server error sending OTP', 500)
    );
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    
    if (!otp) {
      return res.status(400).json(
        errorResponse('OTP is required', 400)
      );
    }

    // Find user by email or phone and explicitly select OTP fields
    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+otp +otpExpiry');
    
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 404)
      );
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json(
        errorResponse('Invalid OTP', 400)
      );
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json(
        errorResponse('OTP has expired', 400)
      );
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json(
      successResponse(
        {
          user,
          token
        },
        'OTP verified successfully'
      )
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json(
      errorResponse('Server error verifying OTP', 500)
    );
  }
};

// @desc    Admin login (restricted to seeded accounts)
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin user with isSeeded flag
    const user = await User.findOne({ 
      email, 
      role: 'admin',
      isSeeded: true // Only allow seeded admin accounts
    }).select('+password');
    
    if (!user) {
      return res.status(401).json(
        errorResponse('Invalid admin credentials or account not authorized', 401)
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(
        errorResponse('Invalid admin credentials', 401)
      );
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json(
      successResponse(
        {
          user,
          token
        },
        'Admin login successful'
      )
    );
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json(
      errorResponse('Server error during admin login', 500)
    );
  }
};

module.exports = {
  register,
  login,
  getMe,
  sendOtp,
  verifyOtp,
  adminLogin
};