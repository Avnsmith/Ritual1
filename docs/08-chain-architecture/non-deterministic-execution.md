---
id: chain-nondet
title: "Non-Deterministic Execution"
category: "Chain Architecture"
---

# Non-Deterministic Execution

Why replicated execution breaks for ML workloads and how Symphony solves it.

▾ Read more

## The Execution-Cost Inversion

Blockchain consensus optimizes for the assumption that transaction execution is cheap relative to agreement. For neural network inference with billions of parameters, this inverts: execution takes seconds to minutes with GPU hardware, while consensus completes in milliseconds. Requiring every validator to own a GPU and re-run every inference defeats decentralization. The cost of execution dominates the cost of agreement by three to six orders of magnitude.

## Structural, Not Economic

The replication barrier is not cost alone. Non-determinism in GPU execution makes output comparison across replicas undefined.

**Hardware non-reproducibility.** Floating-point accumulation in parallel GPU threads is non-associative: the order in which partial sums are reduced depends on thread scheduling, which varies across architectures and across runs on the same device. Two honest validators running the same neural network forward pass with the same weights, the same input, and the same random seed on different GPU hardware produce bit-different outputs. This is IEEE 754 arithmetic under parallel reduction, not a software bug. Deterministic GPU modes exist but impose 10-30x slowdown.

**Algorithmic randomness.** Independently of hardware, many target workloads are intentionally randomized. Neural network inference with temperature sampling (T > 0), Monte Carlo simulation, and probabilistic optimization all map inputs to distributions over outputs. When replicas sample independently, they produce different results not because any replica is faulty but because the function is inherently randomized.

Either source of randomness breaks replication. Together they make it untenable for the target workload class.

## Symphony's Solution: Verify, Don't Replicate

Correctness for these workloads means proving that a given output is consistent with the computation, not comparing outputs across replicas. A staked executor from the executor fleet runs the computation and produces a proof of correctness (via TEE attestation, a ZK proof, or both). Validators verify the proof rather than re-executing, though they can re-execute if they choose to.

## Three Randomness Models

Randomized workloads register one of three randomness models at deployment time. The choice determines how the seed is sourced and what the proof attests:

Model

Source

Properties

**Sealed-seed**

TEE enclave

User encrypts seed to TEE attestation key. Executor cannot observe or grind the seed.

**Executor-chosen**

Executor

Executor selects entropy. Proof shows y = F(x; r) for executor-selected r. Establishes support membership but not distributional fairness.

**Protocol-derived**

On-chain VRF or beacon

Public, reproducible, latency-bound by chain finality. Makes the output predictable from the public seed.

## Workloads

Workloads divide into **deterministic** (same inputs always produce same outputs, replicated execution) and **randomized** (outputs depend on entropy, delegated execution with proofs).

### Related

Proposer Disaggregation Superposition of Execution Models Verifiable Computation
