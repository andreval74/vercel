
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, signature } = body;
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Simulate wallet-based authentication
    return NextResponse.json({
      success: true,
      user: {
        id: walletAddress,
        walletAddress,
        isAuthenticated: true,
      },
      token: 'wallet-auth-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
