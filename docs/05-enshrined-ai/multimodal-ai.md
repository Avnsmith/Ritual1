---
id: multimodal
title: "Multimodal Processing"
category: "Enshrined AI"
---

# Multimodal Processing

Your contract can request images, audio, or video from generative models. The asset bytes come back via a two-phase async callback once the executor finishes.

Image (`0x0818`), Audio (`0x0819`), Video (`0x081A`). Generation runs inside a TEE. Your contract submits the request, and the result (a content URI with metadata) is delivered to your callback handler when generation completes.

## 18-Field ABI

All three share the same ABI layout (18 fields): base executor fields (0–4), polling + delivery config (5–13), model (14), inputs as `ModalInput[]` (15), output config (16), and encrypted storage payment (17). Two-phase async with result delivered via `LongRunningResultDelivered` callback.

### ModalInput Tuple

`(uint8 inputType, bytes data, string uri, bytes32 contentHash, uint32 param1, uint32 param2, bool encrypted)`

Input types: 0=TEXT, 1=IMAGE, 2=AUDIO, 3=VIDEO.

### OutputConfig Tuple

`(uint8 outputType, uint32 maxWidth, uint32 maxHeight, uint32 maxParam3, bool encryptOutput, uint16 numInferenceSteps, uint16 guidanceScaleX100, uint32 seed, uint8 fps, string negativePrompt)`

Solidity / Image Generation Consumer

```
function generateImage(bytes calldata imageInput) external {
    _executePrecompile(IMAGE_CALL_PRECOMPILE, imageInput);
}

// Phase 2 callback from AsyncDelivery
function onLongRunningResult(
    bytes32 jobId, bytes calldata result
) external {
    require(msg.sender == ASYNC_DELIVERY, "unauthorized");
    // result: (bool hasError, bytes completionData, string outputUri,
    //          bytes32 outputContentHash, bool outputEncrypted,
    //          uint32 outputSizeBytes, uint32 outputWidth, uint32 outputHeight,
    //          string errorMessage)
}
```

## Encode The Request

  

Solidity TypeScript Python

```
// 18-field encoding done off-chain, passed as bytes calldata
function generateImage(bytes calldata input) external {
    _executePrecompile(IMAGE_CALL_PRECOMPILE, input);
}
```

```
// 18 fields: base executor (5) + polling/delivery (9)
// + model + ModalInput[] + OutputConfig + encryptedStoragePayment
const encoded = encodeAbiParameters(imageParams, [
  executorAddress, [], 30n, [], "0x",
  pollInterval, maxPollBlock, taskIdMarker,
  callbackAddr, selector, gasLimit, maxFee, maxPriority, value,
  "dall-e-3",                        // model
  [[0, textBytes, "", "0x"..., 0, 0, false]], // ModalInput[]
  [1, 1024, 1024, 0, false, 50, 750, 0, 0, ""], // OutputConfig
  "0x",                               // encryptedStoragePayment
]);
```

```
from ritual_common.image_call.request import ImageCallRequest

request = ImageCallRequest(
    executor=executor_address,
    model="dall-e-3",
    inputs=[ModalInput(input_type=0, data=prompt_bytes)],
    output=OutputConfig(max_width=1024, max_height=1024),
)
encoded = request.to_web3()
```

## Audio & Video

Audio (`0x0819`) and Video (`0x081A`) use the same 18-field ABI and callback interface. The `OutputConfig` tuple's fields adapt to each modality (e.g. `fps` for video, sample rate for audio).

### Related

Agent Orchestration Long-Running Network Calls Precompile Map
