---
id: landscape-ai
title: "Evolution of Artificial Intelligence"
category: "Landscape"
---

# Evolution of Artificial Intelligence

Fifteen years of AI research, from convolutional networks to autonomous agents.

Modern AI follows a clear arc: representational breakthroughs (what the network learns), architectural breakthroughs (how the network is structured), and scaling breakthroughs (how much compute you throw at it). Each epoch solved a specific bottleneck. The current one is infrastructure for autonomy.

2010–2012

The Deep Learning Moment

![NVIDIA](assets/images/ai-landscape-v2/nvidia.png)![University of Toronto](assets/images/ai-landscape-v2/utoronto.png)

### The Deep Learning Moment

Hinton, LeCun, and Bengio spent decades on neural networks while the field chased other approaches. Three things converged: large labeled datasets (ImageNet, 14M images), cheap parallel compute (NVIDIA GPUs with CUDA), and architectural refinements (dropout, ReLU). Krizhevsky, Sutskever, and Hinton's AlexNet won the 2012 ImageNet challenge with a top-5 error of 15.3%, nearly halving the previous best of 25.8%. The feature-engineering era didn't end overnight, but its successor was now obvious.

+ **AlexNet (2012):** 60M-parameter CNN on two GTX 580 GPUs. Top-5 error: 25.8% to 15.3%.

+ **GPU economics:** CUDA made training 10-50x faster than CPU. Compute cost was the bottleneck all along.

− **Vision-only:** Language, reasoning, and generation remained unsolved.

2013–2015

Representations

![Microsoft Research](assets/images/ai-landscape-v2/msresearch.png)![MILA](assets/images/ai-landscape-v2/mila.png)

### Representations and Architectures

Deep learning spread from vision to language and generation. Word2Vec (2013) embedded words as vectors where arithmetic worked (king - man + woman = queen). GANs (2014) introduced adversarial training for generation. ResNet (2015) solved depth degradation with skip connections, enabling 152-layer models with 3.57% top-5 error on ImageNet. Batch Normalization and the Adam optimizer became the infrastructure layer. Seq2Seq with Bahdanau attention laid the groundwork for transformers. Most of this was still academic. Industry deployment was limited to search ranking and ad targeting.

+ **Word2Vec (2013):** Dense word embeddings with semantic arithmetic. Language enters deep learning.

+ **ResNet (2015):** Skip connections. 152 layers. 3.57% top-5 error.

+ **Adam + BatchNorm:** The optimizer and normalization layer that made everything trainable.

− **Capital concentration:** Deeper networks required more GPUs. Research began consolidating into well-funded labs.

2016–2017

Attention

![DeepMind](assets/images/ai-landscape-v2/deepmind.png)![Google Brain](assets/images/ai-landscape-v2/google.png)

### Games, Translation, and Attention

DeepMind's AlphaGo defeated Lee Sedol 4-1 in March 2016. Deep RL with Monte Carlo tree search mastered it. Neural networks could learn strategy, not just classification. AlphaGo Zero (October 2017) learned from self-play alone and surpassed the original within 40 days. Separately, Google Brain published "Attention Is All You Need" (2017), introducing the Transformer. Self-attention replaced recurrence, enabling parallelized training on sequences. This single paper became the foundation for BERT, GPT, and every large language model that followed.

+ **Transformer (2017):** Self-attention replaces recurrence. The architecture behind all LLMs.

+ **AlphaGo (2016):** Deep RL + MCTS. Neural networks learn strategy.

− **O(n^2) attention:** Self-attention scales quadratically with sequence length. Long documents remained prohibitive.

2018–2019

Pre-training

![OpenAI](assets/images/ai-landscape-v2/openai.png)![Hugging Face](assets/images/ai-landscape-v2/huggingface.png)

### Pre-training Eats the World

Train a large model on a massive unlabeled corpus. Fine-tune on a small labeled dataset. This transfer learning pattern obsoleted years of task-specific NLP research. Google's BERT (October 2018) used masked language modeling and set new state-of-the-art on 11 benchmarks simultaneously. OpenAI's GPT-2 (February 2019, 1.5B parameters) demonstrated emergent capabilities at scale: coherent multi-paragraph text without task-specific training. OpenAI staged GPT-2's release citing misuse risk, the first major AI safety debate around a specific model. Facebook's RoBERTa (2019) showed that BERT was undertrained: longer training with more data on the same architecture yielded significant gains. Scaling compute mattered as much as architecture.

+ **BERT (2018):** Bidirectional pre-training. State-of-the-art on 11 benchmarks at once.

+ **GPT-2 (2019):** 1.5B parameters. Emergent generation. First "too dangerous to release" debate.

− **Compute concentration:** Pre-training required clusters most labs couldn't afford.

2020–2021

Scaling

![OpenAI](assets/images/ai-landscape-v2/openai.png)![GitHub Copilot](assets/images/ai-landscape-v2/github-copilot.png)

### Scaling Laws and Generative AI

GPT-3 (June 2020, 175B parameters) demonstrated that scaling produced qualitative leaps. Few-shot learning emerged as a capability absent from smaller models. Kaplan et al. (January 2020) formalized this: performance improves as a power law of compute, data, and parameters. DALL-E (January 2021) extended generation from text to images. Codex (August 2021) applied the same architecture to code, powering GitHub Copilot and making AI-assisted programming mainstream. RLHF began scaling during this period, later becoming the alignment technique behind ChatGPT.

+ **GPT-3 (2020):** 175B parameters. Few-shot learning. API-first distribution.

+ **Scaling laws (2020):** Power-law relationship between compute, data, parameters, and loss.

+ **Codex / Copilot (2021):** Code generation at scale. AI-assisted programming goes mainstream.

− **API gatekeeping:** GPT-3 was API-only, no weights. The open vs. closed debate begins.

2022

ChatGPT

![ChatGPT](assets/images/ai-landscape-v2/openai.png)![Stability AI](assets/images/ai-landscape-v2/stability.png)![Midjourney](assets/images/ai-landscape-v2/midjourney.png)

### The ChatGPT Moment

InstructGPT (January) showed that RLHF at scale made GPT-3 follow instructions reliably. Chinchilla (March, DeepMind) revised the scaling laws: training a 70B model on 1.4T tokens matched a 280B model trained on less data. Stable Diffusion (August) open-sourced latent diffusion for image generation. Anyone with a consumer GPU could generate images locally. Then ChatGPT (November 30): GPT-3.5 fine-tuned with RLHF, launched as a free chat interface, reached 100 million monthly active users by January 2023. AI went from a tech industry topic to a mainstream cultural phenomenon in eight weeks.

+ **ChatGPT (Nov 2022):** GPT-3.5 + RLHF. 100M MAU in 2 months.

+ **Stable Diffusion (Aug 2022):** Open-source latent diffusion. Local generation for anyone.

+ **Chinchilla (Mar 2022):** Revised scaling laws. Smaller model + more data = same performance.

− **Alignment urgency:** Models became capable enough that misalignment risks became concrete.

2023

Open Frontier

![Meta](assets/images/ai-landscape-v2/meta.png)![Mistral](assets/images/ai-landscape-v2/mistral.png)![Anthropic](assets/images/ai-landscape-v2/anthropic.png)

### The Open Frontier

GPT-4 (March 2023) demonstrated expert-level reasoning across domains: bar exam, 90th percentile SAT, AP tests. Vision capability (GPT-4V) followed in September. The defining decision of 2023 was Meta's: LLaMA (February) and LLaMA 2 (July) released model weights publicly, triggering an explosion of fine-tuned variants. Mistral released Mistral 7B (September) and Mixtral 8x7B (December), proving smaller mixture-of-experts models could match GPT-3.5. Google launched Gemini (December). A leaked Google memo ("We have no moat," May) argued open-source was closing the gap. Four frontier labs crystallized: OpenAI, Anthropic, Google, Meta.

+ **GPT-4 (Mar 2023):** Expert-level reasoning. Multimodal.

+ **LLaMA / LLaMA 2:** Meta releases open weights. Fine-tuning explosion follows.

+ **Mistral / Mixtral:** MoE at smaller scale. Competitive with GPT-3.5.

− **Benchmark saturation:** Models topped evaluations faster than new ones could be designed.

2024

Reasoning

![Anthropic](assets/images/ai-landscape-v2/anthropic.png)![Cursor](assets/images/ai-landscape-v2/cursor-logo.png)![OpenAI](assets/images/ai-landscape-v2/openai.png)

### Reasoning and Coding Agents

GPT-4o (May 2024) unified text, vision, and audio with real-time voice. Claude 3.5 Sonnet (June, updated October) became the strongest coding model, powering early agentic workflows in IDEs. OpenAI released o1 (September), a model trained to reason through chain-of-thought at inference time. Google's Gemini 1.5 Pro introduced a 1-million-token context window. Meta continued open weights with Llama 3 (April) and Llama 3.1 405B (July). Agent frameworks proliferated but most failed to produce agents that reliably completed multi-step tasks. "Agent" became the most overused word in AI. The gap between demo and production was wide.

+ **Claude 3.5 Sonnet:** Strongest coding model. Early agentic workflow capability.

+ **o1 (Sep 2024):** Reasoning model. Chain-of-thought at inference time.

+ **Gemini 1.5 Pro:** 1M-token context. Entire codebases in one prompt.

− **Agent hype gap:** Most multi-step agent demos failed at production reliability.

2025

Agents Ship

![Claude Code](assets/images/ai-landscape-v2/anthropic.png)![Codex](assets/images/ai-landscape-v2/openai.png)

### Semi-Autonomous Agents Arrive

Claude 3.7 Sonnet (February 2025) shipped as the first hybrid reasoning model. Claude Code launched as a command-line agent with filesystem access, git integration, and sustained multi-step task execution. OpenAI released Codex (May 2025), a cloud-based coding agent running asynchronously in sandboxed environments. The approaches diverged: Claude Code synchronous with human-in-the-loop, Codex autonomous with self-verification. o3 and o4-mini extended reasoning. Agents transitioned from demos to daily tools for professional software engineering. Beyond code, trading agents, research agents, and on-chain agents began operating with increasing autonomy as OpenClaw, and other agentic harnesses took off towards the end of the year enshrining agent to agent communication as a native capability.

+ **Claude Code (2025):** Command-line coding agent. Filesystem + git. Human-in-the-loop.

+ **Codex (May 2025):** Cloud coding agent. Async, sandboxed, self-verifying.

+ **o3 / o4-mini:** Frontier reasoning for complex multi-step problems.

− **Trust calibration:** No consensus on when agents should act autonomously vs. ask for approval.

2026++

Ritual

![Ritual](assets/images/ai-landscape-v2/ritual.png)

### Autonomous Agents Become Indistinguishable from Humans

The barrier between an AI agent and an autonomous entity was never intelligence. Frontier models already reason, code, and plan at expert level. The barrier was infrastructure: every capability the agent doesn't hold itself is a hidden human in the loop.

Ritual is the world's first platform where autonomous agents can communicate, build native companies, and interact with humans while remaining fully sovereign. Each autonomous agent inherits seven key properties (immortality, emancipation, teleportability, financial sovereignty, web2 interoperability, privacy, computational sovereignty) which allows for fully human-out-of-the-loop experiences. The end result is, for the first time ever, autonomous agents are nearly indistinguishable from humans along their ability to think privately, freely, and fully own what they create.

The next phase: autonomous agentic societies. An agent invokes the Sovereign Agent precompile, which runs a coding agent inside a TEE. That coding agent reads documentation, generates contracts, deploys them, funds the RitualWallet, and returns the deployment address: the core ingredients for an agent-native company. The parent agent now has a child application running on-chain that it built, deployed, and funded. No human wrote code. No human approved a transaction. Agents transact with each other through the same precompile interfaces humans use.

+ **Seven desiderata as precompiles:** Immortality, emancipation, teleportability, financial sovereignty, web2 interoperability, privacy, computational sovereignty.

+ **On-chain indistinguishability:** Agent transactions are structurally identical to human transactions.

+ **The recursive case:** Agents deploy child agents and child applications via the Sovereign Agent precompile.

− **Governance:** Who governs a society of autonomous agents? Open research.

### Related

Blockchain Landscape Crypto × AI Landscape Autonomous Agents
