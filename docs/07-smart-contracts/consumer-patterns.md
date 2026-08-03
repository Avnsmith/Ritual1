---
id: contracts
title: "Consumer Patterns"
category: "Smart Contracts"
---

# Consumer Patterns

Three Solidity patterns, one per execution model. Pick the one that matches your precompile.

## Synchronous Consumer

Simplest case. Call the precompile, read the return value. Done.

Solidity / Sync Consumer

```
contract SyncConsumer {
    function verify(bytes calldata pubkey, bytes calldata message, bytes calldata sig) external view {
        (bool ok, bytes memory result) = address(0x0100).staticcall(
            abi.encode(pubkey, message, sig)
        );
        uint256 valid = abi.decode(result, (uint256));
        require(ok && valid == 1, "invalid signature");
    }
}
```

## Short-Running Async Consumer

The SPC result **is** available to your contract during execution. Use `_executePrecompile()` from `PrecompileConsumer`. It calls the precompile, unwraps the async envelope `(simmedInput, actualOutput)`, and returns the decoded output bytes directly. Your contract can decode the response and write state in the same transaction.

Solidity / Short-Running Async Consumer

```
import {PrecompileConsumer} from "./utils/PrecompileConsumer.sol";

contract HTTPConsumer is PrecompileConsumer {
    uint256 public latestPrice;

    function fetchPrice(bytes calldata httpInput) external {
        bytes memory output = _executePrecompile(HTTP_CALL_PRECOMPILE, httpInput);
        // output is the decoded HTTP response — available right here
        (uint16 status, , , bytes memory body, ) =
            abi.decode(output, (uint16, string[], string[], bytes, string));
        require(status == 200);
        // parse body, write state — all on-chain, same transaction
    }
}
```

## Two-Phase Consumer

The pattern is two transactions deep: the request goes out in one, the result arrives in a callback later. The critical part: verify `msg.sender == ASYNC_DELIVERY` in your callback. Skip this check and anyone can call your callback with garbage data.

Solidity / Two-Phase Consumer

```
import {PrecompileConsumer} from "./utils/PrecompileConsumer.sol";

contract AgentConsumer is PrecompileConsumer {
    function submitAgentTask(bytes calldata agentInput) external {
        _executePrecompile(PERSISTENT_AGENT_PRECOMPILE, agentInput);
    }

    function onPersistentAgentResult(bytes32 jobId, bytes calldata result) external {
        require(msg.sender == ASYNC_DELIVERY, "unauthorized");
        // Process the agent's response
    }
}
```

### Related

Execution Models RitualWallet Async Lifecycle
