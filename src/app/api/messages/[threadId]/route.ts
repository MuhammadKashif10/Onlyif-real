import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock messages data (same as in main route)
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

// GET /api/messages/[threadId] - Get messages in a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params;
    
    if (!threadId) {
      return NextResponse.json(
        { success: false, error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Filter messages for this conversation
      const conversationMessages = mockMessages
        .filter(msg => msg.conversationId === threadId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      return NextResponse.json({
        success: true,
        data: conversationMessages
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/messages/[threadId] - Mark messages as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params;
    const body = await request.json();
    const { userId } = body;
    
    if (!threadId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Thread ID and User ID are required' },
        { status: 400 }
      );
    }

    if (USE_MOCKS) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mark messages as read for this user
      mockMessages.forEach(msg => {
        if (msg.conversationId === threadId && msg.senderId !== userId) {
          msg.read = true;
        }
      });
      
      return NextResponse.json({
        success: true,
        data: { message: 'Messages marked as read' }
      });
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}