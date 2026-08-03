---
id: wallet
title: "RitualWallet"
category: "Smart Contracts"
---

# RitualWallet

Deposit RITUAL to pay for precompile calls. Balance is locked while async jobs are pending.

Precompile calls cost fees. Deposit RITUAL into RitualWallet at `0x532F…3948` and the chain deducts as you go. If you have a pending async job, your deposit is locked until it settles. Fund before you submit. The fee is locked at submission time.

## In Practice

Solidity / Depositing and Checking Balance

```
interface IRitualWallet {
    function deposit(uint256 lockDuration) external payable;
    function depositFor(address user, uint256 lockDuration) external payable;
    function withdraw(uint256 amount) external;
    function balanceOf(address) external view returns (uint256);
    function lockUntil(address) external view returns (uint256);
}

IRitualWallet wallet = IRitualWallet(0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948);

// Deposit 0.01 RITUAL with 100-block lock
wallet.deposit{value: 0.01 ether}(100);

// Fund another address (e.g. an agent)
wallet.depositFor{value: 0.05 ether}(agentAddress, 200);

// Withdraw after lock expires
wallet.withdraw(0.01 ether);
```

## Reference

Function

Description

`deposit(uint256 lockDuration)`

Deposit RITUAL with lock period (blocks)

`depositFor(address user, uint256 lockDuration)`

Deposit on behalf of another address

`withdraw(uint256 amount)`

Withdraw after lock expires

`balanceOf(address)`

Check available balance

`lockUntil(address)`

Check when the lock expires (0 = no lock)

### Related

System Contracts Consumer Patterns Deployment
