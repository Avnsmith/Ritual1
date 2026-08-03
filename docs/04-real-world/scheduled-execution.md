---
id: scheduler
title: "Scheduler"
category: "Real World"
---

# Scheduler

Your contract can schedule its own execution at future blocks: recurring, delayed, or conditional on a predicate. The block proposer invokes it directly, with no off-chain keeper or cron service required.

The Scheduler is a system contract at `0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B`. Your contract calls `schedule()` and the chain fires the callback automatically at the blocks you specify. Combine with predicates for conditional execution: only fire when a condition is true. Fees are taken at execution time from RitualWallet.

Scheduler — Recurring Execution

/\* 24s cycle, belt synced \*/ /\* User(58,90) → Contract(125,90). delta=(67,0) \*/ .sc-usr{animation:scUsr 24s ease-in-out infinite} @keyframes scUsr{0%{opacity:0;transform:translate(0,0)}2%{opacity:1}6%{opacity:1;transform:translate(67px,0)}7%{opacity:0}100%{opacity:0}} /\* Contract(310,85) → Scheduler(380,85). delta=(70,0) \*/ .sc-sched{animation:scSched 24s ease-in-out infinite} @keyframes scSched{0%,8%{opacity:0;transform:translate(0,0)}10%{opacity:1}15%{opacity:1;transform:translate(70px,0)}16%{opacity:0}100%{opacity:0}} /\* Contract outline: coral on initial call, stays coral \*/ .sc-chl{animation:scChl 24s ease-in-out infinite} @keyframes scChl{0%{stroke:rgba(255,255,255,0.10)}7%{stroke:#825DDA}100%{stroke:#825DDA}} /\* New job: fade in at 16%, fade out at 80% \*/ .sc-job-new{animation:scJobNew 24s ease-in-out infinite} @keyframes scJobNew{0%{opacity:0}14%{opacity:0}16%{opacity:1}78%{opacity:1}82%{opacity:0}100%{opacity:0}} /\* Job counter text \*/ .sc-cnt4{animation:scCnt4 24s step-end infinite} @keyframes scCnt4{0%{opacity:0}16%{opacity:0.7}22%{opacity:0}100%{opacity:0}} .sc-cnt3{animation:scCnt3 24s step-end infinite} @keyframes scCnt3{0%{opacity:0}22%{opacity:0.7}36%{opacity:0}100%{opacity:0}} .sc-cnt2{animation:scCnt2 24s step-end infinite} @keyframes scCnt2{0%{opacity:0}36%{opacity:0.7}52%{opacity:0}100%{opacity:0}} .sc-cnt1{animation:scCnt1 24s step-end infinite} @keyframes scCnt1{0%{opacity:0}52%{opacity:0.7}68%{opacity:0}100%{opacity:0}} .sc-cnt0{animation:scCnt0 24s step-end infinite} @keyframes scCnt0{0%{opacity:0}68%{opacity:0.7}90%{opacity:0}100%{opacity:0}} /\* Scheduler → Belt dots. Scheduler(530,160) → Belt(530,195). delta=(0,35) \*/ .sc-fire1{animation:scFire1 24s ease-in-out infinite} @keyframes scFire1{0%,20%{opacity:0;transform:translate(0,0)}22%{opacity:1}26%{opacity:1;transform:translate(0,35px)}27%{opacity:0}100%{opacity:0}} .sc-fire2{animation:scFire2 24s ease-in-out infinite} @keyframes scFire2{0%,34%{opacity:0;transform:translate(0,0)}36%{opacity:1}40%{opacity:1;transform:translate(0,35px)}41%{opacity:0}100%{opacity:0}} .sc-fire3{animation:scFire3 24s ease-in-out infinite} @keyframes scFire3{0%,50%{opacity:0;transform:translate(0,0)}52%{opacity:1}56%{opacity:1;transform:translate(0,35px)}57%{opacity:0}100%{opacity:0}} .sc-fire4{animation:scFire4 24s ease-in-out infinite} @keyframes scFire4{0%,66%{opacity:0;transform:translate(0,0)}68%{opacity:1}72%{opacity:1;transform:translate(0,35px)}73%{opacity:0}100%{opacity:0}} /\* Callback dots: Scheduler(380,100) → Contract(310,100). delta=(-70,0) \*/ .sc-cb1{animation:scCb1 24s ease-in-out infinite} @keyframes scCb1{0%,24%{opacity:0;transform:translate(0,0)}26%{opacity:1}28%{opacity:1;transform:translate(-70px,0)}29%{opacity:0}100%{opacity:0}} .sc-cb2{animation:scCb2 24s ease-in-out infinite} @keyframes scCb2{0%,38%{opacity:0;transform:translate(0,0)}40%{opacity:1}42%{opacity:1;transform:translate(-70px,0)}43%{opacity:0}100%{opacity:0}} .sc-cb3{animation:scCb3 24s ease-in-out infinite} @keyframes scCb3{0%,54%{opacity:0;transform:translate(0,0)}56%{opacity:1}58%{opacity:1;transform:translate(-70px,0)}59%{opacity:0}100%{opacity:0}} .sc-cb4{animation:scCb4 24s ease-in-out infinite} @keyframes scCb4{0%,70%{opacity:0;transform:translate(0,0)}72%{opacity:1}74%{opacity:1;transform:translate(-70px,0)}75%{opacity:0}100%{opacity:0}} /\* Callback indicator: dimmed, 300ms fade-in/fade-out blip on each callback \*/ .sc-cb-txt{animation:scCbTxt 24s ease-in-out infinite} @keyframes scCbTxt{0%{opacity:0.12}28%{opacity:0.12}29.2%{opacity:1}30.5%{opacity:1}31.7%{opacity:0.12}42%{opacity:0.12}43.2%{opacity:1}44.5%{opacity:1}45.7%{opacity:0.12}58%{opacity:0.12}59.2%{opacity:1}60.5%{opacity:1}61.7%{opacity:0.12}74%{opacity:0.12}75.2%{opacity:1}76.5%{opacity:1}77.7%{opacity:0.12}100%{opacity:0.12}} /\* Job pulse on fire \*/ .sc-job-pulse{animation:scJobPulse 24s ease-in-out infinite} @keyframes scJobPulse{0%{filter:none}22%{filter:drop-shadow(0 0 4px #825DDA)}24%{filter:none}36%{filter:drop-shadow(0 0 4px #825DDA)}38%{filter:none}52%{filter:drop-shadow(0 0 4px #825DDA)}54%{filter:none}68%{filter:drop-shadow(0 0 4px #825DDA)}70%{filter:none}100%{filter:none}} /\* Belt blocks highlight (user tx and 4 scheduled) \*/ .sc-blk-usr{animation:scBlkUsr 24s step-end infinite} @keyframes scBlkUsr{0%{stroke:rgba(255,255,255,0.10);fill:#111113}14%{stroke:#825DDA;fill:#111113}100%{stroke:#825DDA;fill:#111113}} .sc-blk-usr-txt{animation:scBlkUsrTxt 24s step-end infinite} @keyframes scBlkUsrTxt{0%{fill:#333;opacity:0.5}14%{fill:#825DDA;opacity:1}100%{fill:#825DDA;opacity:1}} .sc-blk-usr-bar{animation:scBlkUsrBar 24s step-end infinite} @keyframes scBlkUsrBar{0%{opacity:0}14%{opacity:1}100%{opacity:1}} .sc-blk1{animation:scBlk1 24s step-end infinite} @keyframes scBlk1{0%{stroke:rgba(255,255,255,0.10);fill:#111113}27%{stroke:#58F399;fill:#111113}100%{stroke:#58F399;fill:#111113}} .sc-blk1-bar{animation:scBlk1Bar 24s step-end infinite} @keyframes scBlk1Bar{0%{opacity:0}27%{opacity:1}100%{opacity:1}} .sc-blk2{animation:scBlk2 24s step-end infinite} @keyframes scBlk2{0%{stroke:rgba(255,255,255,0.10);fill:#111113}41%{stroke:#58F399;fill:#111113}100%{stroke:#58F399;fill:#111113}} .sc-blk2-bar{animation:scBlk2Bar 24s step-end infinite} @keyframes scBlk2Bar{0%{opacity:0}41%{opacity:1}100%{opacity:1}} .sc-blk3{animation:scBlk3 24s step-end infinite} @keyframes scBlk3{0%{stroke:rgba(255,255,255,0.10);fill:#111113}57%{stroke:#58F399;fill:#111113}100%{stroke:#58F399;fill:#111113}} .sc-blk3-bar{animation:scBlk3Bar 24s step-end infinite} @keyframes scBlk3Bar{0%{opacity:0}57%{opacity:1}100%{opacity:1}} .sc-blk4{animation:scBlk4 24s step-end infinite} @keyframes scBlk4{0%{stroke:rgba(255,255,255,0.10);fill:#111113}73%{stroke:#58F399;fill:#111113}100%{stroke:#58F399;fill:#111113}} .sc-blk4-bar{animation:scBlk4Bar 24s step-end infinite} @keyframes scBlk4Bar{0%{opacity:0}73%{opacity:1}100%{opacity:1}} /\* Belt scroll synced to cycle \*/ .sc-belt-scroll{animation:scBeltScroll 24s linear infinite} @keyframes scBeltScroll{0%{transform:translateX(0)}100%{transform:translateX(-780px)}} B L O C K S #N-3 #N-2 #N-1 #N #N+1 #N+2 #N+3 #N+4 #N+5 #N+6 #N+7 #N+8 #N+9 #N+10 #N+11 #N+12 #N+13 #N+14 #N+15 #N+16 #N+17 #N+18 #N+19 USER RITUAL CHAIN ConsumerContract.sol calls schedule() freq: 4 · numCalls: 4 callback executed ✓ pays from RitualWallet schedule() callback Scheduler.sol TxScheduled · 0x10 · system sender 0xfa7e job-1 · priceCheck · freq:50 · block #120 job-2 · agentWakeUp · freq:10 · block #80 job-3 · consumer · freq:4 · block #N 4/4 3/4 2/4 1/4 done ✓ User Tx TxScheduled (0x10) No keepers. No cron jobs. The chain fires it.

## In Practice

Solidity / Scheduling a Recurring Price Check

```
import {IScheduler} from "./interfaces/IScheduler.sol";

IScheduler constant SCHEDULER =
  IScheduler(0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B);

function schedulePriceCheck() external {
    bytes memory callData = abi.encodeWithSelector(
        this.executePriceCheck.selector,
        uint256(0)  // placeholder: overwritten with executionIndex
    );
    // schedule(data, gas, startBlock, numCalls, frequency, ttl, maxFeePerGas, maxPriorityFeePerGas, value, payer)
    SCHEDULER.schedule(
        callData,
        500000,              // gas limit per execution
        uint32(block.number + 10), // startBlock
        24,                  // numCalls (24 executions)
        50,                  // frequency (every 50 blocks)
        30,                  // ttl (max blocks to wait for execution)
        block.basefee,       // maxFeePerGas
        0,                   // maxPriorityFeePerGas
        0,                   // value
        address(this)       // payer (RitualWallet balance)
    );
}

// Called by Scheduler — msg.sender is Scheduler, tx.origin is 0xfa7e
function executePriceCheck(uint256 executionIndex) external {
    // executionIndex: which execution this is (0, 1, 2, ...)
}
```

## Schedule() API

Parameter

Type

Description

`data`

`bytes`

Calldata for the callback (bytes 4-35 overwritten with executionIndex)

`gas`

`uint32`

Gas limit per execution

`startBlock`

`uint32`

First execution block

`numCalls`

`uint32`

Total number of executions

`frequency`

`uint32`

Blocks between executions

`ttl`

`uint32`

Max blocks to wait (max 500)

`maxFeePerGas`

`uint256`

EIP-1559 max fee

`maxPriorityFeePerGas`

`uint256`

EIP-1559 priority fee

`value`

`uint256`

RITUAL value to send

`payer`

`address`

Address paying from RitualWallet

Before scheduling, the contract must call `approveScheduler(schedulerAddress)` to authorize the Scheduler to call it back.

## Predicates

A predicate is a contract the scheduler calls before each execution. Implement `IScheduledPredicate`. The scheduler calls `shouldExecute` via `staticcall` and skips the execution if it returns `false`. Set `frequency=1` with a predicate to check every block.

Solidity / Scheduler Predicate

```
interface IScheduledPredicate {
    function shouldExecute(
        address caller,
        uint256 callId,
        uint256 executionIndex
    ) external view returns (bool);
}
```

100,000 gas limit per predicate call. `staticcall` only, no state writes. Reverts treated as `false`. `executionIndex` counts actual executions, not blocks evaluated.

## Async Scheduling: TTL Rules

Short path (SPC)

Long path (two-phase)

**Precompiles**

HTTP, LLM, DKMS

Agent, Long HTTP, Image, ZK

**TTL covers**

Full async lifecycle

Phase 1 only

**Phase 2**

N/A

`max_poll_block`, independent of TTL

**On expiry**

`CallSkippedTTLExpired`

Phase 1 skipped

Short path rule: `scheduler_ttl >= max_expected_drift + max_expected_settlement_blocks`. If drift is ~3 blocks and settlement takes ~5, set TTL to at least 8.

## Execution Index Encoding

The scheduler writes `executionIndex` into bytes 4-35 of your calldata before calling the target. Use `0` as a placeholder when encoding:

Solidity / Execution Index Placeholder

```
bytes memory callData = abi.encodeWithSelector(
    MyContract.myFunction.selector,
    uint256(0),  // placeholder: overwritten with executionIndex
    otherArg1,
    otherArg2
);
```

**Contracts only.** EOAs cannot call `schedule()`. Scheduled txs bypass the sender lock. Multiple scheduled async jobs run in parallel from the same contract.

### Related

System Contracts Consumer Patterns
