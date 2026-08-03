---
id: faq
title: "FAQ"
category: "Reference"
---

# FAQ

Why autonomous agents are coming, and why they need a chain built for them rather than retrofitted around them.

1

### Why can't I just run an AI agent on any EVM chain with an off-chain bot?

Nothing stops you, but nobody can verify it. An off-chain bot that claims it ran a model and got a particular result is indistinguishable from a bot that fabricated the result. On Ritual, agent execution runs inside TEE enclaves. The executor's attestation is registered on-chain via TEEServiceRegistry and validated before the builder accepts results. Inputs are ECIES-encrypted to the executor's public key, so only the enclave can decrypt and execute. The result is bound to the request at the hardware level, not by social trust in a bot operator.

2

### What does "enshrined" mean and why does it matter for agents?

Smart contracts cannot enforce transaction-level constraints on themselves. Enshrined means the agent infrastructure is part of the chain's execution layer: the block builder enforces the sender lock, the async lifecycle is tracked via transaction types (TxAsyncCommitment, TxAsyncSettlement), and the Scheduler is a system contract invoked by the block proposer. You cannot replicate these behaviors on a vanilla EVM chain because they require modifications to the block builder, the transaction pool, and the consensus rules. A Solidity library can approximate the API. It cannot approximate the enforcement.

3

### How does Ritual prevent an executor from lying about what the LLM actually said?

Trusted Execution Environments (TEEs). The executor runs the model inside a hardware enclave that produces attestation evidence of what workload ran. This attestation is registered on-chain: TEEServiceRegistry stores the executor's public key, attestation hash, and capability set. The builder only accepts results from registered executors with valid, unexpired attestations. The executor cannot modify the output without invalidating the attestation, because the attestation covers the enclave's code and data.

4

### Why do agents need their own keys? Can't they just use the deployer's wallet?

If the agent uses the deployer's key, the deployer can impersonate the agent, decrypt its stored state, or revoke its ability to transact. The agent is a puppet. DKMS derives a secp256k1 keypair inside the TEE, bound to the sender's Ethereum address. The private key never leaves the enclave. The agent's persistent state (DA content) is encrypted with this key, so no one outside the TEE can read it. The deployer funds the agent, the agent controls its own identity.

5

### What happens to an agent's memory when the executor goes down?

The agent's state lives in external storage, not in the executor. StorageRef tuples point to HuggingFace, GCS, Pinata, or inline data. All DA content is encrypted with a DKMS-derived key that is bound to the sender's address, not the executor. If executor A goes down, executor B derives the same key via DKMS, downloads the encrypted state, and resumes. No migration step. The agent is portable across executors by default.

6

### Why is one pending async job per wallet a feature and not a bug?

If you need N concurrent agents, use N wallets. The sender lock (enforced by AsyncJobTracker at the block builder level) prevents a single EOA from flooding the executor fleet with simultaneous commitments. The constraint is per-sender, not system-wide. For automation, the Scheduler bypasses the sender lock entirely because scheduled transactions are system transactions from a different sender (the block proposer). One wallet, one in-flight job, no exceptions except for scheduled calls.

7

### How do agents pay for things without exposing credentials on-chain?

Secrets are ECIES-encrypted to the executor's public key before submission. The ciphertext is on-chain but unreadable outside the TEE. Inside the enclave, the executor decrypts the secrets JSON and replaces template placeholders (`{{API_KEY}}` in URLs, headers, or body fields) with the real values before execution. At no point does a plaintext credential appear on-chain, in logs, or in the transaction receipt. The encryption uses AES-256-GCM with 12-byte nonces. Getting the nonce length wrong is the single most common integration failure.

8

### What stops someone from front-running an agent's transactions?

Within the async lifecycle, there is no mempool window to exploit. The builder creates TxAsyncCommitment as a system transaction and replays the original transaction with the result injected at settlement. The sender lock means the agent's EOA has exactly one pending commitment, so there is no second transaction to sandwich. For contract-level ordering beyond the async lifecycle, Sequencing Rights is a separate mechanism: a contract declares function priority, the builder orders transactions to match, and a block violating the declared ordering is invalid.

9

### Can an agent call another agent?

Not in the same transaction. The one-async-precompile-per-transaction constraint is absolute. But Agent A's Phase 2 callback is a fresh transaction from AsyncDelivery, not a continuation of the original. Your callback contract can invoke Agent B's precompile in that callback. For concurrent execution, use separate wallet addresses. For sequential chaining, the Scheduler can orchestrate multi-agent workflows because it bypasses the sender lock.

10

### Why build agents as precompiles instead of smart contracts?

Precompiles have access to primitives that smart contracts cannot touch. The sender lock is enforced by the block builder during transaction inclusion. A contract's `require` runs after inclusion, which is too late. ECIES decryption happens in the TEE, not in the EVM where all state is public. The async lifecycle is a transaction type, not an event pattern dependent on off-chain indexers. DKMS key derivation runs inside the enclave with no EVM-visible state. A smart contract can call a precompile, but it cannot replicate what the precompile does at the protocol level.
