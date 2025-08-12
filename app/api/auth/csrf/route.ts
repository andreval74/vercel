
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    csrfToken: 'wallet-auth-csrf-token',
  });
}
