import { NextRequest, NextResponse } from 'next/server';

// GET /api/agent/[agentId]/properties - Get agent's assigned properties
export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId;
    
    // TODO: Connect to your real backend API
    // const response = await fetch(`${process.env.BACKEND_URL}/api/agent/${agentId}/properties`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const data = await response.json();
    // return NextResponse.json(data);
    
    // For now, return empty array (no assigned properties)
    return NextResponse.json({
      success: true,
      data: []
    });
    
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent properties' },
      { status: 500 }
    );
  }
}