# Secrets

> **Category**: Precompile Features  
> **Description**: ECIES encryption, secret string replacement, delegated access control

---

### What it teaches

Secret management for Ritual precompiles.

### Key patterns

*   ECIES encryption to executor public key
*   `SECRET` string replacement in precompile inputs
*   Private outputs via `userPublicKey` field
*   [SecretsAccessControl](https://explorer.ritualfoundation.org/address/0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD) for delegated access
*   Contract-owned vs EOA-owned secrets with different `msg.sender` rules
