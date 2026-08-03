---
id: longrunning
title: "Long-Running Tasks"
category: "Real World"
---

# Long-Running Tasks

Your contract can issue HTTP calls that take minutes or hours. Use it for batch jobs, webhook waits, and other long-poll patterns that exceed the short-running 2s budget.

Use `0x0805` when the standard HTTP precompile (`0x0801`) is too fast to wait for. Your contract submits the request, the executor polls the external API at the interval you set, and delivers the final result to your callback handler when complete. Supports three JQ extraction paths for task ID, status checking, and result parsing.

## Submit–Poll–Deliver

The executor makes the initial request, extracts a task ID via `taskIdJsonPath`, then polls at `pollIntervalBlocks` until `statusJsonPath` evaluates truthy. Once complete, it extracts the final result via `resultJsonPath` and delivers via `AsyncDelivery` callback.

Solidity / Long-Running HTTP Consumer

```
function submitLongRunningJob(bytes calldata longHttpInput) external {
    _executePrecompile(LONG_HTTP_PRECOMPILE, longHttpInput);
}

// Phase 2 callback — selector: 0x6dc9dbef
function onLongRunningResult(
    bytes32 jobId, bytes calldata result
) external {
    require(msg.sender == ASYNC_DELIVERY, "unauthorized");
    // process result
}
```

## Encode The Request

  

Solidity TypeScript Python

```
// 35-field encoding done off-chain, passed as bytes calldata
function submitLongRunningJob(bytes calldata input) external {
    _executePrecompile(LONG_HTTP_PRECOMPILE, input);
}
```

```
const encoded = encodeAbiParameters(longHttpParams, [
  executorAddress, [], 30n, [], "0x",
  10n, 200n, "",            // polling config
  callbackAddr, selector, gasLimit, maxFee, maxPriority, value,
  url, 2, [], [], body,      // initial HTTP (POST)
  ".task_id",                // taskIdJsonPath
  pollUrl, 1, [], [], "0x", // poll HTTP (GET)
  ".status == \"complete\"", // statusJsonPath
  resultUrl, 1, [], [], "0x", // result HTTP (GET)
  ".result",                // resultJsonPath
  0n, 0, false,             // dkms, pii
]);
```

```
from ritual_common.long_running_http_call.request import LongRunningHTTPCallRequest

request = LongRunningHTTPCallRequest(
    executor=executor_address,
    poll_interval_blocks=10,
    max_poll_block=current_block + 200,
    url="https://api.example.com/submit",
    method=HTTPMethod.POST,
    task_id_json_path=".task_id",
    status_json_path=".status == \"complete\"",
    result_json_path=".result",
)
encoded = request.to_web3()
```

## 35-Field ABI Reference

#

Field

Type

Description

0–4

Base executor fields

5

`pollIntervalBlocks`

`uint64`

Blocks between polls

6

`maxPollBlock`

`uint64`

Deadline for polling

7

`taskIdMarker`

`string`

Marker for task ID extraction

8–13

Delivery config (target, selector, gasLimit, maxFeePerGas, maxPriorityFeePerGas, value)

14–18

Initial HTTP: url, method, headersKeys, headersValues, body

19

`taskIdJsonPath`

`string`

JQ path to extract task ID from initial response

20–24

Poll HTTP: pollUrl, pollMethod, pollHeadersKeys, pollHeadersValues, pollBody

25

`statusJsonPath`

`string`

JQ path for completion check (truthy when done)

26–30

Result HTTP: resultUrl, resultMethod, resultHeadersKeys, resultHeadersValues, resultBody

31

`resultJsonPath`

`string`

JQ path to extract final result

32

`dkmsKeyIndex`

`uint256`

DKMS key index

33

`dkmsKeyFormat`

`uint8`

DKMS key format

34

`piiEnabled`

`bool`

PII redaction

**One call per transaction.** Like all long-running precompiles, only one 0x0805 call per async transaction. Phase 1 returns a task ID; Phase 2 delivers via `onLongRunningResult(bytes32, bytes)` callback from AsyncDelivery.

### Related

HTTP Precompile Async Lifecycle
