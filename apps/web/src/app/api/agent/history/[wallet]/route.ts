import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  const { wallet } = params;

  return NextResponse.json([
    {
      id: '0x806385953d06110ab17e485d3e78a293f903589057f0eb0fdd16ca333c5fb291',
      prompt: 'Research RitualNet AI precompiles and verify smart contract execution proofs',
      ownerWallet: wallet,
      agentId: 'wowweb-browser-agent-v1',
      createdAt: Date.now() - 3600000,
      status: 'completed',
      proof: {
        transactionHash: '0x9b35cd12e4df67f9613872ee5555dbc2af4c10346427f0f4a58cdff57745c334',
        blockNumber: 54522332,
        isVerified: true,
      },
    },
  ]);
}
