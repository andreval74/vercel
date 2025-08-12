
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, walletAddress } = body;
    
    // For wallet-based auth
    const identifier = walletAddress || email;
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Create a success response with redirect
    const response = NextResponse.redirect(new URL('/dashboard', request.url), 302);
    
    // Set auth cookie
    response.cookies.set('auth-token', 'wallet-auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
