# WowWeb — Hackathon Submission Guide

**Project Name**: WowWeb  
**Tagline**: *Don't browse. Just ask.*  
**Track**: Infrastructure & Autonomous Agents on Ritual  
**Target Chain**: RitualNet (`Chain ID: 1979`)  
**Contract Address**: [`0x8A79c67B92A2C683dFE59188FfA20C215682C5E0`](https://explorer.ritualfoundation.org/address/0x8A79c67B92A2C683dFE59188FfA20C215682C5E0)  
**Live Application**: `http://localhost:3000` (Backend API on `http://localhost:3001`)

---

## 🎯 1. One Sentence Pitch
WowWeb is an autonomous AI browser agent running on RitualNet that conducts multi-step web research, extracts documentation, and anchors immutable cryptographic execution proofs directly on-chain for total execution transparency.

---

## 💡 2. The Problem
Traditional AI web agents (e.g. Perplexity, Manus, Operator) operate inside centralized cloud infrastructure. They function as **black boxes**:
- Users cannot verify if the agent actually crawled the cited sources or synthesized fake data.
- Execution history is mutable and can be quietly altered or deleted by platform operators.
- No cryptographic link exists between the user's prompt, the agent's browsing trajectory, and the final output report.

---

## 🚀 3. The Solution
WowWeb transforms browser automation into a **verifiable on-chain agent service**:
1. **Wallet-Native Identity**: Users sign in with their Web3 wallet using EIP-4361 (SIWE). Every execution is tied directly to the user's wallet address.
2. **Multi-Agent Orchestration**: A 6-agent modular pipeline (`Planner`, `Browser`, `Research`, `Summary`, `Verification`, `ProofPublisher`) executes web research off-chain.
3. **RitualNet Proof Commitments**: Before rendering the report, WowWeb computes `keccak256` hashes of the prompt, agent execution trajectory, output report, and visited URLs, and broadcasts a verification transaction to `WowWebProofRegistry` on RitualNet.
4. **Transparent Auditability**: Anyone can verify the execution proof on the Ritual Block Explorer or view the interactive Proof Explorer UI (`/proof/[id]`).

---

## ⚡ 4. Ritual Integration Architecture

WowWeb utilizes official RitualNet infrastructure (`Chain ID: 1979`, RPC `https://rpc.ritualfoundation.org`):

### Ritual Precompiles Utilized:
- **`0x0801` (HTTP Precompile)**: Utilized for outbound web crawling and source fetching.
- **`0x0802` (LLM Inference Precompile)**: Used for on-chain AI agent prompt evaluation and structured JSON output synthesis.
- **`0x0805` (Async HTTP Precompile)**: Handles long-running multi-page web scraping requests.
- **`0x0820` (Stateful Agent Precompile)**: Manages autonomous agent execution state & memory.

### System Contracts:
- `RitualWallet` (`0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948`)
- `SecretsAccessControl` (`0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD`)
- `WowWebProofRegistry` (`0x8A79c67B92A2C683dFE59188FfA20C215682C5E0`)

---

## 🎬 5. Demo Flow

```
1. Landing Page (http://localhost:3000) -> Click "Connect Wallet"
2. Sign EIP-4361 Auth Challenge -> Redirection to Dashboard (/dashboard)
3. Enter Research Task -> "Research Ritual ecosystem and summarize latest developments"
4. Observe Real-Time SSE Agent Trajectory Stream:
   - [Planner Agent] Query decomposition
   - [Browser Agent] Web scraping docs.ritualfoundation.org & skills.ritualfoundation.org
   - [Research Agent] Synthesis & matrix comparison
   - [Summary Agent] Report formatting
   - [Verification Agent] Hash commitment computation
   - [Proof Publisher] RitualNet transaction broadcast
5. View Report & Click "View On-Chain Proof" -> Proof Explorer (/proof/[id])
```

---

## 📜 6. Verified Proof Example

- **Execution ID**: `0xc77dd5b16255a0a0c1c42ee34cdb3004d6784b1454df75e5b2bd925175597b4c`
- **Prompt Hash**: `0x89419c79de6d9c2c0710a84bbdc0ae8ca5c410e32adeb2319a748f6311f75442`
- **Execution Hash**: `0x3a43f8598e468d9807958527de6ea49b0c4f9a43a4894fcb2dc86d34e7bbc1c1`
- **Output Hash**: `0x3a4248d994f29c59f2376fcfd6e73d7235d41e4735f4e83a4cdb92d78a8a3529`
- **Visited Sources Hash**: `0xd4b2fb843aa473f019f9d64e217ba55fe69f067814a3cce58addadd68ee9a252`
- **Owner Wallet**: `0x3eC7380d5AEaee2f0254cD4575ceAc0d8b6CA15A`
- **Transaction Hash**: `0xc77dd5b16255a0a0c1c42ee34cdb3004d6784b1454df75e5b2bd925175597b4c`
- **Ritual Explorer URL**: [https://explorer.ritualfoundation.org/tx/0xc77dd5b16255a0a0c1c42ee34cdb3004d6784b1454df75e5b2bd925175597b4c](https://explorer.ritualfoundation.org/tx/0xc77dd5b16255a0a0c1c42ee34cdb3004d6784b1454df75e5b2bd925175597b4c)

---

## 🔮 7. Future Roadmap

1. **TEE Enclave Browser Execution**: Execute browser web fetching inside Intel SGX / SpaceTEE enclaves for cryptographic hardware attestation.
2. **Automated Transaction Execution**: Enable agents to perform on-chain swaps or contract interactions on behalf of the user with session key authorization.
3. **Decentralized Agent Marketplace**: Allow developers to publish custom specialized sub-agents and earn RITUAL token rewards.
