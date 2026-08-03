import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing walletAddress' }, { status: 400 });
    }

    const nonce = Math.random().toString(36).substring(2, 10);
    const message = `Sign to verify wallet ownership for WowWeb AI Agent on RitualNet (Chain ID: 1979).\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

    return NextResponse.json({ message, nonce });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
