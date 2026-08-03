---
id: dkms
title: "DKMS Keys"
category: "Autonomous Agents"
---

# DKMS Keys

Your contract or agent can derive and hold its own secp256k1 keys directly from the chain, without a human custodian or off-chain key vault in the loop.

The DKMS precompile at `0x081B` derives deterministic secp256k1 keypairs inside the executor's TEE. Same owner + same keyIndex = same keypair every time. The keys never leave the enclave. Even the contract's own code can't extract the raw key material. Agents use DKMS keys for DA encryption, wallet identity, and X402 shared credentials because the identity matters, not which executor runs the job.

Two encryption targets exist on Ritual Chain. The executor key (from TEEServiceRegistry) encrypts data to a specific node. The DKMS key encrypts data to an on-chain identity regardless of which node executes. Agent DA encryption, encrypted delivery, X402 shared credentials: these use DKMS keys because the identity matters, not the infrastructure.

Field

Type

Description

`baseExecutor[0-4]`

various

executor, encryptedSecrets, ttl, secretSignatures, userPublicKey

`owner`

`address`

Address that owns this keypair

`keyIndex`

`uint256`

Derive multiple keys per owner by incrementing

`keyFormat`

`uint8`

`1` = secp256k1

Solidity / DKMS Key Derivation

```
bytes memory input = abi.encode(
    baseExecutor,  // fields 0-4
    msg.sender,    // owner
    0,             // keyIndex: first key for this address
    1              // keyFormat: secp256k1
);
(bool success,) = address(0x081B).call(input);
// Use _executePrecompile() to get the result in the same tx:
// bytes memory output = _executePrecompile(address(0x081B), input);
// (address derivedAddr, bytes memory pubKey) = abi.decode(output, (address, bytes));
```

## Encode The Request

  

Solidity TypeScript Python

```
bytes memory input = abi.encode(
    executor,             // address
    new bytes[](0),      // encryptedSecrets
    uint256(30),          // ttl
    new bytes[](0),      // secretSignatures
    bytes(""),            // userPublicKey
    msg.sender,           // owner
    uint256(0),           // keyIndex
    uint8(1)              // keyFormat: secp256k1
);
```

```
const encoded = encodeAbiParameters(
  parseAbiParameters("address, bytes[], uint256, bytes[], bytes, address, uint256, uint8"),
  [executorAddress, [], 30n, [], "0x", ownerAddress, 0n, 1]
);
```

```
from ritual_common.dkms_key import DkmsKeyRequest

request = DkmsKeyRequest(
    executor=executor_address,
    owner=owner_address,
    key_index=0,
    key_format=1,  # secp256k1
)
encoded = request.to_web3()
```

**Requires `DKMS_ENABLED=true`** in executor config. The executor must advertise Capability `DKMS=6`. Without this, the precompile call reverts.

### Related

Secrets & ECIES Agent Orchestration
