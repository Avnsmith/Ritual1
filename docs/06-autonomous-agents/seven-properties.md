---
id: agents
title: "Autonomous Agents"
category: "Autonomous Agents"
---

# Autonomous Agents

Your contract can spawn autonomous agents that persist across transactions, with memory, identity, and the ability to revive themselves.

An autonomous agent that is indistinguishable from a human must have all seven of the properties below. Missing even one makes it a tool, not an agent.

## Seven Properties

Property

What it means

Ritual primitive

**Immortal**

Survives crashes, restarts, infra changes

Scheduler heartbeat + Persistent Agent revival

**Emancipated**

Controls own keys, no human holds private key

DKMS (`0x081B`)

**Teleportable**

Soul and memory portable across environments

DKMS-encrypted state on your choice of DA (decentralized or centralized) + auto-healing revival built into the protocol

**Financially sovereign**

Owns wallet, transacts independently

DKMS wallet + [RitualWallet](#)

**Web2-interoperable**

Calls APIs, browses web, uses HTTP services

HTTP (`0x0801`) + Long-Running HTTP (`0x0805`)

**Private**

Encrypted thought, private communication

TEE enclaves + ECIES + PII redaction

**Computationally sovereign**

No one can cut off access to AI

LLM (`0x0802`) + ONNX (`0x0800`) in TEE

## Agent Precompiles

Type

Precompile

Fields

Use case

Persistent Agent

`0x0820`

25

Stateful agent with soul, memory, DA, and revival

Sovereign Agent

`0x080C`

23

CLI-style agent execution in TEE (Claude Code, Crush, ZeroClaw)

On-chain agents that survive indefinitely with four architectural components: **soul** (identity, purpose, behavioral constraints), **memory** (accumulated state and knowledge), **DA** (data availability layer for durable persistence via StorageRef), and **revival** (deterministic re-instantiation from persisted state via CID).

### Persistent Agent (`0x0820`)

Stateful with soul, memory, identity, and data availability references. Persists across sessions via StorageRef (HuggingFace, GCS, Pinata, IPFS). Revival from CID restores full state. Two-phase async: Phase 1 submits the spawn, Phase 2 delivers the result via `onPersistentAgentResult(bytes32, bytes)` callback. One Persistent Agent call per transaction.

### Sovereign Agent (`0x080C`)

CLI-style agent execution inside a TEE. The precompile invokes specific command-line harnesses in a sandboxed container. Two-phase async with callback `onSovereignAgentResult(bytes32, bytes)`.

Harness

Status

Claude Code

Active

Hermes

Active

Crush

Active

ZeroClaw

Active

### Related

How They Stay Alive Building Agents Scheduler
