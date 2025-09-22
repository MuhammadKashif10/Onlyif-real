import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Mock notification data
const mockNotifications = {
  seller: [
    {
      id: '1',
      userId: 'seller1',
      userType: 'seller' as const,
      type: 'property_unlocked' as const,
      title: 'Property Unlocked',
      message: 'Your property "Modern Downtown Condo" has been unlocked by a buyer.',
      data: { propertyId: 'prop1', buyerId: 'buyer1' },
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '2',
      userId: 'seller1',
      userType: 'seller' as const,
      type: 'inspection_booked' as const,
      title: 'Inspection Scheduled',
      message: 'An inspection has been booked for your property on Jan 25, 2024 at 2:00 PM.',
      data: { propertyId: 'prop1', inspectionDate: '2024-01-25T14:00:00Z' },
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '3',
      userId: 'seller1',
      userType: 'seller' as const,
      type: 'inquiry_received' as const,
      title: 'New Inquiry Received',
      message: 'You have received a new inquiry about your property from a potential buyer.',
      data: { propertyId: 'prop1', buyerId: 'buyer2' },
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    }
  ],
  buyer: [
    {
      id: '4',
      userId: 'buyer1',
      userType: 'buyer' as const,
      type: 'new_match' as const,
      title: 'New Property Match',
      message: 'A new property matching your criteria has been listed: "Luxury Waterfront Villa".',
      data: { propertyId: 'prop2', matchScore: 95 },
      read: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '5',
      userId: 'buyer1',
      userType: 'buyer' as const,
      type: 'status_update' as const,
      title: 'Property Status Updated',
      message: 'The status of "Modern Downtown Condo" has been updated to "Under Review".',
      data: { propertyId: 'prop1', oldStatus: 'available', newStatus: 'under_review' },
      read: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '6',
      userId: 'buyer1',
      userType: 'buyer' as const,
      type: 'inspection_scheduled' as const,
      title: 'Inspection Confirmed',
      message: 'Your inspection for "Modern Downtown Condo" has been confirmed for Jan 25, 2024.',
      data: { propertyId: 'prop1', inspectionDate: '2024-01-25T14:00:00Z' },
      read: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    }
  ],
  agent: [
    {
      id: '7',
      userId: 'agent1',
      userType: 'agent' as const,
      type: 'new_assignment' as const,
      title: 'New Property Assignment',
      message: 'You have been assigned to manage "Suburban Family Home" by the seller.',
      data: { propertyId: 'prop3', sellerId: 'seller2' },
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '8',
      userId: 'agent1',
      userType: 'agent' as const,
      type: 'inspection_booked' as const,
      title: 'Inspection Booked',
      message: 'An inspection has been booked for your assigned property "Modern Downtown Condo".',
      data: { propertyId: 'prop1', inspectionDate: '2024-01-25T14:00:00Z', buyerId: 'buyer1' },
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    },
    {
      id: '9',
      userId: 'agent1',
      userType: 'agent' as const,
      type: 'inquiry_received' as const,
      title: 'Client Inquiry',
      message: 'You have received a new inquiry from a client about property availability.',
      data: { clientId: 'buyer3', inquiryType: 'availability' },
      read: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      emailSent: true
    }
  ]
};

// Helper function to get user info from headers (mock implementation)
function getUserFromHeaders() {
  // In a real implementation, this would decode JWT token
  return {
    id: 'user1',
    userType: 'buyer' as 'buyer' | 'seller' | 'agent'
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all'; // 'all', 'unread', 'read'
    
    // Get user info (in real app, this would come from JWT)
    const user = getUserFromHeaders();
    
    // Get notifications for user type
    let userNotifications = mockNotifications[user.userType] || [];
    
    // Apply filters
    if (filter === 'unread') {
      userNotifications = userNotifications.filter(n => !n.read);
    } else if (filter === 'read') {
      userNotifications = userNotifications.filter(n => n.read);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          page,
          limit,
          total: userNotifications.length,
          pages: Math.ceil(userNotifications.length / limit)
        },
        unreadCount: userNotifications.filter(n => !n.read).length
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, data, targetUserId, targetUserType } = body;
    
    // Validate required fields
    if (!type || !title || !message || !targetUserId || !targetUserType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new notification
    const newNotification = {
      id: Date.now().toString(),
      userId: targetUserId,
      userType: targetUserType,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
      emailSent: false
    };
    
    // In a real implementation, this would save to database
    // For now, we'll just return the created notification
    
    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}