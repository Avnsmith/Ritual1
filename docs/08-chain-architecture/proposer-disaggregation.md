---
id: chain-proposer
title: "Proposer Disaggregation"
category: "Chain Architecture"
---

# Proposer Disaggregation

Breaking the block proposer's atomic bundle of powers into separable, protocol-enforced assignments.

▾ Read more

In every existing blockchain, the block proposer holds an atomic bundle of four powers: **inclusion** (which transactions enter the block), **exclusion** (which are kept out), **sequencing** (what order they execute in), and **timing** (when state-dependent actions trigger). No existing protocol disaggregates all four. Proposer-builder separation (PBS) splits building from proposing but leaves the bundle intact within the builder role. MEV-aware protocols constrain ordering but do not transfer it to applications.

Symphony breaks this bundle apart and reassigns each power to a different enforcement layer:

Power

Assigned To

Mechanism

**Inclusion**

Protocol

User Forced Inclusion (UFI)

**Exclusion**

Protocol

Application Or User Forced Exclusion (AOUFE)

**Sequencing**

Applications

Application-Controlled Execution (ACE)

**Timing**

State predicates

Conditional triggers with staleness 0

Each reassignment is enforced as a conjunct of the block validity function. A block that violates any assignment is invalid and rejected by validators. The proposer retains residual freedom only over transactions and orderings not claimed by any active predicate.

### Related

Non-Deterministic Execution Block Validity Superposition of Execution Models
