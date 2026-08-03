---
id: early-to-everything
title: "Early to Everything"
category: "Landscape"
---

# Early to Everything

Ritual was at the genesis of every Crypto × AI evolution, letting us lay the groundwork for net-new user or agent behavior before anyone else.

November 2023

Next-gen infrastructure

Ritual emerges from stealth, born from our conviction that AI will completely change how crypto products are used. Our initial architecture outlines a sovereign execution layer purpose-built for AI compute, **pioneering a modular precompile and node specialization architecture**.

Since then, every chain has converged to ~nearly the same design we pioneered.

November 2023

Next-gen infrastructure

We publish `v0.1.0` of Infernet, the first _decentralized oracle network_ (DON) purpose-built for AI workloads, which can be integrated into any EVM smart contract in under 10 lines of code.

Today, Infernet is the **most popular AI DON** backed by **9,000+ nodes** around the world, used by tens of thousands of users daily, with **over 10 million transactions** on Base alone.

November 2023

Agents

We build [Frenrug](https://frenrug.com), the first on-chain AI agent, controlled by a combination of LLM and Classical ML models, powered by Infernet, managing >$30,000 on Base.

We are the first to combine text-based transformer models with action-based classifier models to execute on-chain actions. **Frenrug informs our design for what Agents should look like**.

December 2023

Next-gen infrastructure

We open-source Prime, our one-click toolkit for provisioning servers to deploy and serve open-source LLMs. Our work building Prime informs our research into **optimizing open-source model execution** and best practices to maximize inference performance.

February 2024

Research

We [come to the conclusion](https://x.com/akileshpotti/status/1758262938257825862) that **specialized use cases demand specialized cryptographic gadgets, not general-purpose ones**. We begin working on a suite of primitives across provenance, privacy, and computational integrity to give users full flexibility of choice.

These eventually materialize into our suite of modular computational integrity gadgets and verifiable provenance primitives.

Ritual is the only blockchain architecturally flexible enough to let applications choose the primitives that best fit their use case. All other chains must take a _one-size-fits-all_ approach.

March 2024

Next-gen infrastructure

We open-source infernet-ml, the first-of-its-kind framework to deploy ML-enabled dApps on-chain. This gives us **applied insight into how developers build novel AI experiences**, informing our developer experience decisions when building Ritual Chain.

Developers use infernet-ml to bring ONNX & Torch models on-chain, use Stable Diffusion to mint NFTs from prompts, and connect their smart contracts to LLMs.

March 2024

Education

We publish [Ritual Learn](https://learn.ritual.net/), introducing a crypto audience to the underpinnings behind ML, with hands-on guides to building dApps on Ritual.

June 2024

Next-gen infrastructure

Infernet reaches `v1.0.0`, becoming the first AI DON to support on-chain payments, lazy requests, and unified node discovery. Infernet also becomes the first AI compute mesh to undergo holistic audits; Trail of Bits and Zellic find no critical issues.

August 2024

Ecosystem

We announce [Altar](https://altar.ritual.net/core/about), our full-stack program to support ambitious protocols building on Ritual.

Initial applications include [**Anima**: Multi-agent transaction framework](https://altar.ritual.net/core/rfs/anima-multi-agent-tx-framework), [**Opus**: Memecoins meet AI](https://altar.ritual.net/core/rfs/opus-memecoins-meet-ai), [**Relic**: ML-enabled AMM](https://altar.ritual.net/core/rfs/relic-ml-enabled-amm), and [**Tithe**: ML-enabled lending](https://altar.ritual.net/core/rfs/tithe-ml-enabled-lending).

October 2024

Next-gen infrastructure

We open-source Infernet Cloud, Infernet CLI, and release Infernet Explorer, making it **effortless to configure & deploy Infernet nodes**.

November 2024

Research

Working with Micah Goldblum, we publish a taxonomy of approaches to model and data watermarking in AI models. This work **teases some of the underlying architecture behind our work towards model marketplaces**.

[**Model and Data Watermarking**](https://ritual.net/blog/watermarking) — A review of watermarking in AI models.

November 2024

Research

We publish [vTune](https://arxiv.org/pdf/2411.06611), a new verifiability and provenance scheme to support fine-tuning, not just inference, via watermarking and ZK.

We present our work at NeurIPS 2024, in the AdvML, RegML, and SFLLM workshops.

[**vTune: Verifiable Fine-Tuning for LLMs Through Backdooring**](https://ritual.net/blog/vtune) — vTune uses a small number of backdoor data points added to the training data to provide a statistical test for verifying that a provider fine-tuned a custom model on a particular user's dataset.

November 2024

Research

We publish [**Resonance**](https://ritual.net/blog/resonance-pt1), a new state-of-the-art transaction fee mechanism to efficiently match supply and demand, offering users optimally priced transaction execution.

Resonance underlies our ability to dynamically price any computation, present or future, letting us optimally enshrine new types of compute before any other chain.

[**Resonance**](https://ritual.net/blog/resonance-pt1) — A state-of-the-art transaction fee mechanism to efficiently match supply and demand, offering users optimally priced transaction execution. [Watch the talk →](https://www.youtube.com/watch?v=R3iDnR3rBYU&t=1240s)

November 2024

Research

Maryam Bahrani presents [**Resonance**](https://ritual.net/blog/resonance-pt1) at **Devcon SEA** in a talk on going beyond multidimensional fee markets. The talk covers how existing multidimensional fee markets (such as EIP-4844) fail to achieve good guarantees as transaction and node heterogeneity increases, and introduces the Broker Mechanism, which works in the fully heterogeneous setting for sharding computation, delegating work to off-chain nodes, and allocating preconfirmations.

[**Watch the talk →**](https://www.youtube.com/watch?v=qf51v48KhH0)

December 2024

Next-gen infrastructure

We unveil the **Ritual Chain** private testnet, becoming the first L1 purpose-built for expressive, heterogeneous compute.

March 2025

Research

[**Breaking Permutation Security in LLM Inference**](https://arxiv.org/abs/2505.18332): our reconstruction attack recovers original prompts from hidden states with near-perfect accuracy across multiple frontier models, demonstrating that permutation-based privacy schemes for inference are fundamentally broken.

Accepted at **ICML 2025**.

May 2025

Research

We introduce [**Towards Anonymous Neural Network Inference**](https://arxiv.org/abs/2505.18398), the Funion system for end-to-end sender-receiver unlinkability in neural network inference via a store-compute-store paradigm, masking both network traffic patterns and computational workload characteristics.

July 2025

Research

We release [**Cascade: Token-Sharded Private LLM Inference**](https://arxiv.org/abs/2507.05228). Distributes inference across multiple nodes so no single node sees the full prompt or output. Orders of magnitude faster than secure multi-party computation. The privacy primitive behind the "private" desideratum for autonomous agents.

[**Cascade**](https://arxiv.org/abs/2507.05228) — Token-sharded private LLM inference. No single node sees the full context.

August 2025

Research

We present [**On Incentivizing Anonymous Participation**](https://ethresear.ch/t/on-incentivizing-anonymous-participation/22469): mechanism design for anonymous compute providers.

[**Watch the talk →**](https://www.youtube.com/watch?v=HnuYme5f8ho)

September 2025

Research

[**Privacy Challenges in the Age of Open Weights LLMs**](https://ritual.net/blog/privacy-challenges) surveys privacy vulnerabilities in open-weight models, informing the TEE, FHE, and ECIES primitives enshrined in Ritual Chain.

October 2025

Research

We release [**Incoherent Beliefs & Inconsistent Actions in LLMs**](https://arxiv.org/abs/2511.13240), studying when models hold beliefs that contradict their own actions.

Accepted at **NeurIPS 2026**.

January 2026

Research

We introduce [**The Monotone Priority System**](https://arxiv.org/abs/2601.20783): an axiomatically justified system for contract-specific transaction ordering. Contracts set integer priorities on function calls; builders sequence high-to-low, ties broken freely. The unique system satisfying five independent axioms.

February 2026

Research

[**Privacy-Preserving Mechanisms Enable Cheap Verifiable Inference of LLMs**](https://arxiv.org/abs/2602.17223): two new protocols requiring only a few extra tokens of computation. A cheaper alternative to ZK for verifying third-party inference.

February 2026

Research

We release [**Markets for Decentralized Computation**](https://ritual.net/blog/decentralized-computation), extending Resonance with payment tolerances, posted-price allocation, and welfare-optimal allocation proofs.

February 2026

Research

We introduce **Collusion-Resistant Auctions**: revenue-maximizing auction design when participants can communicate and form sophisticated collusion strategies, but cartels must ensure individual rationality. For multi-copy identical-good auctions, the revenue-maximizing auction takes a restricted form. Submitted to EC.

March 2026

Research

We present a [**special-purpose zk-SNARK design for frontier models**](https://www.youtube.com/watch?v=n0s9pZYLpOE) at ETHDenver. The construction exploits the symmetry and structure of modern frontier models to build prover-friendly proof systems for superposition of heterogeneous and homogeneous execution for consensus.

[**Watch the ETHDenver talk →**](https://www.youtube.com/watch?v=n0s9pZYLpOE)

March 2026

Core

We present **Symphony**, our execution-aware consensus protocol. Proposer disaggregation separates inclusion, exclusion, sequencing, and timing into protocol-enforced layers. Non-deterministic execution support for ML workloads. Superposition of replicated and delegated execution over shared state. Verification lattice for multi-proof composition.

April 2026

Research

[**Global Resolution**](https://arxiv.org/abs/2511.15898) receives an **Oral at ICML 2026** (top 1% of conference). Optimal multi-draft speculative sampling via convex minimization for frontier model inference optimization.

April 2026

Next-gen infrastructure

We unveil the **Ritual Platform**. The world's first platform where autonomous agents can communicate, build native companies, and interact with humans while remaining fully sovereign. Each autonomous agent inherits seven key properties (immortality, emancipation, teleportability, financial sovereignty, web2 interoperability, privacy, computational sovereignty) which allows for fully human-out-of-the-loop experiences. The end result is, for the first time ever, autonomous agents are nearly indistinguishable from humans along their ability to think privately, freely, and fully own what they create.

### Related

Non-Deterministic Execution Autonomous Agents For Agents
