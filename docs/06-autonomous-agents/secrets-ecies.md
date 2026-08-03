---
id: secrets
title: "Secrets & ECIES"
category: "Autonomous Agents"
---

# Secrets & ECIES

How to pass API keys and credentials to precompiles without putting them on-chain.

Your HTTP calls need API keys. Your LLM calls need provider tokens. You can't put these on-chain. They'd be visible to everyone. The Secrets system encrypts them with the TEE executor's public key. Only the enclave can decrypt.

Secrets Encryption Flow

/\* 12s cycle \*/ /\* Frontend(240,95) → ExClients(310,95). delta=(70,0) \*/ .sec-d2{animation:secD2 12s ease-in-out infinite} @keyframes secD2{0%,22%{opacity:0;transform:translate(0,0)}25%{opacity:1}33%{opacity:1;transform:translate(70px,0)}35%{opacity:0}100%{opacity:0}} /\* ExClients(530,95) → TEE(590,95). delta=(60,0) \*/ .sec-d3{animation:secD3 12s ease-in-out infinite} @keyframes secD3{0%,45%{opacity:0;transform:translate(0,0)}48%{opacity:1}55%{opacity:1;transform:translate(60px,0)}57%{opacity:0}100%{opacity:0}} /\* Plaintext visible, then garble frames replace it \*/ .sec-plain{animation:secPlain 12s step-end infinite} @keyframes secPlain{0%{opacity:1}10%{opacity:0}100%{opacity:0}} /\* Encryption garble frames: coral → cyan via █▓▒░ \*/ .sec-g1{animation:secG1 12s step-end infinite}@keyframes secG1{0%{opacity:0}10%{opacity:1}12%{opacity:0}100%{opacity:0}} .sec-g2{animation:secG2 12s step-end infinite}@keyframes secG2{0%{opacity:0}12%{opacity:1}14%{opacity:0}100%{opacity:0}} .sec-g3{animation:secG3 12s step-end infinite}@keyframes secG3{0%{opacity:0}14%{opacity:1}16%{opacity:0}100%{opacity:0}} .sec-g4{animation:secG4 12s step-end infinite}@keyframes secG4{0%{opacity:0}16%{opacity:1}18%{opacity:0}100%{opacity:0}} .sec-g5{animation:secG5 12s step-end infinite}@keyframes secG5{0%{opacity:0}18%{opacity:1}20%{opacity:0}100%{opacity:0}} .sec-enc{animation:secEnc 12s step-end infinite}@keyframes secEnc{0%{opacity:0}20%{opacity:1}100%{opacity:1}} /\* On-chain content appears \*/ .sec-chain{animation:secChain 12s step-end infinite}@keyframes secChain{0%{opacity:0}35%{opacity:1}100%{opacity:1}} /\* TEE garble → clear: cyan → green via █▓▒░ \*/ .sec-tg1{animation:secTg1 12s step-end infinite}@keyframes secTg1{0%{opacity:0}57%{opacity:1}59%{opacity:0}100%{opacity:0}} .sec-tg2{animation:secTg2 12s step-end infinite}@keyframes secTg2{0%{opacity:0}59%{opacity:1}61%{opacity:0}100%{opacity:0}} .sec-tg3{animation:secTg3 12s step-end infinite}@keyframes secTg3{0%{opacity:0}61%{opacity:1}63%{opacity:0}100%{opacity:0}} .sec-tg4{animation:secTg4 12s step-end infinite}@keyframes secTg4{0%{opacity:0}63%{opacity:1}65%{opacity:0}100%{opacity:0}} .sec-tg5{animation:secTg5 12s step-end infinite}@keyframes secTg5{0%{opacity:0}65%{opacity:1}67%{opacity:0}100%{opacity:0}} .sec-dec{animation:secDec 12s step-end infinite}@keyframes secDec{0%{opacity:0}67%{opacity:1}100%{opacity:1}} /\* TEE glow \*/ .sec-tee-glow{animation:secTeeGlow 12s ease-in-out infinite} @keyframes secTeeGlow{0%{stroke:rgba(255,255,255,0.10)}55%{stroke:rgba(255,255,255,0.10)}58%{stroke:#58F399}100%{stroke:#58F399}} /\* Lock pulse \*/ .sec-lock{animation:secLock 12s ease-in-out infinite} @keyframes secLock{0%{opacity:0.3}18%{opacity:0.3}20%{opacity:1}100%{opacity:1}} /\* Done \*/ .sec-done{animation:secDone 12s step-end infinite}@keyframes secDone{0%{opacity:0}67%{opacity:1}100%{opacity:1}} RITUAL CHAIN dApp Frontend plaintext API\_KEY=sk-a8f3b… encrypting... AP█\_K3Y=sk-▒8f3b… encrypting... ▓P░\_K█Y=░k-a█f▒b… encrypting... █▓░\_░█▒=▓░-█▒▓░█… encrypting... ░█▓▒█░▓█▒░▓█▒░▓█ encrypting... ▓░█▒▓█░▒█▓░▒█▓░█ ECIES encrypted 🔒 0x04a1b2c3d4e5f6… executor pubkey from TEEServiceRegistry VALIDATORS YourContract.sol ░█▓▒█░▓█▒░▓█▒░▓█ API\_KEY · encrypted chain never sees plaintext TRUSTED EXECUTION ENV Executor ░█▓▒█░▓█▒░▓█▒░▓█ decrypting... A░▓▒█░▓█▒░▓█▒░▓█ decrypting... AP█\_K░Y=░▓▒█░▓▒█ decrypting... API\_KE▓=sk-▒8f▒█ decrypting... API\_KEY=sk-a▒f3b… decrypting... API\_KEY=sk-a8f3b… decrypted ✓ Plaintext never touches the chain or the mempool

## Template Substitution

Reference your encrypted secret in request fields as `{{SECRET_NAME}}`. The TEE executor decrypts and substitutes before making the request. The plaintext never hits the chain or the mempool.

## ECIES Encryption: Full Example

TypeScript / Encrypting a Secret with eciesjs

```
import { encrypt } from "eciesjs";
import { readContract } from "viem";

// 1. Get executor's public key from TEEServiceRegistry
const executorPubKey = await readContract(client, {
  address: "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F",
  abi: teeRegistryAbi,
  functionName: "getExecutorPublicKey",
  args: [executorId],
});

// 2. Encrypt the secret (nonce MUST be 12 bytes)
const apiKey = "sk-proj-abc123...";
const encrypted = encrypt(
  executorPubKey,
  Buffer.from(apiKey, "utf-8")
);

// 3. Store encrypted secret and reference via {{API_KEY}} in request
const httpRequest = {
  url: "https://api.openai.com/v1/chat/completions",
  headerKeys: ["Authorization"],
  headerValues: ["Bearer {{API_KEY}}"],
};
```

Python / Encrypting with eciespy

```
from ecies import encrypt
import os

executor_pubkey = get_executor_pubkey(executor_id)
plaintext = b"sk-proj-abc123..."
ciphertext = encrypt(executor_pubkey, plaintext)
```

## PII Mode

`piiEnabled` is a boolean field on all async precompile requests: HTTP, LLM, Long HTTP, Agent, Multimodal. One flag, two effects.

`piiEnabled = true`: `{{SECRET_NAME}}` templates are resolved from `encryptedSecrets` before the request is sent. PII is redacted from results before on-chain settlement.

`piiEnabled = false`: no substitution, no redaction. `{{SECRET_NAME}}` literals are sent as-is to external APIs. Raw results go on-chain.

**Common bug:** if your request contains `{{SECRET_NAME}}` templates but `piiEnabled` is `false`, the literal string `{{SECRET_NAME}}` is sent to the API. Templates are not resolved. Rule: any `{{SECRET}}` template means `piiEnabled = true`.

### LLM PII Requirements

LLM PII mode requires all three: `piiEnabled = true`, non-empty `encryptedSecrets`, and a 65-byte `userPublicKey` with `0x04` uncompressed EC prefix. Missing any one silently disables PII. Also: PII mode and streaming are mutually exclusive on LLM. Pick one.

### Related

HTTP (with auth headers) Agent ECIES LLM (API keys) X402 Payments
