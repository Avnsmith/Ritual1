# WowWeb Architecture Blueprint

**Tagline**: *Don't browse. Just ask.*  
**System Architecture & Technical Specifications**

---

## 1. Executive Summary

WowWeb is a production-quality, Web2-grade autonomous AI Browser Agent built natively on **RitualNet** infrastructure (`Chain ID: 1979`). Unlike generic AI chatbots, WowWeb operates as an autonomous agent that navigates web pages, reads documentation, inspects GitHub repositories, synthesizes structured research reports, and anchors every execution with an immutable cryptographic proof registered directly on RitualNet.

---

## 2. Monorepo Architecture

```
/Users/vinh/Desktop/ritual/
├── apps/
│   ├── web/                     # Next.js 14 App Router, TailwindCSS, Framer Motion, Wagmi/Viem v2
│   └── server/                  # Node.js Express server, SIWE auth, agent orchestrator, SSE streaming
└── packages/
    ├── shared/                  # RitualNet chain config (1979), Viem client, crypto hash utilities, schemas
    ├── contracts/               # WowWebProofRegistry.sol smart contract, ABIs, deployed addresses
    └── agents/                  # Multi-Agent pipeline (Planner, Browser, Research, Summary, Verification, Proof Publisher)
```

---

## 3. On-Chain vs Off-Chain Separation

| Layer | Component | Execution Details |
| :--- | :--- | :--- |
| **Off-Chain** | Browser Agent | Axios/Cheerio web crawling, DOM parsing, HTML sanitization |
| **Off-Chain** | AI Research Agent | Structured synthesis, matrix comparison, pros/cons generation |
| **Off-Chain** | Verification Agent | Computing `keccak256` hash commitments of prompt, trace, and output |
| **Off-Chain** | SSE Event Stream | Real-time trajectory progress streaming to Next.js UI |
| **On-Chain** | RitualNet Consensus | Symphony consensus block execution (`Chain ID: 1979`) |
| **On-Chain** | WowWebProofRegistry | Storing `promptHash`, `executionHash`, `outputHash`, `visitedUrlsHash`, `ownerWallet`, `agentId` |
| **On-Chain** | Ritual Precompiles | Enshrined HTTP (`0x0801`), LLM (`0x0802`), Long HTTP (`0x0805`), Stateful Agent (`0x0820`) |
| **On-Chain** | System Contracts | `RitualWallet` (`0x532F...D58B`), `SecretsAccessControl` (`0xf9BF...32FD`) |

---

## 4. Multi-Agent Pipeline

```
[ User Request ]
       │
       ▼
 ┌───────────────┐
 │ Planner Agent │  --> Deconstructs prompt into search sub-tasks
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │ Browser Agent │  --> Fetches web pages, GitHub repos, docs & sanitizes HTML
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │ Research Agent│  --> Synthesizes key findings, matrix, and confidence score
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │ Summary Agent │  --> Formats markdown report and source citations
 └───────┬───────┘
         │
         ▼
┌────────────────────┐
│ Verification Agent │  --> Computes keccak256 hashes of prompt, output, sources
└────────┬───────────┘
         │
         ▼
 ┌─────────────────┐
 │ Proof Publisher │  --> Transacts proof to WowWebProofRegistry on RitualNet
 └─────────────────┘
```

---

## 5. Security & Isolation

1. **Website Sandboxing**: DOM parsing occurs in isolated, script-disabled Cheerio contexts.
2. **Prompt Injection Protection**: Untrusted web text is sanitized via `sanitize-html` and wrapped in strict `<external_web_content>` tags.
3. **URL Deny Rules**: Local loopback (`127.0.0.1`, `10.0.0.0/8`), non-HTTP protocols (`file://`, `gopher://`) are strictly blocked.
4. **Wallet Authentication**: Required EIP-4361 signature verification before accessing server execution endpoints.
