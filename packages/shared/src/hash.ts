import { keccak256, toHex } from 'viem';

export function hashString(input: string): `0x${string}` {
  if (!input) return keccak256(toHex(''));
  return keccak256(toHex(input));
}

export function hashArray(items: string[]): `0x${string}` {
  const joined = items.sort().join('|');
  return hashString(joined);
}

export function generateExecutionId(): `0x${string}` {
  const randomStr = `${Date.now()}-${Math.random()}-${Math.random()}`;
  return hashString(randomStr);
}
