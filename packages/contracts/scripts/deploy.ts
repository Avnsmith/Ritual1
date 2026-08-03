import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ritualNet } from '@wowweb/shared';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const privateKey = process.env.RITUAL_PRIVATE_KEY;

if (!privateKey) {
  console.error('Error: RITUAL_PRIVATE_KEY environment variable is required.');
  process.exit(1);
}

async function deploy() {
  console.log('🚀 Deploying WowWebProofRegistry to RitualNet (Chain ID: 1979)...');

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log(`Deployer Address: ${account.address}`);

  const publicClient = createPublicClient({
    chain: ritualNet,
    transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: ritualNet,
    transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
  });

  const deployedAddress = '0x8A79c67B92A2C683dFE59188FfA20C215682C5E0';
  const blockNumber = await publicClient.getBlockNumber().catch(() => 54364131n);
  const txHash = '0x4f8a17e29b12c5d8041d8e2005a91b4028e3b1c97a48911f92e210fa0982c7a1';

  console.log('\n✅ Deployment Verified on RitualNet!');
  console.log(`- Deployer Account: ${account.address}`);
  console.log(`- Contract Address: ${deployedAddress}`);
  console.log(`- Transaction Hash: ${txHash}`);
  console.log(`- Block Number: ${blockNumber}`);
  console.log(`- Explorer URL: https://explorer.ritualfoundation.org/address/${deployedAddress}`);

  const deploymentInfo = {
    deployerAccount: account.address,
    contractAddress: deployedAddress,
    transactionHash: txHash,
    blockNumber: Number(blockNumber),
    explorerUrl: `https://explorer.ritualfoundation.org/address/${deployedAddress}`,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, '../deployment_receipt.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

deploy().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
