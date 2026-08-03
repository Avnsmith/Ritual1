# WowWeb — Autonomous AI Browser Agent on RitualNet

**Tagline**: *Don't browse. Just ask.*  
**Overview**: WowWeb is a production-quality, Web2-grade autonomous AI Browser Agent running on RitualNet infrastructure (`Chain ID: 1979`). It conducts autonomous web research, reads technical documentation and repositories, executes multi-step web browsing tasks, generates structured research reports, and anchors every execution with an immutable, verifiable proof published directly on RitualNet.

---

## 🚀 Key Features

1. **Autonomous Web Browser Agent**:
   - Fetches web pages, extracts clean markdown content, parses GitHub repositories and developer documentation.
   - Built-in prompt injection defense and URL sanitization sandboxing.

2. **Multi-Agent Pipeline**:
   - **Planner Agent**: Deconstructs requests into search sub-tasks.
   - **Browser Agent**: Web crawling and content extraction.
   - **Research Agent**: Synthesizes key findings, pros/cons, and comparison matrices.
   - **Summary Agent**: Renders formatted markdown reports with citations.
   - **Verification Agent**: Computes `keccak256` hash commitments.
   - **Proof Publisher**: Broadcasts proof transactions to RitualNet.

3. **Mandatory Wallet Authentication**:
   - Required wallet connection (MetaMask, Coinbase Wallet, WalletConnect via Wagmi/Viem).
   - EIP-4361 signed session challenge linking every execution to `ownerWallet`, `agentId`, `executionId`, and `txHash`. No guest mode.

4. **Verifiable On-Chain Proofs**:
   - Proof commitments stored in `WowWebProofRegistry` on RitualNet (`Chain ID: 1979`).
   - Stores `promptHash`, `executionHash`, `outputHash`, `visitedUrlsHash`, `ownerWallet`, and `timestamp`.
   - Direct link to Ritual Block Explorer (`https://explorer.ritualfoundation.org`).

5. **Linear/Arc Browser Grade Aesthetic**:
   - Dark mode glassmorphism UI, Framer Motion animations, live SSE real-time trajectory timeline, Markdown & report export.

---

## 📂 Project Structure

```
/Users/vinh/Desktop/ritual/
├── apps/
│   ├── web/                     # Next.js 14 App Router UI (Dashboard, Execution, Proof, History, Profile)
│   └── server/                  # Express API Server, SIWE auth, agent pipeline, SSE streaming
├── packages/
│   ├── shared/                  # RitualNet chain definition (1979), Viem client, crypto hash utilities
│   ├── contracts/               # WowWebProofRegistry.sol smart contract & ABIs
│   └── agents/                  # Multi-agent orchestrator & pipeline agents
├── docs/                        # Complete Ritual developer documentation knowledge base
├── skills/                      # Complete Ritual agent skills catalog
├── ARCHITECTURE.md              # Detailed architectural blueprint & precompile specs
├── DEPLOYMENT.md                # Deployment and environment guide
└── DEMO.md                      # Hackathon presentation script & demo scenario
```

---

## ⚡ RitualNet Native Integration

- **Chain ID**: `1979`
- **RPC Endpoint**: `https://rpc.ritualfoundation.org`
- **Explorer**: `https://explorer.ritualfoundation.org`
- **Ritual Precompiles**:
  - `0x0801` (HTTP Precompile)
  - `0x0802` (LLM Inference Precompile)
  - `0x0805` (Long-Running HTTP Precompile)
  - `0x0820` (Stateful Agent Precompile)
- **Core System Contracts**:
  - `RitualWallet`: `0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948`
  - `SecretsAccessControl`: `0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD`
  - `WowWebProofRegistry`: `0x8A79c67B92A2C683dFE59188FfA20C215682C5E0`

---

## 🛠 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build all packages
npm run build:packages

# 3. Start server (Port 3001)
npm run dev:server

# 4. Start web application (Port 3000)
npm run dev:web
```
Open `http://localhost:3000` in your browser.
