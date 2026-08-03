---
id: testing
title: "Testing"
category: "Reference"
---

# Testing

How to test against precompiles that don't exist locally. Mock strategies for each layer.

## Foundry Unit Tests

Sync precompiles work with normal Foundry tests. Call and assert. Async is trickier. Use `vm.mockCall` to fake precompile responses and `vm.prank(ASYNC_DELIVERY)` to simulate the executor calling your callback.

Solidity / Mocking Async Delivery

```
function testCallback() public {
    bytes memory mockResult = abi.encode("agent response");

    // Simulate AsyncDelivery calling our contract
    vm.prank(0x5A16214fF555848411544b005f7Ac063742f39F6);
    consumer.onResult(mockResult);

    assertEq(consumer.lastResult(), "agent response");
}
```

## Frontend Testing

For the frontend: **Vitest** for hook unit tests with mocked chain clients, **Playwright** for E2E against a testnet fork. The async flow is hard to test locally because you need a real executor to exercise the full path.

### Related

Deployment Consumer Patterns
