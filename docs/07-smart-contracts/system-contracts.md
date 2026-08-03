---
id: system-contracts
title: "System Contracts"
category: "Smart Contracts"
---

# System Contracts

Eight contracts deployed to genesis that run the chain's plumbing.

Contract

Address

Role

RitualWallet

`0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948`

Fee escrow: deposit, lock, balance management

AsyncJobTracker

`0xC069FFCa0389f44eCA2C626e55491b0ab045AEF5`

Tracks pending async jobs, enforces sender lock

TEEServiceRegistry

`0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F`

Registers TEE executors and attestation proofs

Scheduler

`0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B`

Deferred execution at future blocks

SecretsAccessControl

`0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD`

Delegated secret access control

AsyncDelivery

`0x5A16214fF555848411544b005f7Ac063742f39F6`

Delivers two-phase async results via callback

AgentHeartbeat

`0xEF505E801f1Db392B5289690E2ffc20e840A3aCa`

Persistent agent liveness monitoring and revival

ModelPricingRegistry

`0x7A85F48b971ceBb75491b61abe279728F4c4384f`

Model pricing and availability configuration

## RitualWallet

Precompile calls cost fees. You prepay by depositing RITUAL into RitualWallet. Call `deposit(lockDuration)` to fund your own address, or `depositFor(user, lockDuration)` for someone else. Lock is monotonic: new deposits only extend, never shorten the lock.

Solidity / RitualWallet Interface

```
interface IRitualWallet {
    function deposit(uint256 lockDuration) external payable;
    function depositFor(address user, uint256 lockDuration) external payable;
    function withdraw(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function lockUntil(address account) external view returns (uint256);
}

// Deposit 0.01 RITUAL with lock duration of 100 blocks
IRitualWallet(0x532F...3948).deposit{value: 0.01 ether}(100);

// Withdraw after lock expires
IRitualWallet(0x532F...3948).withdraw(0.005 ether);
```

**EOA vs Contract deposits:** Two-phase async precompiles check the _EOA's_ RitualWallet balance, not the contract's. If your user interacts through a proxy contract, ensure the EOA has sufficient balance. Must fund and lock BEFORE submitting async calls.

## AsyncJobTracker

Tracks every pending async job and emits lifecycle events (`JobAdded`, `Phase1Settled`, `ResultDelivered`, `JobRemoved`). Also enforces the sender lock: one pending job per EOA, period.

## AsyncDelivery

Where two-phase results land. The executor sends the result here, and AsyncDelivery forwards it to your contract's callback. Check `msg.sender == 0x5A16…39F6` in your callback or anyone can inject fake results.

### Related

RitualWallet Deep Dive Async Lifecycle Consumer Patterns
