---
id: fhe
title: "FHE Inference"
category: "Enshrined AI"
---

# FHE Inference

Your contract can run inference on encrypted data. Neither inputs nor outputs are ever visible to anyone except the key holder.

The FHE precompile at `0x0807` processes CKKS-encrypted tensors inside a TEE. Inputs and outputs both stay ciphertext throughout, and only the holder of the CKKS secret key can decrypt the result the callback returns. Use this when the data itself is sensitive (medical records, financial portfolios, private communications) but the computation still needs to happen on-chain.

The executor must have capability 10 (FHE). You pass an evaluation key reference so the executor can perform homomorphic operations on your ciphertext without seeing plaintext. CKKS does approximate arithmetic on encrypted floating-point tensors.

## In Practice

Solidity / FHE Consumer

```
contract PrivateInference is PrecompileConsumer {
    function submitEncrypted(bytes calldata fheInput) external {
        _executePrecompile(FHE_PRECOMPILE, fheInput);
    }

    function onFHEResult(
        bytes32 jobId, bytes calldata result
    ) external {
        require(msg.sender == ASYNC_DELIVERY);
        // result is CKKS-encrypted output, only key holder can decrypt
    }
}
```

## Encode The Request

  

Solidity TypeScript Python

```
// 19-field encoding done off-chain, passed as bytes calldata
function submitEncrypted(bytes calldata fheInput) external {
    _executePrecompile(FHE_PRECOMPILE, fheInput);
}
```

```
const encoded = encodeAbiParameters(
  parseAbiParameters("address, bytes[], uint256, bytes[], bytes, string, bytes, bytes, bytes, uint8, uint64, address, bytes4, uint256, uint256, uint256, uint256, bytes, bytes"),
  [executorAddress, [], 30n, [], "0x",
   model, encryptedInput, encryptedInputRef, evkRef,
   numLayers, maxInferenceBlock,
   callbackAddr, selector, gasLimit, maxFee, maxPriority, value,
   encryptedInputStorage, encryptedOutputStorage]
);
```

```
from ritual_common.fhe import FHERequest

request = FHERequest(
    executor=executor_address,
    model="model-name",
    encrypted_input=ciphertext,
    evk_reference=evk_bytes,
    num_layers=4,
    max_inference_block=current_block + 500,
)
encoded = request.to_web3()
```

## Reference

Index

Field

Type

Description

0-4

Base executor

various

Executor identity, payment, callback gas

5

`model`

`string`

Which model to run

6

`encryptedInput`

`bytes`

CKKS-encrypted input tensor

7

`encryptedInputRef`

`bytes`

Off-chain reference to input (or `0x`)

8

`evkReference`

`bytes`

Evaluation key for homomorphic ops

9

`numLayers`

`uint8`

Layer count in the model

10

`maxInferenceBlock`

`uint64`

Block deadline. Job dies after this.

11-16

Delivery fields

various

Callback target, gas limit, payment

17

`encryptedInputStorage`

`bytes`

Encrypted storage credentials for input

18

`encryptedOutputStorage`

`bytes`

Encrypted storage credentials for output

**`maxInferenceBlock` is a hard cutoff.** If the executor misses it, no callback fires. The job is dead. There is no retry. Set it with enough headroom for your model's layer count, and check current block times before picking a number.

### Related

ZK Proofs ONNX Models Secrets
