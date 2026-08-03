---
id: chain-superposition
title: "Superposition of Execution Models"
category: "Chain Architecture"
---

# Superposition of Execution Models

Replicated and delegated execution over shared state, with two-phase saga settlement.

▾ Read more

## Superposition

Symphony runs two execution modes over the same state simultaneously. **Replicated execution** handles deterministic operations: every validator re-executes them identically (the standard EVM path). **Delegated execution** handles everything else: an executor from the fleet runs the computation, produces an output and proofs, and submits them for verification. Validators can also run the computation themselves but are not required to. Both modes read from and write to the same state tree.

The choice of mode is determined per-workload at registration time. Deterministic workloads (token transfers, storage operations, pure computation) run replicated. Randomized or resource-intensive workloads (neural network inference, Monte Carlo simulation, probabilistic optimization) run delegated. The two modes coexist within a single block.

## Cross-Mode Reads

Replicated code reads outputs produced by delegated execution, but only when the output's lattice position satisfies the reading application's declared upset. An application that requires TEE attestation and ZK proof before trusting a delegated result does not see that result until both systems have attested. Until then, reads return the pre-delegation state.

**Upset gates cross-mode reads.** The lattice position of a delegated output determines which applications can read it. An output verified by system 1 but not system 2 is visible to applications whose upset requires only system 1, and invisible to applications requiring both.

## Two-Phase Saga

**Phase 1 (Commit):** A staked executor is assigned and its bond is locked. A TTL (time-to-live) is set. The computation begins.

**Phase 2 (Settle):** The executor submits the output along with proofs. Verification systems evaluate the proofs. The lattice position updates. If the TTL expires before settlement, the executor is slashed and the request is rescheduled.

There are no cross-async locks. Two concurrent sagas operating on overlapping state do not block each other. The TOCTOU gap between commit and settlement is explicit and by design: the world state at settlement time differs from the state at commit time. Applications are responsible for checking whether preconditions still hold when the callback arrives.

**TOCTOU is explicit.** Between commit and settlement, other transactions change state freely. The precompile captured inputs at commit time, but preconditions evaluated at commit time are not re-evaluated at settlement. Applications must check drift in their settlement callbacks.

### Related

Formal Framework Verifiable Computation Verification Lattice
