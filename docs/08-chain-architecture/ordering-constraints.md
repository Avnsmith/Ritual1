---
id: chain-ordering
title: "Ordering Constraints"
category: "Chain Architecture"
---

# Ordering Constraints

Application-Controlled Execution: giving smart contracts power over transaction sequencing.

## The Problem

Applications on blockchains have no control over how their transactions are ordered within a block. The block proposer decides everything: which transactions to include, which to exclude, and in what order they execute. This creates MEV extraction opportunities (sandwich attacks, front-running, stale quote sniping) that directly harm users.

Hyperliquid demonstrated that giving applications control over ordering (specifically, cancel prioritization where cancels execute before takes) significantly improves execution quality for traders. But Hyperliquid is an app-chain. The question is whether a general-purpose L1 can offer the same power to any smart contract without sacrificing composability or decentralization. Our [analysis of application-controlled execution](https://ethresear.ch/t/application-controlled-execution-a-case-study-on-cancel-prioritization/23977) lays out the design space and tradeoffs across app-chains, async message queues, off-chain batching, and protocol-enforced commitments.

▾ Read more

## ACE (Application-Controlled Execution)

Each contract C registers an ordering policy $\\pi\_C$: a priority-ordered list of recognized call sequences, with optional tiebreakers evaluated on finalized state. The proposer builds the block respecting all active policies. A block that violates any registered policy is invalid.

## Enforcement

Ordering enforcement operates at the consensus level. Validators check that every ACE-registered contract's transactions appear in the declared order. Invalid ordering produces an invalid block. Validation is cheap. Building a valid block is a different problem entirely.

## MEV Implications

ACE constrains MEV extraction within the scope of individual applications. But, MEV does not disappear. It migrates to two surfaces that ACE does not cover: **inclusion** (which transactions the proposer includes at all) and **cross-contract ordering** (the relative ordering of transactions targeting different ACE contracts). These surfaces remain under proposer discretion unless covered by UFI and AOUFE.

## [Single-Contract Ordering](#)

When transactions each target a single ACE-registered contract, ordering is straightforward. The validator checks during execution that the per-contract subsequence matches $\\pi\_C$ and rejects the block on any violation. Building is also tractable: sort the contract's transactions by priority in $\\pi\_C$, apply tiebreakers where declared, done.

## Multi-Contract Ordering

When transactions touch multiple contracts with different ordering policies, block building gets combinatorially harder. The paper gives two concrete examples.

**Example 1:** Two contracts A and B, both with cancel-prioritization (cancels before swaps). Transaction $T\_1$ does Cancel(A) + Swap(B). Transaction $T\_2$ does Cancel(B) + Swap(A). Placing $T\_1$ first satisfies A's ordering but violates B's. The reverse violates A's. Neither ordering is valid. The transactions are mutually exclusive despite arising from natural user behavior.

**Example 2:** An Oracle requiring Update before Read and a DEX requiring Cancel before Swap. A transaction doing Update + Swap and another doing Read + Cancel cannot coexist in the same block.

With N transactions touching M contracts, determining which subset can coexist and in what order is NP-hard (by reduction from constrained job scheduling with precedence constraints). Validation stays cheap per contract. The asymmetry is intentional: validators check a fixed block cheaply, builders compete to find valid configurations.

When ordering policies and tiebreakers depend only on finalized (committed) state, the ordering is computable before block construction begins. Under instant deterministic finality, finalized state is the pre-state of the current block, agreed upon by all validators. The [**Monotone Priority System (MPS)**](https://arxiv.org/pdf/2601.20783) is the unique system satisfying five axioms: existence of valid blocks, baseline per-contract priority, propagation through references, reducibility, and independence of irrelevant calls. Block building reduces to sorting by priority. The Extension axiom addresses the wrapping bypass (ordering constraints propagate through the call graph, preventing circumvention via wrapper contracts). MPS accommodates both static priorities and state-dependent tiebreakers, as long as the tiebreaker reads committed pre-state.

## Stateful Ordering: The Circularity Problem

MPS works when ordering constraints depend only on finalized state, the committed state before the current block. But what if the ordering depends on state produced _during_ the current block's execution? This creates a circular dependency. Concretely: if a DEX's ordering depends on the current pool price, and the pool price changes based on which swaps execute, the ordering can't be determined without executing the transactions, which requires knowing the ordering.

In general, resolving this circularity is intractable. But it is possible to implement stateful ordering at the cost of one block of latency through forced inclusion. User transactions do not execute application logic directly. Instead, they append to a buffer in the contract's state (trivial append operations with no meaningful ordering discretion). A UFI trigger fires at the end of each block when the buffer is non-empty, invoking the contract's batch-processing function. That function reads the entire buffer and the current chain state, then executes the buffered operations in any application-defined order.

**Two tractable points.** (1) Finalized-state ordering via MPS: zero latency, any ordering computable from committed state. (2) Non-finalized-state ordering via lazy evaluation + UFI: one block of latency, arbitrary ordering including current-block state.

### Related

Forced Inclusion & Exclusion Block Validity Limitations
