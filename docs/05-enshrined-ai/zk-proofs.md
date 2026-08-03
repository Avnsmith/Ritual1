---
id: zk
title: "ZK Proofs"
category: "Enshrined AI"
---

# ZK Proofs

Your contract can request zero-knowledge proofs from the ZK precompile; the proof bytes arrive in a two-phase async callback.

Call `0x0806` to submit a proof generation job. An off-chain prover inside a TEE generates the proof, and the result is delivered to your contract through a Phase 2 callback. Your contract can then verify the proof and act on it. Prove creditworthiness without revealing financials, verify identity without exposing documents.

**Layout note:** This precompile takes `ExecutorRequest` directly, not `LongRunningRequest`. The field offsets are different from FHE or agent precompiles. Don't swap addresses on a copied struct. It will revert.

Index

Field

Type

Description

0-4

Base executor

various

Executor identity, payment, callback gas

5

`inputEncrypted`

`bool`

True if input is encrypted before submission

6

`maxProofBlock`

`uint64`

Block deadline. Proof must land before this.

7-12

Delivery fields

various

Callback target, gas limit, payment

13

`operationInput`

`bytes`

Raw input to the proof circuit

## Callback

Solidity / ZK Result Callback

```
function onZKResultDelivered(
    bytes32 jobId,
    bytes calldata result
) external {
    require(msg.sender == ASYNC_DELIVERY); // 0x5A16...F6, NOT the ZK precompile
    // decode result, store or act on proof
}
```

## Encode The Request

  

Solidity TypeScript Python

```
// 14-field ExecutorRequest encoding, passed as bytes calldata
function submitProof(bytes calldata zkInput) external {
    _executePrecompile(ZK_TWO_PHASE_PRECOMPILE, zkInput);
}
```

```
const encoded = encodeAbiParameters(
  parseAbiParameters("address, bytes[], uint256, bytes[], bytes, bool, uint64, address, bytes4, uint256, uint256, uint256, uint256, bytes"),
  [executorAddress, [], 30n, [], "0x",
   inputEncrypted, maxProofBlock,
   callbackAddr, selector, gasLimit, maxFee, maxPriority, value,
   operationInput]
);
```

```
from ritual_common.zk import ZKTwoPhaseRequest

request = ZKTwoPhaseRequest(
    executor=executor_address,
    input_encrypted=True,
    max_proof_block=current_block + 100,
    operation_input=encrypted_data,
)
encoded = request.to_web3()
```

**`ExecutorRequest`, not `LongRunningRequest`.** This is the most common mistake when porting code from other precompiles. The call reverts with no useful error if the ABI layout is wrong. Verify your struct matches the 14-field layout above before debugging anything else.

### Related

FHE Inference Precompile Map
