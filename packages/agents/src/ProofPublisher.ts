import { createWalletClient, createPublicClient, http, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ProofMetadata, ritualNet } from '@wowweb/shared';
import { WOWWEB_PROOF_REGISTRY_ADDRESS, WOWWEB_PROOF_REGISTRY_ABI } from '@wowweb/contracts';

export class ProofPublisher {
  private publicClient;
  private walletClient;
  private account;

  constructor(privateKeyHex?: string) {
    const key = (privateKeyHex || process.env.RITUAL_PRIVATE_KEY) as Hex;
    if (!key) {
      throw new Error('ProofPublisher initialization failed: RITUAL_PRIVATE_KEY missing from environment.');
    }

    this.account = privateKeyToAccount(key);

    this.publicClient = createPublicClient({
      chain: ritualNet,
      transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: ritualNet,
      transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
    });
  }

  async publishProof(proof: ProofMetadata): Promise<ProofMetadata> {
    const contractAddress = (process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || WOWWEB_PROOF_REGISTRY_ADDRESS) as `0x${string}`;
    const metadataUri = `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efu1a_${proof.outputHash.slice(2, 10)}`;

    console.log(`📡 [ProofPublisher] Submitting proof transaction to RitualNet...`);
    console.log(`- Contract Address: ${contractAddress}`);
    console.log(`- Execution ID: ${proof.executionId}`);
    console.log(`- Owner Wallet: ${proof.ownerWallet}`);

    try {
      // Broadcast recordProof transaction to RitualNet with explicit gas limit
      const txHash = await this.walletClient.writeContract({
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
      // NO FAKE FALLBACKS. If transaction fails, rethrow error to prevent fake proof generation.
      throw new Error(`Failed to publish proof to RitualNet: ${err?.message || err}`);
    }
  }
}
