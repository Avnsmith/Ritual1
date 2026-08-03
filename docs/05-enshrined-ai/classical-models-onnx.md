---
id: onnx
title: "Classical Models"
category: "Enshrined AI"
---

# Classical Models

Your contract can run ML models synchronously. The precompile takes a RitualTensor and a Hugging Face model ID; the result comes back in the same call frame.

The ONNX precompile at `0x0800` runs inference inline in the node's native runtime, with the same execution surface as a built-in like `ecrecover`. Models load from Hugging Face using the format `hf/owner/repo/file.onnx@commit`.

## In Practice

ONNX is synchronous: encode the 7-field input and call `0x0800` directly. The model ID must use `hf/owner/repo/file.onnx@<40-char-commit-hash>`, and branch names are rejected so the model lineage stays reproducible.

Solidity / ONNX Consumer

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Classifier {
    address constant ONNX = address(0x0800);

    function classify(bytes calldata tensorBytes) external view returns (bytes memory) {
        (bool ok, bytes memory result) = ONNX.staticcall(
            abi.encode(
                bytes("hf/owner/repo/model.onnx@abc123..."),
                tensorBytes,
                uint8(2),  // inputArithmetic: 2=IEEE754
                uint8(0),  // inputFixedPointScale
                uint8(2),  // outputArithmetic
                uint8(0),  // outputFixedPointScale
                uint8(1)   // rounding: 1=half-even
            )
        );
        require(ok, "ONNX inference failed");
        return result;
        // result: (bytes tensor, uint8 arithmetic, uint8 scale, uint8 rounding)
    }
}
```

## Encode The Request

  

Solidity TypeScript Python

```
bytes memory input = abi.encode(
    bytes("hf/owner/repo/model.onnx@abc123..."), // bytes: model ID (UTF-8)
    tensorBytes,         // bytes: RitualTensor (uint8 dtype, uint16[] shape, int32[] values)
    uint8(2),            // uint8: inputArithmetic (1=fixed-point, 2=IEEE754)
    uint8(0),            // uint8: inputFixedPointScale
    uint8(2),            // uint8: outputArithmetic
    uint8(0),            // uint8: outputFixedPointScale
    uint8(1)             // uint8: rounding (1=half-even, 2=truncate, 3=floor, 4=ceil)
);
```

```
import { encodeAbiParameters, parseAbiParameters, toHex } from "viem";

const encoded = encodeAbiParameters(
  parseAbiParameters("bytes, bytes, uint8, uint8, uint8, uint8, uint8"),
  [
    toHex("hf/owner/repo/model.onnx@abc123..."), // model ID as bytes
    tensorHex,   // pre-encoded RitualTensor
    2,           // inputArithmetic: IEEE754
    0, 2, 0,    // fixedPointScale, outputArith, outputScale
    1,           // rounding: half-even
  ]
);
```

```
from ritual_common.onnx.request import ONNXInferenceRequest
from ritual_common.shared_types import RitualTensor, ArithmeticType, Rounding
from ritual_common.models.types.ml_model_id import MlModelId

request = ONNXInferenceRequest(
    ml_model=MlModelId.from_unique_id("hf/owner/repo/model.onnx@abc123..."),
    tensor=RitualTensor.from_numpy(input_array),
    input_arithmetic=ArithmeticType.IEEE754,
    input_fixed_point_scale=0,
    output_arithmetic=ArithmeticType.IEEE754,
    output_fixed_point_scale=0,
    rounding=Rounding.HALF_EVEN,
)
encoded = request.to_web3()
```

## 7-Field ABI Reference

#

Field

Type

Description

0

`mlModelId`

`bytes`

UTF-8 encoded model ID (`hf/owner/repo/file.onnx@commit`)

1

`tensorData`

`bytes`

RitualTensor: `(uint8 dtype, uint16[] shape, int32[] values)`

2

`inputArithmetic`

`uint8`

1=fixed-point, 2=IEEE 754

3

`inputFixedPointScale`

`uint8`

Scale for fixed-point input

4

`outputArithmetic`

`uint8`

1=fixed-point, 2=IEEE 754

5

`outputFixedPointScale`

`uint8`

Scale for fixed-point output

6

`rounding`

`uint8`

1=half-even, 2=truncate, 3=floor, 4=ceil

## Response Format

`(bytes tensorEncoded, uint8 outputArithmetic, uint8 outputScale, uint8 rounding)`

### Related

Precompile Map Execution Models
