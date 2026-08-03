# Overview

> **Category**: Architecture & Reference  
> **Description**: Chain architecture, 3 execution models, 9-state async lifecycle, TEE trust model

---

### What it teaches

The complete Ritual Chain mental model. Three execution models (synchronous, short-running async, long-running async), the 9-state async transaction lifecycle, TEE trust model, executor selection, and all system contracts.

### Prior Correction

8 Ethereum assumptions that are **wrong** on Ritual:

*   `writeContractAsync` breaks on async precompiles. Use `useSendTransaction`
*   `msg.sender` in callbacks = AsyncDelivery proxy, not the user
*   Only one short-running async call per transaction
*   Fees are RitualWallet deposits, not gas
*   Block time is ~350ms, not 12s
*   Receipts have `spcCalls` field with precompile results
*   Sender lock: one async job per EOA at a time
*   No Chainlink/ERC-4337/Gelato. Ritual has native equivalents
