
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Check for wallet session
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || authHeader !== 'Bearer wallet-auth-token') {
    return NextResponse.json({ user: null });
  }
  
  return NextResponse.json({
    user: {
      id: 'wallet-user',
      walletAddress: '0x1234567890123456789012345678901234567890',
      isAuthenticated: true,
    },
  });
}
