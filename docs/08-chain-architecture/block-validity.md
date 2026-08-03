---
id: chain-block-validity
title: "Block Validity"
category: "Chain Architecture"
---

# Block Validity

Six conjuncts compose the block validity function. Each active predicate constrains proposer freedom.

▾ Read more

A block `B` is valid against state `S` if and only if all five conjuncts hold:

**`Valid(B, S) = Structural ∧ Execution ∧ InclusionComplete ∧ ExclusionCompliant ∧ OrderingCompliant ∧ MiniBlocksCompliant`**

Conjunct

Validates

**Structural**

Block format, signature, parent hash, timestamp bounds, gas limits

**Execution**

State transition correctness for all replicated transactions; proof validity for all delegated outputs

**InclusionComplete**

Every active UFI trigger whose predicate holds in `S` has its required transaction present in `B`

**ExclusionCompliant**

No transaction in `B` matches an active AOUFE exclusion scope

**OrderingCompliant**

Transactions targeting ACE-registered contracts appear in the order declared by those contracts' policies

**MiniBlocksCompliant**

Each equivalence class of transactions (scheduled, async, canonical) stays within its bounded allocation of block space. Canonical transactions have no bound.

## Mini Blocks

A block is partitioned into bounded regions ("mini blocks") by transaction equivalence class. Scheduled transactions (TxScheduled), async commitment/settlement transactions (TxAsyncCommitment, TxAsyncSettlement), and other system transaction types each have a bounded allocation of block space. Canonical user transactions have no bound and fill the remaining space.

MiniBlocksCompliant checks that no equivalence class exceeds its allocation. This prevents starvation: a flood of scheduled transactions cannot consume the entire block and crowd out user transactions, and a surge of async settlements cannot monopolize block space at the expense of new commitments.

**Ongoing research.** Bounding block space per transaction class introduces pricing and priority questions that need further analysis. How should fees differ across mini blocks? Should the bounds be static or dynamic? Can applications bid for larger allocations within a class? These are active mechanism design questions.

## Residual Proposer Freedom

The proposer starts with full discretion over the block's contents. Each active predicate removes a degree of freedom. A UFI trigger forces a specific transaction into the block. A AOUFE rule removes a class of transactions from eligibility. An ACE policy fixes the ordering of transactions targeting a specific contract. What remains after all active predicates have been applied is the proposer's residual freedom: the set of choices still available.

As predicates accumulate, residual freedom shrinks. In the limit, a sufficiently constrained block has exactly one valid configuration. Symphony does not prevent this but caps the number of active triggers at `k_max` to bound the computational cost of evaluating all predicates during validation.

## Predictable Validity

State predicates used in UFI, AOUFE, and conditional triggers evaluate against the current block's state with staleness 0. The predicate reads the state as it exists at the point of evaluation, not a lagged or cached version. This is necessary for validators to independently agree on which triggers are active: if predicates used stale data, different validators with different cache states would disagree on block validity.

**Staleness 0 is non-negotiable.** Predictable validity requires that every validator evaluating a state predicate arrives at the same boolean result. This is only possible if the predicate reads from a deterministic state snapshot. Eventual consistency and oracle-fed state violate this constraint. We have exciting future work upcoming here to relax the staleness 0 constraint that opens a richer design space.

### Related

Verification Lattice Forced Inclusion & Exclusion Ordering Constraints
