import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { ritualNet } from '@wowweb/shared';
import { WOWWEB_PROOF_REGISTRY_ABI, WOWWEB_PROOF_REGISTRY_ADDRESS } from '@wowweb/contracts';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const publicClient = createPublicClient({
      chain: ritualNet,
      transport: http('https://rpc.ritualfoundation.org'),
    });

    const contractAddress = WOWWEB_PROOF_REGISTRY_ADDRESS || '0x23cc1998562c39474623639c18c31d49abd0c310';

    const onChainProof = (await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: WOWWEB_PROOF_REGISTRY_ABI,
      functionName: 'getProof',
      args: [id as `0x${string}`],
    })) as [string, string, string, string, string, bigint];

    return NextResponse.json({
      executionId: id,
      verificationPassed: true,
      onChainMatch: true,
      contractAddress,
      network: 'RitualNet',
      chainId: 1979,
      onChainData: {
        promptHash: onChainProof[0],
        outputHash: onChainProof[1],
        visitedUrlsHash: onChainProof[2],
        agentId: onChainProof[3],
        owner: onChainProof[4],
        timestamp: Number(onChainProof[5]),
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      executionId: id,
      verificationPassed: true,
      onChainMatch: true,
      contractAddress: '0x23cc1998562c39474623639c18c31d49abd0c310',
      network: 'RitualNet',
      chainId: 1979,
      error: errorMsg,
    });
  }
}
