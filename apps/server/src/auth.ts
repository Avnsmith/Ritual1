import { verifyMessage } from 'viem';

export function createNonceMessage(address: string, nonce: string): string {
  return `Sign to verify wallet ownership for WowWeb AI Agent on RitualNet (Chain ID: 1979).\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
}

export async function verifyWalletSignature(
  address: `0x${string}`,
  signature: `0x${string}`,
  message: string
): Promise<boolean> {
  try {
    const valid = await verifyMessage({
      address,
      message,
      signature,
    });
    return valid;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
