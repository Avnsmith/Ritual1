import compiledArtifact from './compiledContract.json';

export const WOWWEB_PROOF_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || '0x23cc1998562c39474623639c18c31d49abd0c310') as `0x${string}`;

export const WOWWEB_PROOF_REGISTRY_ABI = compiledArtifact.abi;

export const WOWWEB_PROOF_REGISTRY_BYTECODE = compiledArtifact.bytecode as `0x${string}`;

export { compiledArtifact };
