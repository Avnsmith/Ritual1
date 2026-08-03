---
id: x402
title: "X402 Payments"
category: "Autonomous Agents"
---

# X402 Payments

Your contract can call paid APIs without surfacing keys on-chain. Credentials are ECIES-encrypted to the executor and billed per request through the X402 protocol.

X402 works through the HTTP precompiles (`0x0801` and `0x0805`) with encrypted payment credentials injected by the TEE. There is no separate X402 precompile address. You encrypt API credentials with ECIES to the executor's public key, sign each encrypted blob with EIP-191, and pass them alongside your HTTP request. The executor decrypts inside TEE, substitutes credentials into `{{SECRET_NAME}}` placeholders, then makes the external call. Your secrets never touch the chain.

Budget tracking lives in your consumer contract. Each X402 call deducts from your allocated budget. To share credentials with other addresses without exposing them, use `SecretsAccessControl` and call `grantAccess(address, secretName)`.

## In Practice

Solidity / X402 Paid API Call

```
contract PaidAPIConsumer is PrecompileConsumer {
    function callPaidAPI(bytes calldata httpInput) external {
        // httpInput includes encryptedSecrets with API key
        // and piiEnabled=true for {{SECRET_NAME}} substitution
        bytes memory output = _executePrecompile(HTTP_CALL_PRECOMPILE, httpInput);
        (uint16 status, , , bytes memory body, ) =
            abi.decode(output, (uint16, string[], string[], bytes, string));
        require(status == 200);
    }
}
```

## Encode The Request

X402 uses the same 13-field HTTP ABI. The difference: `encryptedSecrets` contains your API credentials, `piiEnabled` is `true`, and the URL/headers use `{{SECRET_NAME}}` placeholders.

  

Solidity TypeScript Python

```
// Same as HTTP encoding, but with encrypted credentials
// encryptedSecrets = [ecies.encrypt(executorPubKey, apiKeyBlob)]
// piiEnabled = true
// URL uses {{API_KEY}} placeholder
```

```
import { encrypt } from "eciesjs";

const apiSecret = JSON.stringify({ API_KEY: "sk-..." });
const encrypted = encrypt(executorPubKey, Buffer.from(apiSecret));

// Encode as standard HTTP request with piiEnabled=true
const encoded = encodeAbiParameters(httpParams, [
  executorAddress,
  [encrypted],          // encryptedSecrets
  30n, [signature], "0x",
  "https://api.openai.com/v1/chat/completions",
  2,                    // POST
  ["Authorization"], ["Bearer {{API_KEY}}"],
  body, 0n, 0,
  true,                 // piiEnabled: activate substitution
]);
```

```
from ritual_common.http_call.request import HTTPCallRequest, HTTPMethod
from ritual_common.executor.base import ExecutorRequest

secrets = {"API_KEY": "sk-..."}
encrypted = ExecutorRequest.encrypt_secrets(secrets, executor_pub_key)

request = HTTPCallRequest(
    executor=executor_address,
    encrypted_secrets=[encrypted],
    url="https://api.openai.com/v1/chat/completions",
    method=HTTPMethod.POST,
    headers={"Authorization": "Bearer {{API_KEY}}"},
    pii_enabled=True,
)
encoded = request.to_web3()
```

## Reference

Field

Type

Description

`encryptedSecrets`

`bytes[]`

ECIES-encrypted credential blobs

`secretSignatures`

`bytes[]`

EIP-191 signature over each encrypted blob

`piiEnabled`

`bool`

Set `true` to activate credential substitution

**Depends on secrets, http, and wallet.** The consumer contract must hold sufficient budget before calling. If `piiEnabled` is `false`, the executor makes the HTTP call without substitution and ignores encrypted secrets entirely.

### Related

HTTP Precompile Secrets & ECIES
