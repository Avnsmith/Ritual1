# Inspiration

> **Category**: Meta Protocols  
> **Contract / Address**: `live search`  
> **Description**: JIT idea generation from trending blockchain + AI themes

---

### What it teaches

When the user doesn't know what to build, this skill searches the web for what's trending in blockchain and AI right now, filters for ideas that require Ritual-specific precompiles, and presents 3-5 concrete buildable app ideas.

### How it works

*   Three parallel web searches for current trends (varies by date)
*   Hard filter: each idea must map to a specific precompile address (0x08XX)
*   Deduplication against static examples already shown elsewhere
*   Each idea includes: one-line pitch, why now (from search), why Ritual (which precompile), complexity rating
*   Fallback to static examples if search fails

### Constraints

*   3-5 ideas, never more
*   At least one simple (1 precompile) and one ambitious (3+)
*   Every idea must be buildable in one session
*   No generic blockchain apps that work on any EVM chain
