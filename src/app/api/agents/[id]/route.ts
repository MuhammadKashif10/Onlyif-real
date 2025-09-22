import { NextRequest, NextResponse } from 'next/server';
import { USE_MOCKS } from '@/utils/mockWrapper';

// Mock agents data removed - using real database only
const mockAgents: any[] = [];

// GET /api/agents/[id] - Get agent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    
    if (USE_MOCKS) {
      // Return not found since all mock agents have been removed
      return NextResponse.json(
        { success: false, error: 'Mock agents removed - agent not found', message: 'Only real user-registered agents are available' },
        { status: 404 }
      );
    }
    
    // Real API implementation would go here
    return NextResponse.json(
      { success: false, error: 'Real API not implemented yet' },
      { status: 501 }
    );
    
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}