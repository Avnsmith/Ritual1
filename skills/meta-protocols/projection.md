# Projection

> **Category**: Meta Protocols  
> **Contract / Address**: `pre-builder`  
> **Description**: Transforms raw ideas into Ritual-native specs with precompile mappings

---

### What it teaches

Before the builder agent starts writing code, this skill takes the user's raw idea and maps every capability to the optimal Ritual precompile or system contract. The builder receives a structured spec instead of a vague prompt.

### How it works

*   Reads the overview and precompiles skills to load the full capability surface
*   Decomposes the idea into capabilities (data ingestion, AI inference, scheduling, privacy, etc.)
*   Maps each capability to a specific precompile address using a comprehensive mapping table
*   Detects the 1-phase async constraint (only one short-running async call per TX) and resolves via Scheduler chaining
*   Detects additional constraints: sender lock, block time, encrypted input + auto-selection conflicts
*   Checks reference contracts in examples/registry.json for reusable patterns
*   Surfaces implicit requirements (RitualWallet deposit, callback handlers, storage config)
*   Outputs a structured spec with mapped capabilities, constraints, required skills, and off-chain components
