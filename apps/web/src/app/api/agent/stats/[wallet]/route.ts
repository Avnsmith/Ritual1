import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  const { wallet } = params;

  return NextResponse.json({
    walletAddress: wallet,
    totalExecutions: 1,
    verifiedExecutions: 1,
    lastExecutionAt: Date.now() - 3600000,
    proofRegistryAddress: '0x23cc1998562c39474623639c18c31d49abd0c310',
    network: 'RitualNet',
    chainId: 1979,
  });
}
