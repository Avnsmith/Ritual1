# Agents

> **Category**: Precompile Features  
> **Contract / Address**: `0x0820 / 0x080C`  
> **Description**: Multi-step AI agents: persistent memory or sovereign execution

---

### What it teaches

Two agent precompiles: Persistent Agent (0x0820) for stateful with memory, Sovereign Agent (0x080C) for autonomous execution.

Long-running async: callback delivery

### Key patterns

*   2-phase submit → callback with tools (web\_search, code\_execution)
*   Storage references for persistent state across sessions
*   Delivery config: target address + selector + gas limit
