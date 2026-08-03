# Scheduler

> **Category**: Precompile Features  
> **Contract / Address**: `0x56e7…D58B`  
> **Description**: Block-based delayed and recurring on-chain execution

---

### What it teaches

How to use the Scheduler contract (`0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B`) to schedule delayed and recurring precompile calls on Ritual Chain. Execution is block-based, not time-based.

### Key patterns

*   `setTimeout` / `setInterval` for Solidity: delayed and recurring on-chain calls
*   FSM: SCHEDULED → EXECUTING → COMPLETED/FAILED
*   Uses `TxScheduled` (type 0x10) system tx from sender `0x0000...00fa7e`
*   Predicates for conditional execution (only run when a condition is true)
*   RitualWallet must be funded before each execution (just-in-time deposits supported)
