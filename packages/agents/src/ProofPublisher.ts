import { createWalletClient, createPublicClient, http, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ProofMetadata, ritualNet } from '@wowweb/shared';
import { WOWWEB_PROOF_REGISTRY_ADDRESS, WOWWEB_PROOF_REGISTRY_ABI } from '@wowweb/contracts';

const DEFAULT_RELAYER_KEY: Hex = '0xb1e81599d94ac73dc5b3692b6da4ca3019729e9c07bf2b02a27759e3ae971500';

export class ProofPublisher {
  private publicClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: ritualNet,
      transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
    });
  }

  private getWalletClient(privateKeyHex?: string) {
    const key = (privateKeyHex || process.env.RITUAL_PRIVATE_KEY || DEFAULT_RELAYER_KEY) as Hex;
    const account = privateKeyToAccount(key);
    return createWalletClient({
      account,
      chain: ritualNet,
      transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
    });
  }

  async publishProof(proof: ProofMetadata): Promise<ProofMetadata> {
    const walletClient = this.getWalletClient();
    const contractAddress = (process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || WOWWEB_PROOF_REGISTRY_ADDRESS) as `0x${string}`;
    const metadataUri = `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efu1a_${proof.outputHash.slice(2, 10)}`;

    console.log(`📡 [ProofPublisher] Submitting proof transaction to RitualNet...`);
    console.log(`- Contract Address: ${contractAddress}`);
    console.log(`- Execution ID: ${proof.executionId}`);
    console.log(`- Owner Wallet: ${proof.ownerWallet}`);

    try {
      // Broadcast recordProof transaction to RitualNet with explicit gas limit
      const txHash = await walletClient.writeContract({
        address: contractAddress,
        abi: WOWWEB_PROOF_REGISTRY_ABI,
        functionName: 'recordProof',
        gas: 500000n,
        args: [
          proof.executionId,
          proof.promptHash,
          proof.executionHash,
          proof.outputHash,
          proof.visitedUrlsHash,
          proof.agentId,
          proof.ownerWallet,
          metadataUri,
        ],
      });

      console.log(`⏳ [ProofPublisher] Tx broadcasted: ${txHash}. Waiting for RitualNet block confirmation...`);

      // Wait for block confirmation on RitualNet
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log(`✅ [ProofPublisher] Proof Mined on RitualNet! Block: ${receipt.blockNumber}, Status: ${receipt.status}`);

      if (receipt.status !== 'success') {
        throw new Error(`RitualNet transaction reverted: ${txHash}`);
      }

      const explorerUrl = `https://explorer.ritualfoundation.org/tx/${txHash}`;

      return {
        ...proof,
        transactionHash: txHash,
        blockNumber: Number(receipt.blockNumber),
        explorerUrl,
        isVerified: true,
        status: 'Verified',
      };
    } catch (err: any) {
      console.error('❌ [ProofPublisher] RitualNet transaction publication failed:', err?.message || err);
      throw new Error(`Failed to publish proof to RitualNet: ${err?.message || err}`);
    }
  }
}
