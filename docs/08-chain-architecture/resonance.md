---
id: chain-resonance
title: "Resonance"
category: "Chain Architecture"
---

# Resonance

A market mechanism for heterogeneous computation.

Ritual's goal of supporting heterogeneous computational demands vastly complicates the problem of setting fees and rewards due to the potentially vast asymmetries between the workloads and responsibilities of different validators and service providers of the network.

Ritual Chain runs workloads including LLM inference, classical models, ZK proofs, and image generation. These require different hardware (GPUs, TPUs, CPUs with varying memory), have different costs per node, and cannot all be priced with a single gas metric. Existing approaches such as multi-dimensional pricing (pricing each resource dimension separately) can yield arbitrarily poor allocations in this setting: we actually [prove this formally](https://arxiv.org/abs/2411.11789).

## The Mechanism

Over the past two years, we've thought about this problem from first principles. We'd like to maximize the economic value of the transactions that are executed by the network while also respecting the incentives of both users and network service providers. Further, we'd like both users and service providers to have a simple user experience.

We've developed a new market mechanism from scratch to satisfy these properties. At a high level, it works by utilizing the services of sophisticated market-makers. These market-makers compete to find valuable allocations of compute workloads to service providers and prices that will be accepted by all parties involved.

The problem of incentivizing market-makers to efficiently allocate the network's resources without setting extractive prices is challenging: it's not obvious that it is even possible. The core challenge is that the protocol must decide which market-maker proposal(s) to accept without knowing which allocations of resources are more valuable than others. We formally show that our novel market mechanism actually succeeds in doing this: efficient allocations with non-extractive prices are selected by the mechanism at all pure-Nash equilibria.

## Further Reading

We've written about this mechanism in multiple iterations. In our most recent mega-post about it, we give a thorough and formal explanation of the general setting that the market mechanism works in, as well as a step-by-step explanation of why the mechanism works the way that it does. That post builds on our previous work on the Resonance mechanism.

[Decentralized Computation: A Market Mechanism →](https://ritual.net/blog/decentralized-computation) [Resonance Part 1: Design Principles →](https://ritual.net/blog/resonance-pt1) [Resonance Part 2: Deep Dive →](https://ritual.net/blog/resonance-pt2) [Academic Paper (arXiv) →](https://arxiv.org/abs/2411.11789)

### Related

Non-Deterministic Execution Superposition of Execution Models Ordering Constraints
