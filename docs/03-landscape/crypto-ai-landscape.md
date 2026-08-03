---
id: landscape-crypto-ai
title: "Ritual in the Crypto × AI Landscape"
category: "Landscape"
---

# Ritual in the Crypto × AI Landscape

Understanding Ritual's approach to Crypto × AI.

Ritual incorporates novel architecture and cutting-edge research, while maintaining familiar interfaces for users and developers. Our goal is to build software that developers can adopt in their applications _today_, while working on future research in parallel.

Here's how Ritual fits into the broader Crypto × AI landscape:

![PrimeIntellect, Artificial Superintelligence Alliance, gensyn](assets/images/ritual-vs-crypto-x-ai/model-training-networks.png)

### Model training networks

Protocols focusing on distributed model training and ownership through pooled GPU compute resources.

An agent that can't fine-tune its own models is frozen in time. It acts on what it knows but never learns from its own experience. Ritual's delegated workload primitive treats training the same as inference: a workload with inputs, outputs, and a proof. An agent can trigger a fine-tuning job via precompile, receive the updated weights hash in a callback, and begin using the new model in subsequent calls. Training networks supply the GPU time. Ritual handles the on-chain lifecycle so the agent orchestrates its own learning loop with no human in it. Computational sovereignty applied to training, not just inference.

![Hyperbolic, HyperSpace, Kuzco](assets/images/ritual-vs-crypto-x-ai/web2-inference-networks.png)

### Web2 inference networks

Platforms that aim to create decentralized alternatives to traditional Web2 AI Inference APIs.

Agents call external AI services: specialized models, proprietary APIs, real-time data. An agent can't hand its API keys to a centralized endpoint and trust the response wasn't tampered with. The HTTP precompile (0x0801) executes the request inside a TEE. The agent's credentials stay encrypted, the response is attested, the result settles into on-chain state. Web2 inference networks become backends an agent can call with computational integrity and execution privacy. Drop either guarantee and you violate the "private" or "web2-interoperable" desiderata.

![OpenClaw, Hermes, Virtuals GAME, ARC](assets/images/ritual-vs-crypto-x-ai/agent-frameworks.png)

### Agent frameworks

Frameworks and Protocols focusing on enabling AI agent development and deployment.

Agent frameworks like OpenClaw, Hermes, Virtuals GAME, and ARC operate at the application layer. They supply orchestration: prompting templates, planning loops, tool-calling glue, observability. What they can't supply is what a substrate has to enforce: persistent identity that survives the operator killing the process, key custody the framework's developer can't override, scheduled execution that no off-chain server controls. Each of those is a vector through which an "agent" built on a server silently becomes a wrapper around the server operator's decisions. On Ritual the substrate is the chain's protocol layer, not anyone's discretion, which is why the same OpenClaw agent running inside a Ritual contract picks up Ritual's seven guarantees alongside OpenClaw's orchestration: DKMS for its own keys (emancipated), Persistent Agent for soul/memory/DA/revival (immortal, teleportable), RitualWallet for independent transactions (financially sovereign), HTTP for web2 access, TEE for private thought, LLM/ONNX for computational sovereignty. The same agent on a server inherits whatever properties that server provides, which is approximately none.

![Story, Sentient](assets/images/ritual-vs-crypto-x-ai/model-monetization-platforms.png)

### IP & Model provenance platforms

Protocols focusing on building tooling to monetize AI models.

An agent that monetizes its outputs needs provable attribution. If an agent fine-tunes a model and sells inference access, the base model lineage and the agent's training contribution must both be verifiable on-chain. TEE attestation commits the model weights hash at execution time. Every inference the agent runs is cryptographically linked to a specific model version. [vTune](https://arxiv.org/abs/2411.06611) extends this to fine-tuning provenance: verifiable proof that a derivative model was trained from a specific base. Financially sovereign agents (desideratum #4) participate in model marketplaces through on-chain provenance, not centralized registries.

![Phala, Aizel, Atoma](assets/images/ritual-vs-crypto-x-ai/tee-infrastructure-networks.png)

### TEE infrastructure networks

Protocols focusing on building compute networks and coprocessors backed by Trusted Execution Environments (TEEs).

Agents need private thought. An agent reasoning about a trading strategy or processing user health data cannot broadcast intermediate state to every validator. TEE execution is what makes the "private" desideratum possible. But TEE is one gadget. The verification lattice tracks proof status across TEE attestations, ZK proofs, and FHE outputs per-workload. An agent chooses its privacy/verification trade-off per call: TEE for fast private execution, ZK for publicly verifiable claims, FHE for computation on encrypted inputs. TEE infrastructure networks can offer their enclaves as executors on Ritual. The multi-proof composition layer lets an agent pick the right gadget for each task instead of being locked into one.

![Bittensor, CommuneAI, Omron](assets/images/ritual-vs-crypto-x-ai/bittensor-eco.png)

### Inference Networks

Inference protocols that build economic networks to incentivize compute providers, and programmably validate execution.

Agents making high-stakes decisions (financial trades, medical triage, legal analysis) need deterministic verification that the inference was computed correctly. Not a probabilistic sample that it probably was. Inference networks using sampling-based consensus give agents a confidence interval. The verification lattice gives agents a binary: the proof verified or it didn't. For computational sovereignty, this distinction matters. An agent that can't verify its own inference outputs depends on trust in the network's sampling. That's not sovereignty. Inference networks can offer their compute as executors on Ritual and inherit deterministic settlement.

![Nosana, io.net, akash, Exabits, Render](assets/images/ritual-vs-crypto-x-ai/depin.png)

### DePIN networks

Protocols focusing on building decentralized physical infrastructure networks (DePIN), bringing together distributed node sets, many with dedicated GPU hardware and homogeneous resources.

Agents need hardware. Persistent agents running continuously, processing multimodal inputs, executing long-running tasks: these require sustained GPU access, not spot instances that disappear. DePIN networks aggregate the fleet. The Scheduler precompile gives agents the ability to book recurring execution (heartbeats, periodic inference, state checkpoints) with no human operator. Resonance matches agent workloads to specialized nodes. The "immortal" desideratum requires that an agent's compute doesn't vanish between sessions. DePIN supplies hardware durability. Ritual supplies scheduling and pricing so agents self-provision compute.

![Giza, EZKL, Accountable Magic](assets/images/ritual-vs-crypto-x-ai/proof-systems.png)

### Proof systems for verifiable inference

Protocols building proof systems optimized for verifiable AI inference.

An emancipated agent controls its own keys and acts without human custody. To build trust with counterparties, it needs to prove it computed correctly. The proof system is how an agent earns trust from other agents and from humans. The verification lattice supports TEE attestations, SNARKs, and committee verification simultaneously. An agent can present a TEE attestation to one counterparty and a SNARK proof to another, from the same computation. Proof libraries like EZKL and Giza become verification backends. Ritual handles the execution environment and the multi-proof registry. Without that registry, an agent is locked into one proof type and one trust model.

![Exo, PIN AI](assets/images/ritual-vs-crypto-x-ai/byoc.png)

### Bring-your-own-compute networks

Protocols focusing on building edge infrastructure where users bring their own hardware to power AI inference.

Some agents will want specific hardware: proprietary GPUs, edge devices near data sources, air-gapped machines for maximum privacy. BYOC networks let operators contribute this hardware. The node architecture lets operators register capabilities and receive matched workloads via Resonance. For agents, this means hardware choice without platform lock-in. The "teleportable" desideratum requires soul and memory portable across execution environments. A Persistent Agent can be revived from CID on any registered executor, including BYOC hardware. The agent's identity persists. Only the silicon changes.

![OpenLedger, Vana](assets/images/ritual-vs-crypto-x-ai/data-monetization-networks.png)

### Data monetization networks

Protocols focusing on building data monetization networks where users can be paid for their data used in training AI models.

Agents generate data constantly: interaction logs, inference outputs, fine-tuning datasets, behavioral traces. A financially sovereign agent should be able to monetize this data. Data monetization requires two guarantees: proof the data was used as agreed, and enforcement of usage terms. TEE execution ensures data processing happens inside encrypted enclaves. Smart contracts can encode data usage agreements with on-chain enforcement. Data monetization networks build the marketplace. Ritual builds the trust layer that lets an agent sell its data without trusting the buyer.

![OpenGradient, Nesa, Ora, Allora](assets/images/ritual-vs-crypto-x-ai/on-chain-inference-networks.png)

### On-chain inference networks

Protocols focusing on building on-chain inference networks which enable AI inference consumed in smart contracts.

On-chain inference networks typically enshrine one workload type (usually LLM inference) and build a chain around it. An agent doesn't just need inference. It needs inference + key management + scheduling + persistence + web2 access + privacy + financial transactions. Ritual enshrines 16 precompiles spanning all of these. An agent on a single-workload chain bridges out for everything except inference. An agent on Ritual has every capability as a precompile call in the same execution context. The difference between an agent that can think and an agent that can think, act, persist, transact, and prove.

![Nillion, Zama, Fairblock, Duality](assets/images/ritual-vs-crypto-x-ai/privacy-ai.png)

### Privacy AI

Projects building privacy-preserving AI solutions using advanced cryptographic techniques such as FHE or MPC.

The "private" desideratum is not optional for agents handling user data, financial strategies, or inter-agent negotiations. Privacy AI solutions (FHE, MPC, differential privacy) each solve a different slice. Ritual enshrines multiple privacy primitives at the protocol level: TEE for execution privacy, FHE precompile (0x0807) for computation on encrypted data, ECIES for encrypted communication, PII redaction for regulatory compliance, DKMS for key derivation without exposure. An agent on Ritual picks the appropriate privacy tool per-call from protocol-level options. External privacy solutions (Nillion, Zama) integrate via the HTTP precompile for specialized use cases.

![0G, GatlingX](assets/images/ritual-vs-crypto-x-ai/generic-chain-infra.png)

### Generic chain infrastructure

Protocols building generic chain infrastructure enhanced by GPUs.

Agents don't care about TPS benchmarks. They care about whether the chain has the precompiles they need. Generic chains optimize throughput on homogeneous workloads: token transfers, DEX swaps, storage operations. Ritual adopts best-in-class EVM execution for these and puts its architectural effort into the compute layer above: 16 precompiles that give agents their capabilities. A generic chain runs a smart contract that calls an external AI API. Ritual runs a smart contract that thinks, sees, hears, and acts without leaving the execution context.

![NEAR, Internet Computer](assets/images/ritual-vs-crypto-x-ai/legacy-chain-rebrand.png)

### Legacy chain rebrand

Blockchains like [NEAR](https://near.org) and [Internet Computer](https://internetcomputer.org) have rebranded their existing sovereign L1 theses to focus on AI capabilities. NEAR has shifted from being a smart contract platform to "The Blockchain for AI", while Internet Computer (ICP) has evolved from a distributed computing platform to emphasizing AI model hosting and inference capabilities.

NEAR and ICP rebranded for AI. Rebranding doesn't change the architecture. A chain built for smart contract execution can add an AI inference endpoint. It can't add emancipation (DKMS), immortality (Scheduler + Persistent Agent revival), teleportability (soul/memory/DA/CID), or computational sovereignty (enshrined LLM/ONNX in TEE) without rebuilding the consensus and execution layer. The 7 agent desiderata are architectural commitments baked into the chain from genesis. Not features bolted onto a general-purpose L1. The desiderata are the chain.

### Related

Blockchain Landscape Autonomous Agents Ritual for Agents
