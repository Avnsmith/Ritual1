import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    network: 'RitualNet',
    chainId: 1979,
    timestamp: Date.now(),
  });
}
