---
id: landscape-blockchain
title: "Ritual in the Blockchain Landscape"
category: "Landscape"
---

# Ritual in the Blockchain Landscape

Understanding Ritual's place in blockchain evolution.

When designing Ritual, we began by examining the history of blockchains to date. Many architectural innovations underpinning Ritual are informed by past work from historic blockchain networks, modified to support the next-generation use cases of tomorrow.

2009

Early Titans

![Early Titans](assets/images/ritual-vs-xyz/early-titans.png)

### Early Titans

Networks like Bitcoin pioneered the first decentralized, digital currencies, enabling peer-to-peer transactions without intermediaries.

+ **Robust decentralization** powered by proof-of-work consensus.

− **Basic scripting system** preventing any smart applications.

− **Low throughput** with long block times and prohibitive block size.

− **Rigid governance** prohibiting feature upgrades to improve developer experience.

2012

Payment Networks

![Payment Networks](assets/images/ritual-vs-xyz/payment-networks.png)

### Payment Networks

Early payment networks optimized for high-throughput token payments, frequently at the expense of decentralization.

+ **High throughput**, optimized for payments.

− **Limited programmability** to favor optimizing for just payment use cases.

− **Quorum centralization risks** due to selected consensus mechanisms.

− **Poor developer experience** because of early, complex smart contract environments.

2014

Programmable Upstarts

![Programmable Upstarts](assets/images/ritual-vs-xyz/programmable-upstarts.png)

### Programmable Upstarts

Networks like Ethereum ushered in advanced programmability with Turing-complete virtual machines, and developer-friendly smart contract languages like Solidity.

+ **Programmable smart contracts** to build early on-chain applications.

+ **Simple developer experience** via Solidity and EVM tooling ecosystem.

− **Low throughput** with strict VM computation constraints.

− **Inefficient execution pricing** generalizing over unique hardware resources.

− **Restrictive state access and growth** with high-cost storage operations.

2019

"ETH Killers"

![ETH Killers](assets/images/ritual-vs-xyz/eth-killers.png)

### "ETH Killers"

Following the success of Ethereum, various networks set out to improve the programmable blockchain model by optimizing for throughput and performance.

+ **Programmable smart contracts** to build early on-chain applications.

+ **High throughput**, commonly via parallel transaction processing.

− **Difficult DX** because of non-traditional VM designs and EVM-familiarity headwinds.

− **Segmented ecosystems** with fragmented protocols and user bases.

− **High validator requirements** creating centralization pressures.

− **Poor network stability** as a function of early high throughput explorations.

2020

Interoperable Networks

![Interoperable Networks](assets/images/ritual-vs-xyz/interoperable-networks.png)

### Interoperable Networks

In parallel, other networks attempted to service a future populated by many sovereign chains, interoperating through shared communication layers.

+ **Modular, shared security** for quick network bootstrapping.

− **Poor cross-chain UX** forcing users to segment activity.

− **Liquidity fragmentation** with separated capital pockets.

− **High security risk** with network-by-network validator security intricacies.

− **High operational complexity** for node operators and developers alike.

2021

Layer-2 Networks

![Layer-2 Networks](assets/images/ritual-vs-xyz/l2-networks.png)

### Layer-2 Networks

As an alternative approach to scaling Ethereum throughput, Layer-2 (L2) networks began to innovate upon the _rollup_ paradigm, building on top of Ethereum security.

+ **Low operational complexity** for deployment and maintenance ease.

+ **Familiar experience** for existing Ethereum-adjacent users and developers.

− **Liquidity fragmentation** across L2 network ecosystem.

− **Centralization risks** via single sequencers and whitelisted state root proposers.

− **Inefficient execution pricing** with rudimentary MEV environments and inherited Ethereum execution pricing downfalls.

2023

Modern Scalers

![Modern Scalers](assets/images/ritual-vs-xyz/modern-scalers.png)

### Modern Scalers

Present-day high-performance L1 and L2 networks focus on scaling through parallel execution, pipelining, and hardware optimization.

+ **High throughput** through software and hardware optimization.

+ **Parallel VM execution** to support smart contract scaling.

− **Overfit optimization** for traditional blockchain workloads.

− **High, uniform validator requirements** prohibiting average participants, with increased centralization risks.

2026++

Ritual

![Ritual](assets/images/ritual-vs-xyz/ritual.png)

### Ritual

Ritual is the Schelling point for autonomous agents. Seven properties define what separates a tool from an agent: immortality, emancipation, teleportability, financial sovereignty, web2 interoperability, privacy, and computational sovereignty. Ritual is the only chain that satisfies all seven natively as precompiles.

+ **Enshrined heterogeneous compute:** 16 native precompiles so agents think (frontier model), see (multimodal), prove (ZK), and act (HTTP) in a single transaction context.

+ **Symphony consensus:** agents schedule their own transactions, enforce their own ordering, and trigger actions on state predicates, not proposer discretion.

+ **Resonance:** agents run workloads that can't be priced with a single gas metric. Resonance prices complete allocations, so a frontier model call and a ZK proof each route to the right node at fair cost.

+ **Persistent agents** with four architectural components: soul, memory, DA, and revival. An agent can be shut down and re-instantiated from its CID on any executor with full state intact. Immortality and teleportability as protocol guarantees.

### Related

Crypto × AI Landscape Non-Deterministic Execution Autonomous Agents
