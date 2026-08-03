# RitualWallet

> **Category**: Smart Contracts  
> **Description**: Fee deposits, locking, and withdrawal for async precompile calls

---

### What it teaches

The RitualWallet fee management contract.

### Key patterns

*   `deposit(lockDuration)` → funds locked until `block.number + lockDuration` → `withdraw(amount)` after lock expires
*   Lock duration is user-controlled (set at deposit time to cover your async TTL)
*   Lock is monotonic: new deposits only extend, never shorten the lock
*   `depositFor(user, lockDuration)` to fund another address
*   **Must fund and lock BEFORE submitting async calls.** Lock duration must cover the precompile TTL
