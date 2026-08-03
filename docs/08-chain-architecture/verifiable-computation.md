---
id: chain-verifiable
title: "Verifiable Computation"
category: "Chain Architecture"
---

# Verifiable Computation

Delegated execution produces outputs and proofs. SNARK circuits, workload decomposition, and committee verification.

▾ Read more

Every delegated execution produces two artifacts: the output (the result of the computation) and one or more proofs (cryptographic evidence that the output is consistent with the registered workload and inputs). The verification systems consume these proofs and update the lattice position accordingly.

## SNARK Circuits

SNARK circuits operate over finite fields, eliminating hardware non-determinism entirely. A circuit that encodes an ML inference computes over field elements, not floating-point numbers. The proof attests that the circuit was evaluated correctly on the given inputs. Two different provers running the same circuit on the same inputs produce different proofs, but both verify against the same verification key.

The tradeoff: finite-field arithmetic is orders of magnitude slower than native GPU computation. Proof generation for a large model takes minutes to hours. Symphony accommodates this by treating proof latency as a first-class design parameter, not a deficiency to be hidden.

## Workload Decomposition

Large workloads decompose along three axes to reduce per-shard proof complexity:

Axis

Strategy

Example

**Compositional hierarchy**

Split computation into sequential stages

Tokenization, embedding, attention layers, output projection

**Parameter symmetry**

Exploit repeated structure in model weights

Identical attention heads proved once, reused across layers

**Repeated structure**

Batch identical sub-computations

Token-level operations across sequence length

## Shard Proofs

Each decomposed unit produces a shard proof. Adjacent shards satisfy boundary consistency: the output of shard `k` matches the input of shard `k+1`. Adjacent shards must satisfy boundary consistency: the output of shard k matches the input of shard k+1, with linking cost proportional to the boundary width between shards.

## Committee Verification

Committees are assigned to verification systems via deterministic selection based on stake weight and a per-epoch seed. Each committee member independently verifies the shard proofs assigned to them. Attestation requires a threshold of committee members to agree. Disagreement within a committee triggers the dispute path in the verification lattice.

**Fast provers, large proofs.** Symphony favors fast proof generation and large proof sizes, verified off-chain by committees. This inverts the rollup model (slow provers, small proofs verified on-chain in a gas-bounded environment). The tradeoff is viable because verification happens at the consensus layer, not inside an EVM execution context.

### Related

Execution Models Verification Lattice Block Validity
