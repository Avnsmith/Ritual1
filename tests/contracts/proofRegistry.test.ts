import assert from 'node:assert';
import { createPublicClient, http } from 'viem';
import { ritualNet } from '@wowweb/shared';
import { WOWWEB_PROOF_REGISTRY_ADDRESS, WOWWEB_PROOF_REGISTRY_ABI } from '@wowweb/contracts';

export async function runContractTests() {
  console.log('\n📜 Running RitualNet Contract Interaction Tests...');

  const publicClient = createPublicClient({
    chain: ritualNet,
    transport: http('https://rpc.ritualfoundation.org'),
  });

  // 1. Verify RPC Connection & Block Height
  const blockNumber = await publicClient.getBlockNumber();
  assert.ok(blockNumber > 0n, 'RitualNet block number should be > 0');
  console.log(`  ✅ RitualNet RPC Connection Verified (Block Height: ${blockNumber})`);

  // 2. Read Contract Address & ABI Specs
  assert.strictEqual(WOWWEB_PROOF_REGISTRY_ADDRESS, '0x23cc1998562c39474623639c18c31d49abd0c310');
  assert.ok(WOWWEB_PROOF_REGISTRY_ABI.length > 0, 'Contract ABI should be non-empty');
  console.log('  ✅ WowWebProofRegistry Address & ABI Specifications Verified');
}
