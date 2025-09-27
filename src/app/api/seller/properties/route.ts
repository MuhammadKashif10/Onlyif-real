import { NextRequest, NextResponse } from 'next/server';

// GET /api/seller/properties - Get seller's properties
export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/seller/properties`;
    
    console.log('🔗 Fetching seller properties from backend:', backendUrl);
    
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      cache: 'no-store',
    });
    
    console.log('📡 Backend response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Backend API error:', response.status, response.statusText);
      return NextResponse.json({
        success: false,
        error: `Backend API error: ${response.status}`,
        data: []
      }, { status: response.status });
    }
    
    const result = await response.json();
    console.log('📦 Backend response data:', result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching seller properties:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to backend',
      data: []
    }, { status: 500 });
  }
}