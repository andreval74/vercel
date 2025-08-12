
import { NextResponse } from 'next/server';

export async function GET() {
  // Simple wallet-based authentication providers
  return NextResponse.json({
    walletConnect: {
      id: 'walletconnect',
      name: 'Wallet Connect',
      type: 'wallet',
      signinUrl: '/auth/wallet',
    },
    metamask: {
      id: 'metamask',
      name: 'MetaMask',
      type: 'wallet',
      signinUrl: '/auth/wallet',
    },
  });
}
