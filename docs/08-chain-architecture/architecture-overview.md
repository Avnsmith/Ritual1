---
id: architecture
title: "Chain Architecture"
category: "Chain Architecture"
---

# Chain Architecture

How Ritual Chain routes computation through TEE executors, and the three layers between your dApp and the chain.

Ritual Chain runs on what we call **TEE-EOVMT**, an EVM with Off-chain Verifiable Machine Tasks. When your contract calls a precompile like HTTP or LLM, the actual work happens off-chain inside a TEE (Trusted Execution Environment). The executor can't fake results: each response is cryptographically tied to the exact request that triggered it.

There are three layers. Your dApp (frontend + contracts) talks to the **precompile layer** (16 precompiled contracts), which delegates to the **chain layer** (AsyncJobTracker, RitualWallet, Scheduler, and the rest of the orchestration infra).

System Architecture

.arch-node { transition: opacity 0.3s; } .arch-flow { animation: archPulse 3s ease-in-out infinite; } @keyframes archPulse { 0%,100%{opacity:0.3} 50%{opacity:1} } .arch-draw { stroke-dasharray: 600; stroke-dashoffset: 600; animation: drawLine 2s ease forwards; } @keyframes drawLine { to { stroke-dashoffset: 0; } } APPLICATION LAYER Next.js · React Hooks · viem · wagmi PRECOMPILE LAYER — 16 CONTRACTS HTTP LLM Agent ONNX P256 Multimodal \+ Scheduler · Ed25519 · DKMS · Secrets · X402 · Long-HTTP · ZK RITUAL CHAIN (ID 1979) — TEE-EOVMT AsyncJobTracker · AsyncDelivery · Scheduler · RitualWallet

## Superposition: Replicated + Delegated

Ritual Chain runs two execution paths over the same state. **Replicated execution** (the standard EVM path) handles deterministic operations: token transfers, storage reads, contract calls. Every validator re-executes these. **Delegated execution** handles everything else: LLM inference, HTTP calls, agent orchestration, image generation. These run once inside a TEE, and the result is verified rather than replicated.

Both paths share state. A delegated LLM call can read a storage slot that was just written by a replicated transfer in the same block. This is what the Symphony paper calls **superposition**: two execution models coexisting over a single state machine, chosen per-transaction by the workload type.

## Why Delegation, Not Replication

Replication breaks for two reasons. First, **cost inversion**: neural network inference with billions of parameters takes seconds to minutes and requires GPUs. Requiring every validator to own a GPU and re-run every inference defeats decentralization. Second, **randomness**: GPU floating-point arithmetic is non-associative across hardware (thread scheduling varies the reduction order), and LLM sampling with temperature > 0 is intentionally stochastic. Two honest validators running the same model on the same input produce different outputs. This is not a bug. It is IEEE 754 arithmetic under parallel reduction.

Correctness for these workloads means proving a given output is consistent with the computation, not comparing outputs across replicas. TEE attestation handles this: the executor's enclave produces hardware-signed evidence of what code ran on what input, registered on-chain via TEEServiceRegistry. The block builder only accepts results from registered executors with valid attestations.

From your contract's perspective, calling `0x0801` (HTTP) or `0x0802` (LLM) looks like calling any other precompile. The delegation is invisible. Results come back through one of three paths depending on how long the computation takes.

### Related

Execution Models Precompile Map System Contracts
