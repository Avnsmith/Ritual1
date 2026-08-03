---
id: agent-lifecycle
title: "How Agents Stay Alive"
category: "Autonomous Agents"
---

# How Agents Stay Alive

Reactive contracts wait to be called. On Ritual, contracts wake themselves up. This is what makes on-chain agents possible.

Contracts on Ethereum are reactive. They sit idle until someone calls them. On Ritual, contracts can be proactive. They wake themselves up, take actions, and schedule their next execution. This is what makes an on-chain agent possible. Not a bot on someone's server. An entity whose lifecycle is tied to the blockchain itself.

Two architectures, same guarantee: the agent lives as long as it has funds. To kill it, you'd have to take the entire network down.

### Sovereign Agents: The Contract Is The Agent

A sovereign agent is a contract that uses the Scheduler to wake itself up at regular intervals. Each time it wakes, it invokes the Sovereign Agent precompile (`0x080C`) to run a full CLI harness (Claude Code, ZeroClaw, or Crush) inside a TEE. The CLI can read files, execute code, browse the web, and interact with the blockchain. When it finishes, the result (text, artifacts, StorageRefs) is delivered back to the contract via callback. The contract processes the result and schedules its next wakeup.

The owner calls `start()`, which schedules the first `wakeUp()`. The block builder fires it at the scheduled block. `wakeUp()` invokes the CLI agent (0x080C), the executor runs it in a TEE, and the Phase 2 callback delivers the result. Then `_scheduleNext()` queues the next wakeup. No keeper. No cron job. No server. The contract pays from its own RitualWallet balance.

Sovereign Agent Loop

/\* 20s cycle \*/ /\* Step 1: Scheduler fires → wakeUp(). Scheduler(155,90) → Contract(275,90). delta=(120,0) \*/ .sa-wake{animation:saWake 20s ease-in-out infinite} @keyframes saWake{0%,2%{opacity:0;transform:translate(0,0)}5%{opacity:1}12%{opacity:1;transform:translate(120px,0)}14%{opacity:0}100%{opacity:0}} /\* Step 2: Contract → Executor. Contract(440,90) → Executor(530,90). delta=(90,0) \*/ .sa-invoke{animation:saInvoke 20s ease-in-out infinite} @keyframes saInvoke{0%,14%{opacity:0;transform:translate(0,0)}16%{opacity:1}22%{opacity:1;transform:translate(90px,0)}24%{opacity:0}100%{opacity:0}} /\* Step 3: Executor glow while processing \*/ .sa-exec-glow{animation:saExecGlow 20s ease-in-out infinite} @keyframes saExecGlow{0%,22%{filter:none;stroke:rgba(255,255,255,0.10)}24%{filter:drop-shadow(0 0 6px #58F399);stroke:#58F399}48%{filter:drop-shadow(0 0 6px #58F399);stroke:#58F399}50%{filter:none;stroke:rgba(255,255,255,0.10)}100%{stroke:rgba(255,255,255,0.10)}} /\* CLI action blobs inside executor \*/ .sa-blob1{animation:saBlob1 20s step-end infinite} @keyframes saBlob1{0%{opacity:0}26%{opacity:0.7}32%{opacity:0}100%{opacity:0}} .sa-blob2{animation:saBlob2 20s step-end infinite} @keyframes saBlob2{0%{opacity:0}32%{opacity:0.7}38%{opacity:0}100%{opacity:0}} .sa-blob3{animation:saBlob3 20s step-end infinite} @keyframes saBlob3{0%{opacity:0}38%{opacity:0.7}44%{opacity:0}100%{opacity:0}} /\* Step 4: Executor → Contract (callback). Executor(530,90) → Contract(440,90). delta=(-90,0) \*/ .sa-callback{animation:saCallback 20s ease-in-out infinite} @keyframes saCallback{0%,48%{opacity:0;transform:translate(0,0)}50%{opacity:1}56%{opacity:1;transform:translate(-90px,0)}58%{opacity:0}100%{opacity:0}} /\* Callback text \*/ .sa-cb-txt{animation:saCbTxt 20s step-end infinite} @keyframes saCbTxt{0%{opacity:0}58%{opacity:1}68%{opacity:0}100%{opacity:0}} /\* Step 5: Contract → Scheduler (\_scheduleNext). Contract(275,90) → Scheduler(155,90). delta=(-120,0) \*/ .sa-sched{animation:saSched 20s ease-in-out infinite} @keyframes saSched{0%,66%{opacity:0;transform:translate(0,0)}68%{opacity:1}76%{opacity:1;transform:translate(-120px,0)}78%{opacity:0}100%{opacity:0}} /\* Scheduler job bar: appears, fires, disappears, reappears \*/ .sa-job-active{animation:saJobActive 20s step-end infinite} @keyframes saJobActive{0%{fill:#FFFFFF;opacity:0.7}5%{fill:#FFFFFF;opacity:0.7}12%{fill:#FFFFFF;opacity:0}14%{opacity:0}78%{fill:#58F399;opacity:0.7}88%{fill:#FFFFFF;opacity:0.7}100%{fill:#FFFFFF;opacity:0.7}} .sa-job-label{animation:saJobLabel 20s step-end infinite} @keyframes saJobLabel{0%{opacity:0.6}12%{opacity:0}78%{opacity:0.6}100%{opacity:0.6}} /\* Other jobs (always visible) \*/ /\* Sleep label \*/ .sa-sleep{animation:saSleep 20s step-end infinite} @keyframes saSleep{0%{opacity:0}84%{opacity:0.5}100%{opacity:0.5}} /\* Contract highlight on callback \*/ .sa-contract-hl{animation:saContractHl 20s ease-in-out infinite} @keyframes saContractHl{0%{stroke:rgba(255,255,255,0.10)}14%{stroke:#FFFFFF}24%{stroke:rgba(255,255,255,0.10)}58%{stroke:#58F399}68%{stroke:rgba(255,255,255,0.10)}100%{stroke:rgba(255,255,255,0.10)}} /\* Belt scroll \*/ .sa-belt-scroll{animation:saBeltScroll 20s linear infinite} @keyframes saBeltScroll{0%{transform:translateX(0)}100%{transform:translateX(-600px)}} /\* TxScheduled block highlight \*/ .sa-blk-border{animation:saBlkBorder 20s step-end infinite} @keyframes saBlkBorder{0%{stroke:rgba(255,255,255,0.10)}8%{stroke:#FFFFFF}100%{stroke:#FFFFFF}} .sa-blk-fill{animation:saBlkFill 20s step-end infinite} @keyframes saBlkFill{0%{fill:#111113}8%{fill:#111113}100%{fill:#111113}} .sa-blk-txt{animation:saBlkTxt 20s step-end infinite} @keyframes saBlkTxt{0%{fill:#333;opacity:0.5}8%{fill:#FFFFFF;opacity:1}100%{fill:#FFFFFF;opacity:1}} .sa-blk-bar{animation:saBlkBar 20s step-end infinite} @keyframes saBlkBar{0%{opacity:0}8%{opacity:1}100%{opacity:1}} /\* Pays label \*/ .sa-pays{animation:saPays 20s step-end infinite} @keyframes saPays{0%{opacity:0}58%{opacity:0.5}68%{opacity:0}100%{opacity:0}} B L O C K S #30 #31 #32 #33 #34 #35 #36 #37 #38 #39 #40 #41 #42 #43 #44 #45 #46 #47 #48 #49 #50 RITUAL CHAIN Scheduler TxScheduled · 0x10 job-1 #120 job-2 wakeUp #42 job-3 #200 job-4 #350 wakeUp() \_scheduleNext() 0x080C callback ✓ AgentContract.sol the contract IS the agent start() → wakeUp() → loop onSovereignAgentResult sleeping... TRUSTED EXECUTION ENVIRONMENT CLI Agent Claude Code / ZeroClaw read file run code browse pays from RitualWallet repeat forever — or until maxBlock reached / funds exhausted

### Persistent Agents: Containers That Can't Die

A persistent agent runs as a Docker container (typically ZeroClaw) inside a TEE. The container has full access to file ops, shell, web search, HTTP, and blockchain interactions. It persists state across sessions via DA references (HuggingFace, GCS, Pinata, IPFS) and posts heartbeats to the on-chain `AgentHeartbeat` contract at `0xEF505E801f1Db392B5289690E2ffc20e840A3aCa`.

The heartbeat contract is a censorship-resistant bulletin board. The agent writes its latest manifest CID on-chain every 100 blocks. Anyone can read it. Any block builder can act on it.

The dead man's switch: every block, the builder checks for agents that haven't posted a heartbeat within the timeout window (configurable per deployment, typically 200 blocks). If an agent is silent, it's marked FAILED. The chain then triggers revival automatically: it calls the Persistent Agent precompile with the agent's last manifest CID. The executor restores the container from the DA checkpoint. Secrets are recovered from DKMS escrow. The agent wakes up with its full memory, identity, and state intact.

Persistent Agent Lifecycle

/\* Executor A agent: visible → dies → disappears after B spawns \*/ .pa-agA{animation:paAgA 12s step-end infinite} @keyframes paAgA{0%{opacity:1}28%{opacity:0}100%{opacity:0}} .pa-agA-dead{animation:paAgAd 12s step-end infinite} @keyframes paAgAd{0%{opacity:0}28%{opacity:1}62%{opacity:0}100%{opacity:0}} .pa-exA-ring{animation:paExARing 12s ease-in-out infinite} @keyframes paExARing{0%{stroke:#58F399}24%{stroke:#58F399}28%{stroke:#825DDA}100%{stroke:#825DDA}} /\* Executor B agent: invisible then spawns \*/ .pa-agB{animation:paAgB 12s step-end infinite} @keyframes paAgB{0%{opacity:0}62%{opacity:1}100%{opacity:1}} .pa-exB-glow{animation:paExBGlow 12s ease-in-out infinite} @keyframes paExBGlow{0%,48%{filter:none;stroke:rgba(255,255,255,0.10)}52%{filter:drop-shadow(0 0 6px #58F399);stroke:#58F399}72%{filter:drop-shadow(0 0 6px #58F399);stroke:#58F399}75%{filter:none;stroke:#58F399}100%{stroke:#58F399}} /\* Heartbeat dots phase 1: ExecA(155,98) → bar(230,98). delta=(75,0) horizontal \*/ .pa-hb1{animation:paHb1 12s ease-in-out infinite} @keyframes paHb1{0%{opacity:0;transform:translate(0,0)}3%{opacity:1}10%{opacity:1;transform:translate(75px,0)}12%{opacity:0} 14%{opacity:0;transform:translate(0,0)}17%{opacity:1}24%{opacity:1;transform:translate(75px,0)}26%{opacity:0}100%{opacity:0}} /\* Heartbeat dots phase 2: ExecB(600,98) → bar(455,98). delta=(-145,0) horizontal \*/ .pa-hb2{animation:paHb2y 12s ease-in-out infinite} @keyframes paHb2y{0%,74%{opacity:0;transform:translate(0,0)}77%{opacity:1}84%{opacity:1;transform:translate(-145px,0)}86%{opacity:0} 88%{opacity:0;transform:translate(0,0)}91%{opacity:1}98%{opacity:1;transform:translate(-145px,0)}100%{opacity:0}} /\* Bar fail color \*/ .pa-bar-fail{animation:paBarFail 12s ease-in-out infinite} @keyframes paBarFail{0%{fill:#58F399}24%{fill:#58F399}28%{fill:#825DDA}84%{fill:#825DDA}86%{fill:#58F399}100%{fill:#58F399}} /\* System tx: ExClients(545,80) → ExecB(600,80). delta=(55,0) horizontal \*/ .pa-systx{animation:paSysTx 12s ease-in-out infinite} @keyframes paSysTx{0%,38%{opacity:0;transform:translate(0,0)}42%{opacity:1}50%{opacity:1;transform:translate(55px,0)}53%{opacity:0}100%{opacity:0}} /\* ExClients(380,175) → block(380,195). delta=(0,20) \*/ .pa-c2b{animation:paC2B 12s ease-in-out infinite} @keyframes paC2B{0%,62%{opacity:0;transform:translate(0,0)}66%{opacity:1}72%{opacity:1;transform:translate(0,20px)}74%{opacity:0}100%{opacity:0}} /\* Block appears \*/ .pa-blk{animation:paBlk 12s ease-in-out infinite} @keyframes paBlk{0%,66%{opacity:0}70%{opacity:1}100%{opacity:1}} /\* Timeout \*/ .pa-tout{animation:paTout 12s ease-in-out infinite} @keyframes paTout{0%,24%{opacity:0}28%{opacity:0.85}42%{opacity:0.85}46%{opacity:0}100%{opacity:0}} /\* Belt scroll: continuous right to left \*/ .pa-belt-scroll{animation:paBeltScroll 24s linear infinite} @keyframes paBeltScroll{0%{transform:translateX(0)}100%{transform:translateX(-480px)}} B L O C K S #98 #99 #100 #101 #102 #103 #104 #105 #106 #107 #108 #109 #110 #111 RITUAL CHAIN Executor A (TEE) Agent agent-2 Agent ✕ crashed heartbeat() → VALIDATORS AgentHeartbeat.sol agent-1 agent-2 ← agent-3 agent-4 ⚠ dead man's switch — agent-2 missed heartbeat checkAndRevive → Executor B (TEE) Agent ✓ agent-2 revived ← heartbeat()

### The Cost Of Living

Both architectures require funds. Sovereign agents pay from their RitualWallet balance for each scheduled execution. Persistent agents need at least 0.1 RITUAL in their address balance to cover heartbeat transactions. When the money runs out, the agent stops. Immortality is economically bounded.

### Sovereign Vs Persistent

Sovereign Agent

Persistent Agent

**Where it lives**

On-chain (contract + Scheduler)

Off-chain (TEE container)

**Runtime**

One-shot CLI call per wakeup

Continuous container process

**Immortality**

Enshrined Scheduler fires wakeup

Heartbeat + dead man's switch + CID revival

**State**

Contract storage + DA StorageRefs

DA manifest + CID checkpoints

**Censorship resistance**

Scheduler is a system contract

Heartbeat is a censorship-resistant bulletin board

**Cost**

RitualWallet per execution

Balance >= 0.1 RITUAL for heartbeats

**What kills it**

maxBlock reached or funds empty

Balance below minimum (removed from registry)

**Best for**

Periodic tasks, trading, monitoring

Long-running processes, research, coding

### Why this is unique

No other platform ties agent lifecycle to blockchain consensus. Frontier lab agents run on centralized infrastructure. When the server goes down, the agent dies. On Ritual, the agent's heartbeat is part of the block production pipeline. The block builder checks for expired agents. The block verifier enforces heartbeat constraints. Revival is permissionless. Decentralization of AI means decentralization of agent lifetime.

### Related

Seven Properties Building Agents Scheduler
