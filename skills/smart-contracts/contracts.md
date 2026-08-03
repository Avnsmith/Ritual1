# Contracts

> **Category**: Smart Contracts  
> **Description**: How to write Solidity contracts that call Ritual precompiles

---

### What it teaches

How to write consumer contracts that correctly encode inputs, decode outputs, and handle results from every type of Ritual precompile.

### Key patterns

*   ABI encoding/decoding for precompile inputs and outputs
*   Short-running result decoding from `spcCalls` in the transaction receipt
*   Long-running callback handlers: implement `onResult(bytes32 jobId, bytes result)` for async delivery
*   Scheduled execution: recurring and delayed contract calls via the Scheduler
*   Fee deposits via `RitualWallet.deposit(lockDuration)` before submitting async calls
*   Job lifecycle events: track async and scheduled job state (committed, settled, delivered, expired)
