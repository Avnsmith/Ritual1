---
id: sequencing-rights
title: "Sequencing Rights"
category: "Real World"
---

# Sequencing Rights

Your contract can enforce transaction ordering at the consensus layer. Block validity itself rejects orderings that violate your contract's sequencing policy, so MEV-extractive reorderings can't be included in a block.

Declare which functions must execute in which order, and the chain rejects any block that violates it. This is a protocol-level rule, not a precompile. Your contract implements `sequencingRights()` and the block builder is bound by it. A block that violates the declared ordering is invalid.

In the Symphony paper, this is a restricted form of **Application-Controlled Execution (ACE)**: a general framework where contracts define ordering policies over call sequences with tiebreakers and multi-contract coordination. The current `ISequencingRights` interface implements the single-contract, priority-list subset of ACE. The broader mechanism (cross-contract ordering, lazy evaluation batches, wrapping bypass rules) is described in the paper but will be released soon ™)

## Interface

Solidity / Sequencing Rights

```
interface ISequencingRights {
    function sequencingRights() external view returns (bytes4[][] memory);
}

function sequencingRights() external pure returns (bytes4[][] memory) {
    bytes4[][] memory levels = new bytes4[][](2);
    levels[0] = new bytes4[](1);
    levels[0][0] = this.deposit.selector;
    levels[1] = new bytes4[](1);
    levels[1][0] = this.withdraw.selector;
    return levels;
}
```

### Related

Ordering Constraints Consumer Patterns
