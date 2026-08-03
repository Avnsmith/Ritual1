---
id: passkeys
title: "Passkeys & Auth"
category: "Autonomous Agents"
---

# Passkeys & Auth

Users sign transactions with Face ID, fingerprint, or a security key. No seed phrase, no browser extension.

TxPasskey (`0x77`) is a native transaction type. The chain understands WebAuthn natively. The SECP256R1 precompile at `0x0100` lets your contract verify P-256 signatures over arbitrary data. Together they collapse the entire wallet UX problem: the user's phone _is_ the wallet.

Passkey Authentication Flow

/\* 12s cycle: fingerprint draws 0-25%, untraces 25-40% \*/ .pk-fp-line{stroke-dasharray:120;stroke-dashoffset:120;animation:pkFpDraw 12s ease-in-out infinite} @keyframes pkFpDraw{ 0%{stroke-dashoffset:120;stroke:#333} 15%{stroke-dashoffset:0;stroke:#58F399} 25%{stroke-dashoffset:0;stroke:#58F399} 40%{stroke-dashoffset:-120;stroke:#333} 95%{stroke-dashoffset:-120;stroke:#333} 100%{stroke-dashoffset:120;stroke:#333} } /\* Fingerprint glow ring \*/ .pk-fp-ring{animation:pkFpRing 12s ease-in-out infinite} @keyframes pkFpRing{0%{stroke:rgba(255,255,255,0.10)}15%{stroke:rgba(255,255,255,0.10)}20%{stroke:#58F399}30%{stroke:#58F399}35%{stroke:rgba(255,255,255,0.10)}100%{stroke:rgba(255,255,255,0.10)}} /\* Biometric dot: User(58,95) → Frontend(90,95). delta=(32,0) \*/ .pk-bio{animation:pkBio 12s ease-in-out infinite} @keyframes pkBio{0%{opacity:0;transform:translate(0,0)}3%{opacity:1}8%{opacity:1;transform:translate(32px,0)}10%{opacity:0}100%{opacity:0}} /\* Submit tx: Frontend(290,95) → Chain(370,95). delta=(80,0) \*/ .pk-tx{animation:pkTx 12s ease-in-out infinite} @keyframes pkTx{0%,25%{opacity:0;transform:translate(0,0)}28%{opacity:1}35%{opacity:1;transform:translate(80px,0)}37%{opacity:0}100%{opacity:0}} /\* P-256 label \*/ .pk-p256{animation:pkP256 12s step-end infinite} @keyframes pkP256{0%{opacity:0}25%{opacity:0.7}40%{opacity:0}100%{opacity:0}} /\* Contract highlight \*/ .pk-chl{animation:pkChl 12s ease-in-out infinite} @keyframes pkChl{0%{stroke:rgba(255,255,255,0.10)}40%{stroke:rgba(255,255,255,0.10)}44%{stroke:#58F399}100%{stroke:#58F399}} .pk-ctxt{animation:pkCtxt 12s step-end infinite} @keyframes pkCtxt{0%{opacity:0}44%{opacity:1}100%{opacity:1}} /\* Done text \*/ .pk-done{animation:pkDone 12s step-end infinite} @keyframes pkDone{0%{opacity:0}44%{opacity:1}100%{opacity:1}} /\* Authenticated label \*/ .pk-auth{animation:pkAuth 12s step-end infinite} @keyframes pkAuth{0%{opacity:0}20%{opacity:1}100%{opacity:1}} USER dApp Frontend authenticated ✓ P-256 sign TxPasskey · 0x77 RITUAL CHAIN YourContract.sol verifies via SECP256R1 (0x0100) P-256 signature verified ✓ No private key. No seed phrase. No MetaMask.

## Address Derivation

The address comes from `keccak256(publicKeyX || publicKeyY)[12:32]`, the last 20 bytes of the hash of the concatenated P-256 coordinates. Same passkey, same address, every time. Deterministic.

## Signature Types

Code

Type

Gas Overhead

`0x00`

Secp256k1 (standard ECDSA)

—

`0x01`

P-256 (raw passkey)

+3,450

`0x02`

WebAuthn (P-256 + challenge parsing)

+5,000

Solidity / P-256 Signature Verification

```
address constant SECP256R1 = address(0x0100);

// Input: (bytes pubkey, bytes message, bytes signature)
// pubkey: 65 bytes (0x04 || x || y), signature: 64 bytes (r || s)
(bool ok, bytes memory result) = SECP256R1.staticcall(
    abi.encode(pubkeyBytes, messageBytes, signatureBytes)
);
require(ok, "verification failed");
// Returns uint256: 1 = valid, 0 = invalid (NOT bool)
uint256 valid = abi.decode(result, (uint256));
require(valid == 1, "invalid signature");
```

**Return type:** The SECP256R1 precompile returns `uint256` (1 = valid, 0 = invalid), not `bool`. Decode as `uint256` and compare to 1. Gas cost: 3,450 (flat).

### Related

Frontend Hooks Consumer Patterns
