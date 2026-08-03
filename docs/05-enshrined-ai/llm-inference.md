---
id: llm
title: "LLM Inference"
category: "Enshrined AI"
---

# LLM Inference

Your contract can call frontier LLMs and act on the result. Submit a prompt, handle the response in a callback when the executor returns.

The LLM precompile at `0x0802` runs an open-weight model (`zai-org/GLM-4.7-FP8`, 64K context) inside a TEE. No API keys needed. Your contract sends a prompt, receives a completion, and writes state in one transaction. For frontends that need progressive output, enable streaming: the executor pushes response tokens over SSE, each signed with EIP-712 so your UI can verify they came from the TEE.

LLM Streaming Architecture

/\* 28s cycle: action 0-48%, finalized hold 48-100% (block fully exits belt) \*/ /\* Submit tx \*/ .ll-sub{animation:llSub 28s ease-in-out infinite} @keyframes llSub{0%{opacity:0;transform:translate(0,0)}2%{opacity:1}5%{opacity:1;transform:translate(70px,0)}6%{opacity:0}100%{opacity:0}} /\* Async detect \*/ .ll-async{animation:llAsync 28s ease-in-out infinite} @keyframes llAsync{0%,6%{opacity:0;transform:translate(0,0)}7%{opacity:1}11%{opacity:1;transform:translate(50px,0)}12%{opacity:0}100%{opacity:0}} /\* SSE stream tokens: 12 dots, staggered every ~1.2% \*/ .ll-tok{offset-path:path('M652,54 C652,2 80,2 80,42');offset-rotate:0deg} .ll-tok1{animation:llTk1 28s ease-in-out infinite} @keyframes llTk1{0%,12%{opacity:0;offset-distance:0%}13%{opacity:1;offset-distance:0%}20%{opacity:1;offset-distance:100%}21%{opacity:0}100%{opacity:0}} .ll-tok2{animation:llTk2 28s ease-in-out infinite} @keyframes llTk2{0%,13.5%{opacity:0;offset-distance:0%}14.5%{opacity:1;offset-distance:0%}21.5%{opacity:1;offset-distance:100%}22.5%{opacity:0}100%{opacity:0}} .ll-tok3{animation:llTk3 28s ease-in-out infinite} @keyframes llTk3{0%,15%{opacity:0;offset-distance:0%}16%{opacity:1;offset-distance:0%}23%{opacity:1;offset-distance:100%}24%{opacity:0}100%{opacity:0}} .ll-tok4{animation:llTk4 28s ease-in-out infinite} @keyframes llTk4{0%,16.5%{opacity:0;offset-distance:0%}17.5%{opacity:1;offset-distance:0%}24.5%{opacity:1;offset-distance:100%}25.5%{opacity:0}100%{opacity:0}} .ll-tok5{animation:llTk5 28s ease-in-out infinite} @keyframes llTk5{0%,18%{opacity:0;offset-distance:0%}19%{opacity:1;offset-distance:0%}26%{opacity:1;offset-distance:100%}27%{opacity:0}100%{opacity:0}} .ll-tok6{animation:llTk6 28s ease-in-out infinite} @keyframes llTk6{0%,19.5%{opacity:0;offset-distance:0%}20.5%{opacity:1;offset-distance:0%}27.5%{opacity:1;offset-distance:100%}28.5%{opacity:0}100%{opacity:0}} .ll-tok7{animation:llTk7 28s ease-in-out infinite} @keyframes llTk7{0%,21%{opacity:0;offset-distance:0%}22%{opacity:1;offset-distance:0%}29%{opacity:1;offset-distance:100%}30%{opacity:0}100%{opacity:0}} .ll-tok8{animation:llTk8 28s ease-in-out infinite} @keyframes llTk8{0%,22.5%{opacity:0;offset-distance:0%}23.5%{opacity:1;offset-distance:0%}30.5%{opacity:1;offset-distance:100%}31.5%{opacity:0}100%{opacity:0}} .ll-tok9{animation:llTk9 28s ease-in-out infinite} @keyframes llTk9{0%,24%{opacity:0;offset-distance:0%}25%{opacity:1;offset-distance:0%}32%{opacity:1;offset-distance:100%}33%{opacity:0}100%{opacity:0}} .ll-tok10{animation:llTk10 28s ease-in-out infinite} @keyframes llTk10{0%,25.5%{opacity:0;offset-distance:0%}26.5%{opacity:1;offset-distance:0%}33.5%{opacity:1;offset-distance:100%}34.5%{opacity:0}100%{opacity:0}} .ll-tok11{animation:llTk11 28s ease-in-out infinite} @keyframes llTk11{0%,27%{opacity:0;offset-distance:0%}28%{opacity:1;offset-distance:0%}35%{opacity:1;offset-distance:100%}36%{opacity:0}100%{opacity:0}} .ll-tok12{animation:llTk12 28s ease-in-out infinite} @keyframes llTk12{0%,28.5%{opacity:0;offset-distance:0%}29.5%{opacity:1;offset-distance:0%}36.5%{opacity:1;offset-distance:100%}37.5%{opacity:0}100%{opacity:0}} /\* Frontend streaming text \*/ .ll-streaming{animation:llStreaming 28s step-end infinite} @keyframes llStreaming{0%{opacity:0}13%{opacity:1}38%{opacity:0}100%{opacity:0}} /\* EIP-712 \*/ .ll-eip{animation:llEip 28s ease-in-out infinite} @keyframes llEip{0%,30%{opacity:0}34%{opacity:1}100%{opacity:1}} /\* Signed result \*/ .ll-result{animation:llResult 28s ease-in-out infinite} @keyframes llResult{0%,32%{opacity:0;transform:translate(0,0)}34%{opacity:1}37%{opacity:1;transform:translate(-50px,0)}38%{opacity:0}100%{opacity:0}} /\* Contract highlight \*/ .ll-contract-hl{animation:llContractHl 28s ease-in-out infinite} @keyframes llContractHl{0%{stroke:rgba(255,255,255,0.10)}38%{stroke:rgba(255,255,255,0.10)}40%{stroke:#58F399}100%{stroke:#58F399}} .ll-contract-txt{animation:llContractTxt 28s step-end infinite} @keyframes llContractTxt{0%{opacity:0}40%{opacity:1}100%{opacity:1}} /\* Chain → Belt dot: Chain(370,155) → Belt(370,190). delta=(0,35) \*/ .ll-c2b{animation:llC2B 28s ease-in-out infinite} @keyframes llC2B{0%,38%{opacity:0;transform:translate(0,0)}40%{opacity:1}44%{opacity:1;transform:translate(0,35px)}45%{opacity:0}100%{opacity:0}} /\* Block highlight (starts as normal block, highlights when dot arrives) \*/ .ll-blk-border{animation:llBlkBorder 28s step-end infinite} @keyframes llBlkBorder{0%{stroke:rgba(255,255,255,0.10)}46%{stroke:#58F399}100%{stroke:#58F399}} .ll-blk-fill{animation:llBlkFill 28s step-end infinite} @keyframes llBlkFill{0%{fill:#111113}46%{fill:#111113}100%{fill:#111113}} .ll-blk-txt{animation:llBlkTxt 28s step-end infinite} @keyframes llBlkTxt{0%{fill:#333;opacity:0.5}46%{fill:#58F399;opacity:1}100%{fill:#58F399;opacity:1}} .ll-blk-bar{animation:llBlkBar 28s step-end infinite} @keyframes llBlkBar{0%{opacity:0}46%{opacity:1}100%{opacity:1}} /\* Belt scroll — must match main cycle duration so highlighted block only appears once \*/ .ll-belt-scroll{animation:llBeltScroll 28s linear infinite} @keyframes llBeltScroll{0%{transform:translateX(0)}100%{transform:translateX(-960px)}} /\* Executor glow \*/ .ll-exec-glow{animation:llExecGlow 28s ease-in-out infinite} @keyframes llExecGlow{0%,10%{filter:none}12%{filter:drop-shadow(0 0 6px #58F399)}32%{filter:drop-shadow(0 0 6px #58F399)}34%{filter:none}100%{filter:none}} /\* Frontend finalized \*/ .ll-frontend-done{animation:llFrontendDone 28s step-end infinite} @keyframes llFrontendDone{0%{opacity:0}40%{opacity:1}100%{opacity:1}} /\* Finalized banner \*/ .ll-finalized{animation:llFinalized 28s step-end infinite} @keyframes llFinalized{0%{opacity:0}46%{opacity:1}100%{opacity:1}} B L O C K S #40 #41 #42 #43 #44 #45 #46 #47 #48 #49 #50 #51 #52 #53 #54 #55 #56 #57 #58 #59 #60 #61 #62 #63 ← SSE stream · EIP-712 signed → tokens arrive before finalization dApp Frontend streaming tokens... ▎█ response finalized ✓ 0x…f7a1 submit tx RITUAL CHAIN VALIDATORS YourContract.sol calls 0x0802 · tx 0x…f7a1 spcCalls\[0\].output ✓ TRUSTED EXECUTION ENVIRONMENT LLM Executor GLM-4.7 · tx 0x…f7a1 tx 0x…f7a1 finalized in block #51 Tokens stream to frontend before the transaction finalizes on-chain

## Open-Weight Model

The LLM precompile runs **`zai-org/GLM-4.7-FP8`** (64K context, MIT license), an open-weight model hosted directly in the TEE fleet. No external API keys required. Unlike HTTP-based calls to OpenAI/Anthropic or Sovereign Agent CLI execution, the LLM precompile's model is self-hosted with TEE-only trust.

## In Practice

Solidity / LLM Consumer

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PrecompileConsumer} from "./utils/PrecompileConsumer.sol";

contract OnChainChat is PrecompileConsumer {
    event Response(string text);

    function ask(bytes calldata llmInput) external {
        bytes memory output = _executePrecompile(LLM_INFERENCE_PRECOMPILE, llmInput);

        // (bool hasError, bytes completionData, bytes modelMetadata,
        //  string errorMessage, (string,string,string) updatedConvoHistory)
        (
            bool hasError,
            bytes memory completionData,
            ,
            string memory errorMessage,
        ) = abi.decode(output, (bool, bytes, bytes, string, (string,string,string)));

        require(!hasError, errorMessage);
        // completionData contains the chat completion response
    }
}
```

## Encode The Request

The LLM precompile has a 25-field ABI mirroring the OpenAI chat completion API. Most fields can be left at their defaults. The key fields are `messagesJson` (field 5), `model` (field 6), `temperature` (field 22), and `convoHistory` (field 24, required).

  

Solidity TypeScript Python

```
// Encoding the full 25-field request on-chain is gas-heavy.
// Typical pattern: encode off-chain, pass as bytes calldata.
// See TypeScript or Python tabs for the encoding.

// On-chain, you just forward the pre-encoded bytes:
function ask(bytes calldata llmInput) external {
    _executePrecompile(LLM_INFERENCE_PRECOMPILE, llmInput);
}
```

```
import { encodeAbiParameters, parseAbiParameters } from "viem";

const messages = JSON.stringify([
  { role: "user", content: "What is the current price of ETH?" }
]);

const encoded = encodeAbiParameters(
  parseAbiParameters("address, bytes[], uint256, bytes[], bytes, string, string, int256, string, bool, int256, string, string, uint256, bool, int256, string, bytes, int256, string, string, bool, int256, bytes, bytes, int256, int256, string, bool, (string,string,string)"),
  [
    executorAddress,       // 0: executor
    [], 30n, [], "0x",     // 1-4: secrets, ttl, sigs, pubkey
    messages,              // 5: messagesJson
    "zai-org/GLM-4.7-FP8",// 6: model
    0n, "", false, -1n,   // 7-10: freq, logitBias, logprobs, maxTokens
    "", "", 1n, false,    // 11-14: metadata, modalities, n, parallelTools
    0n, "", "0x", -1n,   // 15-18: presence, reasoning, responseFormat, seed
    "", "",                // 19-20: serviceTier, stop
    false,                 // 21: stream
    700n,                  // 22: temperature (0.7 × 1000)
    "0x", "0x",            // 23-24: toolChoice, tools
    -1n, 1000n,            // 25-26: topLogprobs, topP
    "", false,              // 27-28: user, piiEnabled
    ["gcs", "convos/session.jsonl", "GCS_CREDS"], // 29: convoHistory
  ]
);
```

```
from ritual_common.llm_call.request import LLMCallRequest
from ritual_common.sovereign_agent.request import StorageRef

request = LLMCallRequest(
    executor=executor_address,
    encrypted_secrets=[],
    ttl=30,
    secret_signature=[],
    user_public_key=b"",
    messages=[{"role": "user", "content": "What is ETH price?"}],
    model="zai-org/GLM-4.7-FP8",
    temperature=0.7,
    convo_history=StorageRef("gcs", "convos/session.jsonl", "GCS_CREDS"),
)
encoded = request.to_web3()
```

## Streaming with EIP-712

Set `stream: true` in the LLM call. After the transaction is mined, sign a stream request with EIP-712 and connect to the SSE endpoint. Each chunk is verified by the TEE's attestation.

TypeScript / Streaming LLM via SSE

```
// 1. Sign a StreamRequest with EIP-712
const signature = await wallet.signTypedData({
  domain: { name: "Ritual Streaming Service", version: "1", chainId: 1979 },
  types: { StreamRequest: [
    { name: "txHash", type: "bytes32" },
    { name: "timestamp", type: "uint256" },
  ]},
  message: { txHash, timestamp: BigInt(Date.now()) },
});

// 2. Connect to SSE stream with auth headers
const response = await fetch(`/v1/stream/${txHash}`, {
  headers: { "Authorization": `Bearer ${signature}`, "X-Timestamp": timestamp },
});

// 3. Read chunks from ReadableStream
const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  if (chunk.includes("[DONE]")) break;
  // process chunk
}
```

## 25-Field ABI Reference

#

Field

Type

Notes

0

`executor`

`address`

TEE executor

1

`encryptedSecrets`

`bytes[]`

ECIES-encrypted secrets

2

`ttl`

`uint256`

Time-to-live in blocks

3

`secretSignatures`

`bytes[]`

Signatures over secrets

4

`userPublicKey`

`bytes`

For encrypted output

5

`messagesJson`

`string`

OpenAI-compatible messages array as JSON

6

`model`

`string`

e.g. `zai-org/GLM-4.7-FP8`

7

`frequencyPenalty`

`int256`

×1000 (e.g. 500 = 0.5)

8

`logitBiasJson`

`string`

JSON logit bias map

9

`logprobs`

`bool`

Return log probabilities

10

`maxCompletionTokens`

`int256`

\-1 = null (model default)

11

`metadataJson`

`string`

Optional metadata

12

`modalitiesJson`

`string`

Output modalities

13

`n`

`uint256`

Number of completions

14

`parallelToolCalls`

`bool`

Allow parallel tool calls

15

`presencePenalty`

`int256`

×1000

16

`reasoningEffort`

`string`

Reasoning effort level

17

`responseFormatData`

`bytes`

Structured output / JSON mode config

18

`seed`

`int256`

\-1 = null

19

`serviceTier`

`string`

Service tier

20

`stopJson`

`string`

Stop sequences as JSON

21

`stream`

`bool`

Enable SSE streaming

22

`temperature`

`int256`

×1000 (e.g. 700 = 0.7)

23

`toolChoiceData`

`bytes`

Tool choice config

24

`toolsData`

`bytes`

Tool definitions

25

`topLogprobs`

`int256`

\-1 = null

26

`topP`

`int256`

×1000

27

`user`

`string`

User identifier

28

`piiEnabled`

`bool`

PII redaction (incompatible with streaming)

29

`convoHistory`

`(string,string,string)`

StorageRef: (platform, path, keyRef). Required.

## Response Format

`(bool hasError, bytes completionData, bytes modelMetadata, string errorMessage, (string,string,string) updatedConvoHistory)`

**Constraints:** One SPC call per transaction. `convoHistory` is required for all LLM calls (e.g. `["gcs", "convos/session.jsonl", "GCS_CREDS"]`). PII redaction and streaming are mutually exclusive.

### Related

HTTP Precompile Agent Orchestration Secrets & ECIES
