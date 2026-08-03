---
id: ed25519
title: "Ed25519 Signatures"
category: "Autonomous Agents"
---

# Ed25519 Signatures

Your contract can verify Ed25519 signatures natively at ~2000 gas per call. Useful for Solana transactions, SSH keys, DKIM headers, and Tor identity proofs.

**Argument order: `(publicKey, message, signature)`.** Most Ed25519 libraries use `(message, signature, publicKey)`. Wrong order returns `false` silently. It does not revert.

`0x0009` verifies Ed25519 signatures natively. Solana transaction signatures, SSH public key auth, DKIM email headers, Tor relay identity keys: all Ed25519. This precompile validates any of them in a single EVM call at roughly 2000 gas.

Synchronous execution. Result comes back in the same call, no SPC callback. No RitualWallet deposit needed. No sender lock. You can chain this with other precompiles in the same transaction.

Field

Type

Description

`publicKey`

`bytes`

Ed25519 public key, 32 bytes

`message`

`bytes`

Signed message, variable length

`signature`

`bytes`

`R || S` concatenated, 64 bytes

Solidity / Ed25519 Verify

```
(bool success, bytes memory result) = address(0x0009).staticcall(
    abi.encode(
        pubKey,  // bytes: 32-byte Ed25519 public key
        message, // bytes: the signed message
        sig      // bytes: 64-byte R || S
    )
);
// Returns uint256: 1 = valid, 0 = invalid (NOT bool)
uint256 valid = abi.decode(result, (uint256));
require(success && valid == 1, "invalid ed25519 signature");
```

## Encode The Request

  

Solidity TypeScript Python

```
bytes memory input = abi.encode(
    pubKey,   // bytes: 32-byte Ed25519 public key
    message,  // bytes: signed message
    sig       // bytes: 64-byte R || S
);
```

```
const encoded = encodeAbiParameters(
  parseAbiParameters("bytes, bytes, bytes"),
  [pubKeyHex, messageHex, signatureHex]
);
```

```
from ritual_common.sigver.request import SignatureVerificationRequest

request = SignatureVerificationRequest(
    public_key=pub_key_bytes,  # 32 bytes
    message=message_bytes,
    signature=sig_bytes,       # 64 bytes (R || S)
)
encoded = request.to_web3()
```

### Related

Passkeys (P-256) Precompile Map
