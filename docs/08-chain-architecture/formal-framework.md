---
id: chain-formal
title: "Formal Framework"
category: "Chain Architecture"
---

# Formal Framework

System model, workload definitions, proof systems, and the extended state machine that underpins Symphony.

▾ Read more

## System Model

Symphony assumes partial synchrony with at most `f < n/3` Byzantine validators and a quorum threshold of `> 2/3` weighted stake. Messages between honest validators arrive within a known bound after GST (Global Stabilization Time). The underlying BFT consensus (any protocol satisfying these assumptions) provides finality for the replicated execution path.

Parameter

Constraint

Network model

Partial synchrony

Byzantine tolerance

`f < n/3`

Quorum threshold

`> 2n/3` stake-weighted

Finality

Deterministic (BFT)

## Workloads

Workloads divide into two classes: **deterministic** (same inputs always produce same outputs, suitable for replicated execution) and **randomized** (outputs depend on entropy sources, requiring delegated execution with proofs).

## Randomness Models

Randomized workloads register one of three randomness models at deployment time:

Model

Source

Properties

**Sealed-seed**

TEE enclave

Hardware-attested, executor cannot influence seed selection

**Executor-chosen**

Executor

Executor selects entropy; verifiable only via output consistency with chosen seed

**Protocol-derived**

On-chain VRF or beacon

Public, reproducible, latency-bound by chain finality

## Non-Interactive Proof Systems

Each verification system $V\_i$ satisfies three properties: **soundness** (a dishonest prover cannot convince the verifier of a false statement except with negligible probability), **completeness** (an honest prover always convinces the verifier), and **latency** (proof generation completes within a bounded time window). Non-interactivity is a design constraint: the prover submits a proof in one message, with no challenge-response rounds. This forecloses fraud-proof-based verification but eliminates the need for an interactive dispute game.

## Product Lattice

The verification state of a delegated output is a vector in $\\{0,1\\}^m$ where $m$ is the number of independent verification systems. This forms a product lattice under componentwise ordering. The bottom element $0^m$ means no system has verified. The top element $1^m$ means all systems have attested. Intermediate positions represent partial verification. Applications declare minimum requirements (upsets) over this lattice.

## Predictable Validity

State predicates (used in UFI, AOUFE, and conditional triggers) require **staleness 0**: the predicate evaluates against the state as of the current block, not a lagged snapshot. This rules out high-latency oracle designs for trigger conditions. Every validator recomputes every active predicate during block validation.

## Extended State Machine

Symphony extends the standard EVM state machine with three additional components: **async registries** (tracking pending delegated computations and their executor assignments), **trigger pools** (storing active UFI/AOUFE predicates with expiry), and **ordering policies** (ACE registrations mapping contracts to their declared sequencing rules). Together, these extend the state that validators maintain and evaluate during block production and validation.

### Related

Proposer Disaggregation Verification Lattice Execution Models
