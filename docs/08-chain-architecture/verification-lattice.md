---
id: chain-lattice
title: "Verification Lattice"
category: "Chain Architecture"
---

# Verification Lattice

A product lattice over multiple proof systems tracking the verification state of every delegated output.

▾ Read more

Each delegated output `o` has a verification state vector $\\sigma(o) \\in \\{0,1\\}^m$ where $m$ is the number of independent verification systems. Dimension $i$ is 0 if system $V\_i$ has not yet attested, and 1 if it has. The product lattice orders these vectors componentwise: $\\sigma \\leq \\sigma'$ when every component of $\\sigma$ is at most the corresponding component of $\\sigma'$.

## Monotonicity

Lattice transitions are monotonic. Once dimension `i` flips from 0 to 1, it stays at 1. There is no un-verifying. A committee attestation is permanent. This guarantees that the verification state of any output only improves over time.

## Disputes And Quarantine

When members of a verification committee disagree on the validity of a proof, the output enters the **Disputed** state. Disputed outputs are quarantined: any replicated-mode read that depends on the disputed output returns the pre-delegation value. The dispute resolution mechanism (slashing, re-verification by a fresh committee, or escalation to a supermajority vote) determines whether the output is accepted or rejected.

## Upsets

Applications declare upsets: subsets of lattice positions that represent sufficient verification for their purposes. An application requiring both TEE attestation (system 1) and ZK proof (system 2) declares the upset `{σ : σ_1 = 1 ∧ σ_2 = 1}`. A delegated output becomes readable by that application only when its lattice position enters the declared upset. Different applications declare different upsets over the same output.

## Economic Safety

Fast verification systems (TEE attestation, committee-based checks) produce results in seconds. Slow systems (ZK proofs for large models) take minutes to hours. The gap between fast and slow verification is bridged by **economic safety**: executors post bonds that are slashed if the slow proof contradicts the fast attestation. During the gap, applications that trust only the fast system proceed, accepting the economic risk. Applications that require the slow system wait.

**No rollback.** Settled results are never rolled back. If a slow proof contradicts a fast attestation after settlement, the executor is slashed and the contradiction is recorded, but the settled state stands. Economic penalties replace state reversal. Applications that cannot tolerate this must declare upsets that include the slow system.

## Degradation Protocol

When a verification system becomes unresponsive or produces contradictory results, the degradation protocol activates:

Step

Action

**1\. Detect**

Governance or manual process identifies the compromised or unresponsive system (the paper does not specify automatic detection)

**2\. Mark**

System is flagged as degraded in the protocol state

**3\. Notify**

Applications with upsets depending on the degraded system receive notification

**4\. Quarantine**

New outputs pending verification by the degraded system are quarantined

**5\. Halt**

If recovery fails within the timeout, the system is removed from active verification

### Related

Verifiable Computation Block Validity Forced Inclusion & Exclusion
