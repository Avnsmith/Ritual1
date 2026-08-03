# WowWeb Hackathon Presentation & Demo Script

**Project**: WowWeb — Autonomous AI Browser Agent on RitualNet  
**Tagline**: *Don't browse. Just ask.*

---

## 🎬 Hackathon Walkthrough Script

### Scene 1: The Problem & The Vision
> *"Traditional AI chatbots are black boxes. When an AI searches the web for you, how do you know what sources it visited? How do you verify that the execution trace hasn't been tampered with? WowWeb solves this by pairing autonomous browser agents with RitualNet's on-chain verification."*

### Scene 2: Landing Page & Mandatory Wallet Connection
1. Open `http://localhost:3000`.
2. Showcase the modern Web2 SaaS hero UI (Linear/Arc aesthetic, glowing gradient typography).
3. Click **"Connect Wallet"**.
4. Select MetaMask/Wagmi connector.
5. Demonstrate network auto-detection for **RitualNet (Chain ID: 1979)**.
6. Sign the EIP-4361 cryptographic message challenge to register the wallet as the Agent Owner.

### Scene 3: Executing Autonomous Web Research
1. Arrive at the Dashboard (`/dashboard`).
2. Click the suggested prompt: *"Research top autonomous AI browser agents in 2026"*.
3. Click **"Research"** to launch the multi-agent pipeline.
4. Watch the real-time **Execution Trajectory**:
   - **Planner Agent**: Deconstructs task into sub-queries.
   - **Browser Agent**: Crawls web pages, GitHub repositories, and developer documentation.
   - **Research Agent**: Synthesizes key findings, pros/cons, and comparison matrix.
   - **Summary Agent**: Formats structured Markdown report.
   - **Verification Agent**: Computes `keccak256` hash commitments (`promptHash`, `outputHash`, `visitedUrlsHash`).
   - **Proof Publisher**: Transacts proof onto `WowWebProofRegistry` contract on RitualNet (`Chain ID: 1979`).

### Scene 4: Verifying the RitualNet Proof
1. Inspect the generated **Executive Summary**, **Comparison Matrix**, and **Verified Source Citations**.
2. Click **"View Ritual Proof"** on the verified banner badge.
3. Show the `promptHash`, `outputHash`, `visitedUrlsHash`, and click the Ritual Explorer link (`https://explorer.ritualfoundation.org/tx/0x...`).
4. Demonstrate task auditability under **Task History** (`/history`) and **Profile** (`/profile`).
