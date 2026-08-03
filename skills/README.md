# Ritual dApp Agent Skills

Agent skills and behavioral protocols for building decentralized applications on Ritual Chain.

## How to Install Skills for your AI Assistant

- **Claude Code**: Clone into `.claude/skills/ritual-dapp-skills` in your project root.
```bash
git clone https://github.com/ritual-foundation/ritual-dapp-skills.git .claude/skills/ritual-dapp-skills
```
- **Cursor**: Clone into `.cursor/skills/ritual-dapp-skills`.
```bash
git clone https://github.com/ritual-foundation/ritual-dapp-skills.git .cursor/skills/ritual-dapp-skills
```
- **Codex CLI**: Clone into `.codex/skills/ritual-dapp-skills`.
```bash
git clone https://github.com/ritual-foundation/ritual-dapp-skills.git .codex/skills/ritual-dapp-skills
```
- **Hermes Agent**:
```bash
hermes skills tap add ritual-foundation/ritual-dapp-skills
```
- **OpenClaw**:
```bash
git clone https://github.com/ritual-foundation/ritual-dapp-skills.git ~/.openclaw/skills/ritual-dapp-skills
```

---

## Skills Catalog


### Meta Protocols

- [**Bootstrap**](skills/meta-protocols/bootstrap.md) (`10 rules`): Meta-kernel: behavioral middleware active for every session
- [**Verification Protocol**](skills/meta-protocols/verification-protocol.md) (`12 steps`): Automated per-skill checks, cross-skill integration, E2E user journey
- [**Lazy Elicitation**](skills/meta-protocols/lazy-elicitation.md) (`v3`): JIT question generation from a 12-dimension universe
- [**Circuit Breaker**](skills/meta-protocols/circuit-breaker.md) : Trajectory divergence detection, knows when to stop
- [**Projection**](skills/meta-protocols/projection.md) (`pre-builder`): Transforms raw ideas into Ritual-native specs with precompile mappings
- [**Inspiration**](skills/meta-protocols/inspiration.md) (`live search`): JIT idea generation from trending blockchain + AI themes

### Architecture & Reference

- [**Overview**](skills/architecture/overview.md) : Chain architecture, 3 execution models, 9-state async lifecycle, TEE trust model
- [**Precompiles ABI**](skills/architecture/precompiles-abi.md) (`16 addresses`): Complete ABI reference for all precompiles with encoding examples
- [**Deploy**](skills/architecture/deploy.md) : Chain config, Foundry/Hardhat setup, deployment scripts, system addresses
- [**Design System**](skills/architecture/design-system.md) : Dark-mode-first terminal aesthetic, typography, color semantics, accessibility

### Precompile Features

- [**HTTP**](skills/precompiles/http.md) (`0x0801`): External HTTP calls on-chain: APIs, price feeds, webhooks
- [**LLM**](skills/precompiles/llm.md) (`0x0802`): On-chain AI inference: chat, tool calling, structured output, streaming
- [**Agents**](skills/precompiles/agents.md) (`0x0820 / 0x080C`): Multi-step AI agents: persistent memory or sovereign execution
- [**Long-Running HTTP**](skills/precompiles/long-running-http.md) (`0x0805`): Minutes-to-hours async HTTP jobs with polling
- [**Multimodal**](skills/precompiles/multimodal.md) (`0x0818 / 0x0819 / 0x081A`): AI image, audio, and video generation on-chain
- [**Scheduler**](skills/precompiles/scheduler.md) (`0x56e7…D58B`): Block-based delayed and recurring on-chain execution
- [**Secrets**](skills/precompiles/secrets.md) : ECIES encryption, secret string replacement, delegated access control
- [**X402 Payments**](skills/precompiles/x402-payments.md) (`via 0x0801 / 0x0805`): Micropayments for paid API access
- [**Passkey / WebAuthn**](skills/precompiles/passkey-webauthn.md) : Sign transactions with Face ID, fingerprint, or hardware keys

### Smart Contracts

- [**Contracts**](skills/smart-contracts/contracts.md) : How to write Solidity contracts that call Ritual precompiles
- [**RitualWallet**](skills/smart-contracts/ritualwallet.md) : Fee deposits, locking, and withdrawal for async precompile calls
