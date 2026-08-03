---
id: http
title: "HTTP Precompile"
category: "Real World"
---

# HTTP Precompile

Your contract can call any URL directly from Solidity. REST APIs, webhooks, price feeds.

The HTTP precompile at `0x0801` makes the request inside a TEE, attests the response, and returns it to your contract in the same transaction. Your contract decodes the response and acts on it on-chain. Settle a market, update a price feed, trigger a swap. No oracles. No off-chain relayers. One precompile call.

## In Practice

Solidity / HTTP Consumer

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PrecompileConsumer} from "./utils/PrecompileConsumer.sol";

contract PriceFeed is PrecompileConsumer {
    uint256 public latestPrice;

    function fetchPrice(bytes calldata httpInput) external {
        bytes memory output = _executePrecompile(HTTP_CALL_PRECOMPILE, httpInput);

        // Decode: (uint16 status, string[] keys, string[] vals, bytes body, string err)
        (
            uint16 statusCode,
            ,
            ,
            bytes memory body,
            string memory errorMessage
        ) = abi.decode(output, (uint16, string[], string[], bytes, string));

        require(statusCode == 200, errorMessage);
        // Parse body with JQ precompile or off-chain
    }
}
```

## Encode The Request

  

Solidity TypeScript Python

```
bytes memory input = abi.encode(
    executor,                // address: from TEEServiceRegistry
    new bytes[](0),         // bytes[]: encryptedSecrets
    uint256(30),             // uint256: ttl (blocks)
    new bytes[](0),         // bytes[]: secretSignatures
    bytes(""),               // bytes: userPublicKey (empty = plaintext)
    "https://api.example.com/price", // string: url
    uint8(1),                // uint8: method (1=GET)
    headerKeys,              // string[]: header names
    headerValues,            // string[]: header values
    bytes(""),               // bytes: body
    uint256(0),              // uint256: dkmsKeyIndex
    uint8(0),                // uint8: dkmsKeyFormat
    false                    // bool: piiEnabled
);
```

```
import { encodeAbiParameters, parseAbiParameters } from "viem";

const encoded = encodeAbiParameters(
  parseAbiParameters("address, bytes[], uint256, bytes[], bytes, string, uint8, string[], string[], bytes, uint256, uint8, bool"),
  [
    executorAddress,        // executor
    [],                     // encryptedSecrets
    30n,                   // ttl
    [],                     // secretSignatures
    "0x",                   // userPublicKey
    "https://api.example.com/price",
    1,                       // GET
    [], [],                 // headers
    "0x",                   // body
    0n, 0,                 // dkms
    false,                  // piiEnabled
  ]
);
```

```
from ritual_common.http_call.request import HTTPCallRequest, HTTPMethod

request = HTTPCallRequest(
    executor=executor_address,
    encrypted_secrets=[],
    ttl=30,
    secret_signature=[],
    user_public_key=b"",
    url="https://api.example.com/price",
    method=HTTPMethod.GET,
    headers={},
    body=b"",
    dkms_key_index=None,
    dkms_key_format=None,
    pii_enabled=False,
)
encoded = request.to_web3()
```

## 13-Field ABI Reference

#

Field

Type

Description

0

`executor`

`address`

TEE executor address (from TEEServiceRegistry)

1

`encryptedSecrets`

`bytes[]`

ECIES-encrypted secret blobs for `SECRET_NAME` template injection

2

`ttl`

`uint256`

Time-to-live in blocks

3

`secretSignatures`

`bytes[]`

ECDSA signatures over each encrypted secret

4

`userPublicKey`

`bytes`

ECIES public key for encrypted output (empty = plaintext)

5

`url`

`string`

Target URL

6

`method`

`uint8`

1=GET, 2=POST, 3=PUT, 4=DELETE, 5=PATCH, 6=HEAD, 7=OPTIONS

7

`headersKeys`

`string[]`

Header names array

8

`headersValues`

`string[]`

Header values array (parallel to keys)

9

`body`

`bytes`

Request body (empty for GET)

10

`dkmsKeyIndex`

`uint256`

DKMS key index (0 = not using DKMS)

11

`dkmsKeyFormat`

`uint8`

DKMS key format

12

`piiEnabled`

`bool`

Enable secret template substitution + PII redaction

## Response Format

`(uint16 statusCode, string[] headerKeys, string[] headerValues, bytes body, string errorMessage)`

The response body is `bytes`, not `string`. Decode it with `TextDecoder` for text responses, or use directly for binary data. Always check `errorMessage`. It's non-empty when the precompile-level request failed (distinct from HTTP error status codes).

**Constraints:** One async precompile call per transaction (SPC or two-phase, any combination). Use the Scheduler to split multi-call workflows into separate transactions. RitualWallet must be funded before submitting.

## JQ Data Queries (0x0803)

`0x0803` runs jq expressions against JSON strings and returns typed results. Synchronous. Call it, get your answer in the same transaction. Most common use: chain an HTTP call with a JQ call in the same TX to extract a field from the response.

Field

Type

Description

`query`

`string`

jq expression (e.g. `.data.price`)

`inputData`

`string`

JSON string to query

`outputType`

`uint8`

0=int256, 1=uint256, 2=string, 3=bool, 4=address, 5=int256\[\], 6=uint256\[\], 7=string\[\], 8=bool\[\], 9=address\[\]

Solidity / JQ Query after HTTP

```
(bool ok, bytes memory result) = JQ_PRECOMPILE.staticcall(
    abi.encode(
        ".data.price",
        jsonString,
        uint8(1)  // uint256
    )
);
require(ok && result.length > 0, "jq: empty or failed");
uint256 price = abi.decode(result, (uint256));
```

**Two gotchas.** String output (type 2) needs `_decodeJQString()` for double-indirection decoding. Calling `abi.decode(result, (string))` directly returns garbage. Second: wrong `outputType` does not revert. The precompile returns `ok = true` with zero-length output. Always check `result.length > 0`.

### Related

Execution Models Long-Running Network Calls Secrets (for auth headers)
