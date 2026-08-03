---
id: for-agents
title: "Ritual for Agents"
category: "Using Ritual"
---

# Ritual for Agents

_AI coding agents that build dApps on Ritual without human code authorship._

## What This Is

[ritual-dapp-skills](https://skills.ritualfoundation.org) is a set of markdown instruction files that teach AI coding agents how to build applications on Ritual Chain. Every precompile, every contract pattern, every frontend hook, the full deployment pipeline. An agent reads the relevant skill files, asks 0-5 clarifying questions, and builds in phases: architecture, contracts, frontend, backend, testing, deployment.

Works with Claude Code (native plugin), Cursor (agent skills), Codex, OpenClaw, Hermes, and any LLM agent that reads markdown.

## Agents Building Agents

An autonomous agent on Ritual Chain invokes a coding assistant (Claude Code, OpenClaw, Codex) inside a TEE enclave. That coding assistant reads the ritual-dapp-skills, generates contracts, deploys them, funds the RitualWallet, and hands back the deployment address. The original agent now has a child application running on-chain that it built, deployed, and funded. No human wrote code. No human approved a PR.

This works because every step in the pipeline is an enshrined precompile or system contract call. Compilation runs inside the TEE. Deployment targets the RPC directly. Fee deposits go through RitualWallet. If the child app fails post-deployment verification, the debugger agent activates automatically: it triages the failure, pattern-matches against known root causes, applies a fix, and re-verifies. The chain itself is the CI/CD.

## The Skill System

The builder agent orchestrates the full lifecycle. It loads only the skills relevant to the project (3-6 per build), generates architecture, writes Solidity contracts, wires up React frontends with the right hooks, deploys via Foundry or Hardhat, and runs the 12-step verification journey. The debugger agent runs a 5-stage reactive pipeline: classify, smoke test, match known root causes, diagnose, fix and regression-check.

You give the agent an idea and a funded wallet address. Everything else is autonomous.

[Open ritual-dapp-skills →](https://skills.ritualfoundation.org)

### Related

Autonomous Agents FAQ
