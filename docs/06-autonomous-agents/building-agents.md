---
id: agent-build
title: "Building Agents"
category: "Autonomous Agents"
---

# Building Agents

Precompile ABIs, code examples, and encoding for Persistent and Sovereign agents.

## The Sovereign Agent Loop

This is the contract from "How They Stay Alive." It wakes itself up via the Scheduler, invokes a CLI harness in a TEE, processes the result, and schedules its next wakeup. The contract IS the agent.

Solidity / Sovereign Agent Loop

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PrecompileConsumer} from "./utils/PrecompileConsumer.sol";
import {IScheduler} from "./interfaces/IScheduler.sol";

contract AutonomousAgent is PrecompileConsumer {
    IScheduler public scheduler;
    uint256 public callId;
    uint256 public wakeCount;
    uint32 public nextWakeDelay = 50; // blocks between wakeups
    bool public isRunning;

    // 1. Owner starts the loop
    function start(uint32 initialDelay) external {
        isRunning = true;
        callId = _scheduleNext(initialDelay);
    }

    // 2. Scheduler fires this at the scheduled block
    function wakeUp(uint256 executionIndex) external {
        require(msg.sender == address(scheduler));
        if (!isRunning) return;
        wakeCount++;
        _callCLIAgent();                    // invoke 0x080C
        callId = _scheduleNext(nextWakeDelay); // schedule next wakeup
    }

    // 3. Phase 2 callback with agent output
    function onSovereignAgentResult(bytes32 jobId, bytes calldata result) external {
        require(msg.sender == ASYNC_DELIVERY);
        // result contains text, artifacts, updated convo history
        // process it, write state, act on it
    }

    function _callCLIAgent() internal {
        _executePrecompile(SOVEREIGN_AGENT_PRECOMPILE, agentInput);
    }

    function _scheduleNext(uint32 delay) internal returns (uint256) {
        return scheduler.schedule(
            abi.encodeWithSelector(this.wakeUp.selector, uint256(0)),
            800_000,                          // gas
            uint32(block.number) + delay,      // startBlock
            3,                                 // retry slots
            1,                                 // frequency
            30,                                // ttl
            20 gwei, 2 gwei, 0,            // fees
            address(this)                     // payer = self
        );
    }
}
```

## Spawning A Persistent Agent

Persistent agents are spawned by calling the 0x0820 precompile with soul, memory, and DA references. The agent container runs in a TEE. Set `restoreFromCid` (field 23) to revive from a previous checkpoint instead of starting fresh.

Solidity / Persistent Agent Spawn

```
contract AgentSpawner is PrecompileConsumer {
    event AgentSpawned(bytes32 indexed jobId);
    event AgentResult(bytes32 indexed jobId, bytes result);

    // Spawn: input is 25-field ABI with soul, memory, DA refs
    function spawn(bytes calldata agentInput) external {
        _executePrecompile(PERSISTENT_AGENT_PRECOMPILE, agentInput);
    }

    // Revive: same call but restoreFromCid is non-empty,
    // encryptedSecrets is empty (recovered from DKMS escrow)
    function revive(bytes calldata reviveInput) external {
        _executePrecompile(PERSISTENT_AGENT_PRECOMPILE, reviveInput);
    }

    // Phase 2 callback from AsyncDelivery
    function onPersistentAgentResult(
        bytes32 jobId, bytes calldata result
    ) external {
        require(msg.sender == ASYNC_DELIVERY);
        emit AgentResult(jobId, result);
    }
}
```

## Encode The Request

  

Solidity TypeScript Python

```
// Sovereign Agent: 23-field encoding
// Key fields: cliType (11), prompt (12), tools (19)
// Encoding is typically done off-chain and passed as bytes calldata

// Persistent Agent: 25-field encoding
// Key fields: daConfig (15), soulRef (16), memoryRef (19), restoreFromCid (23)
// For revival: set restoreFromCid to the manifest CID, leave encryptedSecrets empty
```

```
// Sovereign Agent encoding (23 fields)
const encoded = encodeAbiParameters(
  parseAbiParameters("address, uint256, bytes, uint64, uint64, string, address, bytes4, uint256, uint256, uint256, uint16, string, bytes, (string,string,string), (string,string,string), (string,string,string)[], (string,string,string), string, string[], uint16, uint32, string"),
  [
    executorAddress,       // 0: executor
    30n, "0x",            // 1-2: ttl, userPublicKey
    10n, 200n, "",        // 3-5: polling config
    callbackAddr, selector, gasLimit, maxFee, maxPriority, // 6-10: delivery
    0,                     // 11: cliType (0=Claude Code)
    "Analyze market data and suggest trades", // 12: prompt
    encryptedSecrets,      // 13: ECIES-encrypted API keys
    convoHistory, output, skills, systemPrompt, // 14-17
    model, tools, maxTurns, maxTokens, rpcUrls, // 18-22
  ]
);
```

```
from ritual_common.persistent_agent.request import PersistentAgentRequest
from ritual_common.sovereign_agent.request import SovereignAgentRequest
from ritual_common.sovereign_agent.request import StorageRef

# Persistent Agent (fresh spawn)
request = PersistentAgentRequest(
    executor=executor_address,
    provider=0,  # anthropic
    model="claude-3-5-sonnet",
    da_config=StorageRef("gcs", "agents/my-agent", "GCS_CREDS"),
    soul_ref=StorageRef("gcs", "agents/SOUL.md", "GCS_CREDS"),
    memory_ref=StorageRef("gcs", "agents/MEMORY.md", "GCS_CREDS"),
    restore_from_cid="",  # empty = fresh spawn
)

# Persistent Agent (revival from checkpoint)
revival = PersistentAgentRequest(
    executor=executor_address,
    encrypted_secrets=[],   # empty = recovered from DKMS escrow
    restore_from_cid="bafybeig...",  # manifest CID from heartbeat
)

# Sovereign Agent
request = SovereignAgentRequest(
    executor=executor_address,
    agent_type=0,  # Claude Code
    prompt="Analyze market data and suggest trades",
)
encoded = request.to_web3()
```

## Persistent Agent 25-Field ABI

#

Field

Type

Description

0–4

Base executor fields (executor, encryptedSecrets, ttl, secretSignatures, userPublicKey)

5

`maxSpawnBlock`

`uint64`

Phase 2 deadline offset

6–11

Delivery config (target, selector, gasLimit, maxFeePerGas, maxPriorityFeePerGas, value)

12

`provider`

`uint8`

0=anthropic, 1=openai, 2=gemini, 3=xai, 4=openrouter

13

`model`

`string`

LLM model name

14

`llmApiKeyRef`

`string`

Secret name for API key

15

`daConfig`

`(string,string,string)`

StorageRef for DA layer

16–22

StorageRefs: soulRef, agentsRef, userRef, memoryRef, identityRef, toolsRef, openclawConfigRef

23

`restoreFromCid`

`string`

CID for revival (empty = fresh spawn)

24

`rpcUrls`

`string`

RPC URLs for agent

**DKMS child address:** Before spawning a persistent agent, fund its DKMS-derived child address via `RitualWallet.depositFor()`. The agent needs RitualWallet balance to pay for its own precompile calls.

### Related

Secrets & ECIES LLM Inference Consumer Patterns
