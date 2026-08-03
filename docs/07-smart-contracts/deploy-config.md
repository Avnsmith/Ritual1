---
id: deploy
title: "Deployment"
category: "Smart Contracts"
---

# Deployment

Copy-paste configs to get connected. Viem, wagmi, Foundry, Hardhat, and the testnet faucet.

## Viem Chain Definition

TypeScript / Chain Config

```
import { defineChain } from "viem";

export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual Chain",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ritualfoundation.org"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.ritualfoundation.org" },
  },
});
```

## Wagmi Config

TypeScript / Wagmi Setup

```
import { createConfig, http } from "wagmi";

export const config = createConfig({
  chains: [ritualChain],
  transports: {
    [ritualChain.id]: http(),
  },
});
```

## Foundry

```
# foundry.toml
[profile.default]
src = "src"
out = "out"
evm_version = "shanghai"

[rpc_endpoints]
ritual = "https://rpc.ritualfoundation.org"
```

## Hardhat

TypeScript / hardhat.config.ts

```
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    ritual: {
      url: "https://rpc.ritualfoundation.org",
      chainId: 1979,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};
export default config;
```

## Testnet Faucet

You need testnet RITUAL to call precompiles and deploy contracts.

**Faucet URL:** [https://faucet.ritualfoundation.org](https://faucet.ritualfoundation.org). Connect your wallet and request testnet RITUAL.

### Related

Testing Consumer Patterns RitualWallet
