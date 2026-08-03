---
id: chain-forced-inclusion
title: "Forced Inclusion"
category: "Chain Architecture"
---

# Forced Inclusion

UFI and AOUFE: protocol-enforced transaction inclusion and exclusion based on state predicates.

▾ Read more

## User Forced Inclusion (UFI)

A UFI trigger registers a predicate `P(S)` and a transaction `T`. When `P(S)` evaluates to true against the current state and the trigger has not expired, `T` must appear in the block. A block that omits `T` while `P(S)` holds is invalid. The inclusion is same-block and non-interactive: no dispute game, no delay, no challenge period. Either the transaction is present or the block is rejected.

Lattice promotions are a primary trigger for UFI. When a delegated output's verification state crosses an application's upset threshold, the corresponding settlement transaction fires via UFI. This guarantees that verified results reach the chain without proposer discretion.

## Application Or User Forced Exclusion (AOUFE)

AOUFE provides scoped exclusion. A contract registers a AOUFE rule that specifies a matching pattern: any transaction targeting the registering contract that matches the pattern is invalid. The scope is limited to the registering contract's own address. A contract cannot use AOUFE to exclude transactions targeting other contracts.

The primary use case is degradation. When a verification system enters a degraded state, the affected contract activates AOUFE to reject new requests until the system recovers. This prevents users from submitting work that cannot be verified.

## Conflict Resolution

UFI and AOUFE conflict when a UFI trigger forces transaction `T` into the block but a AOUFE rule on `T`'s target contract excludes it. The default resolution: **UFI overrides AOUFE**. Forced inclusion takes precedence over forced exclusion. This prevents a contract from griefing the inclusion mechanism by activating AOUFE on all incoming transactions. This is the default. Applications can declare the inverse (AOUFE-overrides-UFI) at registration time for safety-critical cases.

**Anti-griefing default.** UFI overrides AOUFE by default. Without this rule, a malicious contract could register AOUFE rules that block all forced inclusions targeting it. Applications can configure the inverse at registration time (Section 7.3.2 of the paper).

## Triggering Mechanisms

Two primary events fire these mechanisms. Lattice promotions trigger UFI: when an output's verification state reaches a threshold, settlement is forced. Verification system degradation triggers AOUFE: when a system fails health checks, contracts that depend on it activate exclusion to prevent unverifiable submissions.

### Related

Block Validity Ordering Constraints Verification Lattice
