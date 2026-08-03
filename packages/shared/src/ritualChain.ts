import { defineChain } from 'viem';

export const ritualNet = defineChain({
  id: 1979,
  name: 'RitualNet Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ritual',
    symbol: 'RITUAL',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ritualfoundation.org'],
      webSocket: ['wss://rpc.ritualfoundation.org/ws'],
    },
    public: {
      http: ['https://rpc.ritualfoundation.org'],
      webSocket: ['wss://rpc.ritualfoundation.org/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ritual Explorer',
      url: 'https://explorer.ritualfoundation.org',
    },
  },
  contracts: {
    ritualWallet: {
      address: '0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948',
    },
    secretsAccessControl: {
      address: '0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD',
    },
  },
});
