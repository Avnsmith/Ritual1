import { createWalletClient, createPublicClient, http, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ritualNet } from '@wowweb/shared';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import compiledArtifact from '../src/compiledContract.json';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const privateKey = process.env.RITUAL_PRIVATE_KEY as Hex;

if (!privateKey) {
  console.error('Error: RITUAL_PRIVATE_KEY missing from environment.');
  process.exit(1);
}

async function main() {
  console.log('🚀 Deploying REAL WowWebProofRegistry Smart Contract to RitualNet (Chain ID: 1979)...');

  const account = privateKeyToAccount(privateKey);
  console.log(`- Deployer Address: ${account.address}`);

  const publicClient = createPublicClient({
    chain: ritualNet,
    transport: http('https://rpc.ritualfoundation.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: ritualNet,
    transport: http('https://rpc.ritualfoundation.org'),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`- Deployer Balance: ${balance.toString()} wei (${Number(balance) / 1e18} RITUAL)`);

  console.log('📡 Broadcasting contract deployment transaction to RitualNet...');

  const deployHash = await walletClient.deployContract({
    abi: compiledArtifact.abi,
    bytecode: compiledArtifact.bytecode as Hex,
  });

  console.log(`- Contract Deployment Tx Hash: ${deployHash}`);
  console.log('⏳ Waiting for transaction confirmation on RitualNet...');

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: deployHash,
  });

  if (!receipt.contractAddress) {
    throw new Error('Contract deployment failed: No contract address returned in receipt.');
  }

  const deployedAddress = receipt.contractAddress;
  console.log('\n🎉 REAL Smart Contract Successfully Deployed on RitualNet!');
  console.log(`- Contract Address: ${deployedAddress}`);
  console.log(`- Transaction Hash: ${receipt.transactionHash}`);
  console.log(`- Block Number: ${receipt.blockNumber}`);
  console.log(`- Explorer Link: https://explorer.ritualfoundation.org/address/${deployedAddress}`);

  const deploymentData = {
    deployerAccount: account.address,
    contractAddress: deployedAddress,
    transactionHash: receipt.transactionHash,
    blockNumber: Number(receipt.blockNumber),
    explorerUrl: `https://explorer.ritualfoundation.org/address/${deployedAddress}`,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, '../deployment_receipt.json'),
    JSON.stringify(deploymentData, null, 2)
  );

  // Update .env files across workspace with the new deployed contract address
  const envFiles = [
    path.join(__dirname, '../../../.env'),
    path.join(__dirname, '../../../apps/server/.env'),
    path.join(__dirname, '../.env'),
  ];

  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(
        /NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS=".*"/g,
        `NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS="${deployedAddress}"`
      );
      fs.writeFileSync(file, content);
    }
  }

  console.log('✅ Updated workspace .env files with new contract address!');
}

main().catch(err => {
  console.error('Deployment Error:', err);
  process.exit(1);
});
