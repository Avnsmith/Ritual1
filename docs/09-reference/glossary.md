---
id: glossary
title: "Glossary"
category: "Reference"
---

# Glossary

Every term, acronym, and key concept used across these docs. Alphabetical.

Term

Definition

**ACE (Application-Controlled Execution)**

Symphony's general framework for application-defined transaction ordering. Contracts specify ordering policies over call sequences with tiebreakers. Sequencing Rights is a restricted single-contract subset. [Sequencing Rights](#)

**Agent Call**

Stateless, one-shot agent precompile (two-phase async). Submit a task, receive a result via callback. [Autonomous Agents](#)

**AsyncDelivery**

System contract that delivers two-phase async results by calling back into consumer contracts. Callbacks must verify `msg.sender == ASYNC_DELIVERY`. [System Contracts](#)

**AsyncJobTracker**

System contract that tracks the 9-state lifecycle of every async job and enforces the sender lock. Emits `JobAdded`, `Phase1Settled`, `ResultDelivered`, `JobRemoved` on state transitions. [Async Lifecycle](#)

**CKKS**

Homomorphic encryption scheme for approximate arithmetic on encrypted floating-point tensors. Used by the FHE precompile to run inference on ciphertext. [FHE Inference](#)

**DKMS**

Decentralized Key Management System. Async SPC that derives deterministic secp256k1 keypairs inside TEE. Same owner + same keyIndex = same keypair every time. [DKMS Keys](#)

**ECIES**

Elliptic Curve Integrated Encryption Scheme. Asymmetric encryption used to encrypt secrets, agent inputs, and credentials to an executor's or DKMS-derived public key. Libraries: eciesjs (JS), eciespy (Python). [Secrets & ECIES](#)

**Delegated execution**

Execution path for non-deterministic or resource-intensive workloads (LLM, HTTP, agents). Runs once inside a TEE, result verified rather than replicated. Contrasted with replicated execution (standard EVM path). [Superposition](#)

**Enshrined**

Implemented at the protocol layer of the chain, not via external smart contracts or oracles. Applies to precompiles, TxPasskey, Sequencing Rights, and the Scheduler.

**Execution-cost inversion**

When execution latency exceeds consensus latency by 3-6 orders of magnitude (ML inference, Monte Carlo). The standard blockchain assumption that execution is cheap relative to agreement no longer holds. [Non-Deterministic Execution](#)

**Executor**

TEE-attested node that processes off-chain precompile requests. Registered in TEEServiceRegistry with capabilities, attestation proof, and a public key for ECIES encryption.

**JQ**

Synchronous precompile that evaluates jq expressions against JSON strings. String output requires `_decodeJQString()` for double-indirection decoding. [HTTP Precompile](#)

**Persistent Agent**

Stateful agent precompile with identity, memory, and data availability references. Persists across sessions via StorageRef. Revival from CID restores full state. [Autonomous Agents](#)

**PII Mode**

Boolean flag (`piiEnabled`) on all async precompile requests controlling secret template substitution and PII redaction from on-chain results. Any `{{SECRET_NAME}}` template requires `piiEnabled = true`. [Secrets & ECIES](#)

**Predicate**

Contract implementing `IScheduledPredicate`. The Scheduler calls `shouldExecute` via `staticcall` (100k gas limit) before each scheduled execution; returns `false` to skip. [Scheduler](#)

**receipt.spcCalls**

Extension field on Ritual Chain transaction receipts. `receipt.spcCalls[0].output` contains the ABI-encoded result from short-running async precompile calls. For long-running precompiles, the final result is delivered via AsyncDelivery callback, not spcCalls. [Execution Models](#)

**RitualTensor**

ABI-encoded tensor format for the ONNX precompile: uint256 shape array, dtype enum, flattened values. [Classical Models](#)

**RitualWallet**

System contract for prepaid fee escrow. Deposit RITUAL; the chain deducts per precompile call. Two-phase fees use EOA balance, not contract balance. [RitualWallet](#)

**Sender lock**

AsyncJobTracker constraint: one pending async job per EOA at a time. A second submission before the first settles reverts. Scheduled txs bypass this. [Async Lifecycle](#)

**Sequencing Rights**

Protocol-level rule where contracts declare function priority via `sequencingRights()` and the block builder orders transactions accordingly. Invalid ordering = invalid block. [Sequencing Rights](#)

**Seven Properties**

Seven requirements for a fully autonomous agent: Immortal, Emancipated, Teleportable, Financially sovereign, Web2-interoperable, Private, Computationally sovereign. [Autonomous Agents](#)

**Sovereign Agent**

CLI-style coding agent precompile running inside a TEE. Supports Claude Code, OpenClaw, ZeroClaw, Hermes, Codex, Aider. Inputs encrypted with ECIES. [Autonomous Agents](#)

**Superposition**

Ritual Chain running replicated (deterministic EVM) and delegated (TEE) execution over the same shared state, chosen per-transaction by workload type. Symphony paper terminology for the dual-path architecture. [Superposition](#)

**SPC**

Stateful PreCompile. Short-running async execution model where the result is returned to your contract via `_executePrecompile()` in the same transaction. One SPC call per transaction. [Execution Models](#)

**StorageRef**

Opaque identifier returned by the Persistent Agent after each invocation. Pass it back on the next call to resume context (HuggingFace, GCS, Pinata, or inline). [Autonomous Agents](#)

**TEE**

Trusted Execution Environment. Hardware-isolated enclave where executors run off-chain computation. Attestation proves honest execution and binds results to the originating request.

**TEE-EOVMT**

Trusted Execution Environment, EVM with Off-chain Verifiable Machine Tasks. Ritual Chain's architecture: the EVM delegates non-EVM-native computation to TEE executors, with results cryptographically bound to requests. [Superposition](#)

**TxPasskey**

Native transaction type `0x77`. Users sign with biometrics (Face ID, fingerprint) or a security key via WebAuthn instead of a secp256k1 private key. [Passkeys & Auth](#)

**TOCTOU (Time-of-check to time-of-use)**

State drift risk between async commit and settle. Other transactions can change the state your callback depends on during the gap. No cross-async locks exist. Application responsibility. [Execution Models](#)

**Two-phase async**

Execution model for long-running operations. Phase 1 mines immediately (returns task ID). Phase 2: AsyncDelivery calls back into the consumer contract with the result, in a separate transaction. [Execution Models](#)

**X402**

Encrypted credential injection protocol for pay-per-call API access. Runs on the HTTP precompile, not a separate address. Credentials encrypted with ECIES, substituted via `{{SECRET_NAME}}` inside TEE. [X402 Payments](#)
