import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock conversation data with business rules enforcement
const mockConversations = [
  {
    id: 'conv-1',
    type: 'buyer_agent',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    participants: [
      { userId: 'buyer-1', name: 'John Doe', role: 'buyer', email: 'john@example.com' },
      { userId: 'agent-1', name: 'Sarah Johnson', role: 'agent', email: 'sarah@example.com' }
    ],
    lastMessage: {
      id: 'msg-2',
      senderId: 'agent-1',
      messageText: 'I\'d be happy to show you the property this weekend.',
      timestamp: '2024-01-20T11:15:00Z'
    },
    unreadCount: 1,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  },
  {
    id: 'conv-2',
    type: 'agent_seller',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    participants: [
      { userId: 'agent-1', name: 'Sarah Johnson', role: 'agent', email: 'sarah@example.com' },
      { userId: 'seller-1', name: 'Mike Wilson', role: 'seller', email: 'mike@example.com' }
    ],
    lastMessage: {
      id: 'msg-4',
      senderId: 'seller-1',
      messageText: 'The property is available for viewing this weekend.',
      timestamp: '2024-01-20T12:00:00Z'
    },
    unreadCount: 0,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z'
  }
];

const mockMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'buyer-1',
    messageText: 'Hi, I\'m interested in the property at 123 Main St. Can we schedule a viewing?',
    timestamp: '2024-01-20T10:30:00Z',
    read: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'agent-1',
    messageText: 'I\'d be happy to show you the property this weekend.',
    timestamp: '2024-01-20T11:15:00Z',
    read: false
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'agent-1',
    messageText: 'I have a potential buyer interested in your property.',
    timestamp: '2024-01-20T11:30:00Z',
    read: true
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'seller-1',
    messageText: 'The property is available for viewing this weekend.',
    timestamp: '2024-01-20T12:00:00Z',
    read: true
  }
];

// Business rule enforcement function
function validateMessageParticipants(senderRole: string, recipientRole: string): boolean {
  // No direct buyer-seller communication allowed
  if ((senderRole === 'buyer' && recipientRole === 'seller') ||
      (senderRole === 'seller' && recipientRole === 'buyer')) {
    return false;
  }
  
  // Valid combinations: buyer-agent, agent-seller, agent-agent
  const validCombinations = [
    ['buyer', 'agent'],
    ['agent', 'buyer'],
    ['agent', 'seller'],
    ['seller', 'agent'],
    ['agent', 'agent']
  ];
  
  return validCombinations.some(([role1, role2]) => 
    (senderRole === role1 && recipientRole === role2)
  );
}

// GET /api/messages - Get conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter conversations where user is a participant
      const userConversations = mockConversations.filter(conv => 
        conv.participants.some(p => p.userId === userId)
      );
      
      return NextResponse.json({
        success: true,
        data: userConversations
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a message or create conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, senderId, senderRole, recipientId, recipientRole, messageText, propertyId } = body;
    
    if (!senderId || !messageText) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and message text are required' },
        { status: 400 }
      );
    }

    // Enforce business rules
    if (recipientRole && !validateMessageParticipants(senderRole, recipientRole)) {
      return NextResponse.json(
        { success: false, error: 'Direct communication between buyers and sellers is not allowed. Please communicate through an agent.' },
        { status: 403 }
      );
    }

    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        conversationId: conversationId || `conv-${Date.now()}`,
        senderId,
        messageText,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Add to mock data
      mockMessages.push(newMessage);
      
      // Update conversation's last message
      const conversation = mockConversations.find(c => c.id === newMessage.conversationId);
      if (conversation) {
        conversation.lastMessage = {
          id: newMessage.id,
          senderId: newMessage.senderId,
          messageText: newMessage.messageText,
          timestamp: newMessage.timestamp
        };
        conversation.updatedAt = newMessage.timestamp;
      }
      
      return NextResponse.json({
        success: true,
        data: newMessage
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}