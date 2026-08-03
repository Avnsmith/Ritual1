'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ritualNet } from '@wowweb/shared';

export const config = createConfig({
  chains: [ritualNet],
  connectors: [injected()],
  transports: {
    [ritualNet.id]: http('https://rpc.ritualfoundation.org'),
  },
});

const queryClient = new QueryClient();

interface AuthContextType {
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType>({
  sessionToken: null,
  setSessionToken: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  disconnectWallet: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('wowweb_session');
    if (stored) setSessionToken(stored);
  }, []);

  const handleSetSessionToken = (token: string | null) => {
    setSessionToken(token);
    if (token) {
      localStorage.setItem('wowweb_session', token);
    } else {
      localStorage.removeItem('wowweb_session');
    }
  };

  const disconnectWallet = () => {
    handleSetSessionToken(null);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            sessionToken,
            setSessionToken: handleSetSessionToken,
            isModalOpen,
            setIsModalOpen,
            disconnectWallet,
          }}
        >
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
