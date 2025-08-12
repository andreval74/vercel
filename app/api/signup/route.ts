
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, walletAddress } = body;
    
    // For wallet-based auth, we primarily use walletAddress
    const identifier = walletAddress || email;
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Wallet address or email is required' },
        { status: 400 }
      );
    }
    
    // Simulate user creation
    return NextResponse.json({
      success: true,
      user: {
        id: identifier,
        email: email || '',
        walletAddress: walletAddress || '',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
