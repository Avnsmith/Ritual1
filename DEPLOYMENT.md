# WowWeb Deployment Guide

**RitualNet Chain ID**: `1979`  
**RPC Endpoint**: `https://rpc.ritualfoundation.org`  
**Block Explorer**: `https://explorer.ritualfoundation.org`

---

## 1. Prerequisites

- Node.js `20.x` or later
- npm or pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, or WalletConnect) with RitualNet configured (`Chain ID: 1979`).

---

## 2. Environment Setup

Copy `.env.example` to `.env`:

```env
# RitualNet RPC Config
NEXT_PUBLIC_RITUAL_RPC_URL="https://rpc.ritualfoundation.org"
NEXT_PUBLIC_RITUAL_CHAIN_ID="1979"
NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS="0x8A79c67B92A2C683dFE59188FfA20C215682C5E0"

# Server Relayer Private Key (for testnet transactions)
# Load your private key from environment variable only. Never commit private keys.
RITUAL_PRIVATE_KEY="<YOUR_RITUAL_TESTNET_PRIVATE_KEY>"
PORT=3001
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"
```

---

## 3. Installation & Building

```bash
# 1. Install dependencies
npm install

# 2. Build all packages
npm run build:packages

# 3. Build server and web apps
npm --prefix apps/server run build
npm --prefix apps/web run build
```

---

## 4. Running Locally

```bash
# Start backend server (Port 3001)
npm run dev:server

# Start frontend application (Port 3000)
npm run dev:web
```

Access WowWeb in your browser at `http://localhost:3000`.
