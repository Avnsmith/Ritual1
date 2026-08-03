---
id: async-lifecycle
title: "Async Lifecycle"
category: "Reference"
---

# Async Lifecycle

Every async precompile call moves through a state machine. Here's what each state means and what to watch for.

AsyncJobTracker tracks the lifecycle of every async job. State transitions fire events: `JobAdded`, `Phase1Settled`, `ResultDelivered`, `JobRemoved`. Subscribe to these in your frontend to keep the UI in sync.

Async State Machine

.al-node { font-family: Barlow; font-size: 11px; font-weight: 500; } .al-glow { animation: alGlow 3s ease-in-out infinite; } @keyframes alGlow { 0%,100%{filter:drop-shadow(0 0 2px rgba(255, 255, 255,0.1))} 50%{filter:drop-shadow(0 0 8px rgba(255, 255, 255,0.4))} } .al-arrow { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 2.5s ease forwards; } Submitted Committed Processing Ready Settled Delivering Callback ✓ Failed Expired SPC path → Two-phase →

## State Descriptions

State

Description

Path

**Submitted**

Request sent to precompile, pending executor assignment

Both

**Committed**

Executor has accepted the job, TEE attestation verified

Both

**Processing**

Executor is computing the result inside TEE

Both

**Ready**

Result computed, pending settlement (SPC) or delivery (two-phase)

Both

**Settled**

Result available in `receipt.spcCalls`

SPC

**Delivering**

AsyncDelivery is calling back into your contract

Two-phase

**Callback**

Your contract's callback has been executed with the result

Two-phase

**Failed**

Executor error. Request can be retried

Both

**Expired**

No executor picked up the job within the timeout

Both

TypeScript / Watching Async Job Events

```
import { watchContractEvent } from "viem";

watchContractEvent(client, {
  address: "0xC069FFCa0389f44eCA2C626e55491b0ab045AEF5",
  abi: asyncJobTrackerAbi,
  eventName: "JobAdded",
  args: { sender: userAddress },
  onLogs(logs) {
    const { jobId, status } = logs[0].args;
    // Update UI state machine
  },
});
```

### Related

Execution Models Frontend Hooks Consumer Patterns
