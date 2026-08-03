'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ritualNet } from '@wowweb/shared';
import { AIProviderConfig } from '@wowweb/agents';
import { SettingsModal } from '../components/SettingsModal';

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
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  aiConfig: AIProviderConfig;
  setAiConfig: (cfg: AIProviderConfig) => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType>({
  sessionToken: null,
  setSessionToken: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  aiConfig: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.3 },
  setAiConfig: () => {},
  disconnectWallet: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [aiConfig, setAiConfigState] = useState<AIProviderConfig>({
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  });

  useEffect(() => {
    const storedSession = localStorage.getItem('wowweb_session');
    if (storedSession) setSessionToken(storedSession);

    const storedAiConfig = localStorage.getItem('wowweb_ai_config');
    if (storedAiConfig) {
      try {
        setAiConfigState(JSON.parse(storedAiConfig));
      } catch {
        // Fallback
      }
    }
  }, []);

  const handleSetSessionToken = (token: string | null) => {
    setSessionToken(token);
    if (token) {
      localStorage.setItem('wowweb_session', token);
    } else {
      localStorage.removeItem('wowweb_session');
    }
  };

  const handleSetAiConfig = (newConfig: AIProviderConfig) => {
    setAiConfigState(newConfig);
    localStorage.setItem('wowweb_ai_config', JSON.stringify(newConfig));
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
            isSettingsOpen,
            setIsSettingsOpen,
            aiConfig,
            setAiConfig: handleSetAiConfig,
            disconnectWallet,
          }}
        >
          {children}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            config={aiConfig}
            onSave={handleSetAiConfig}
          />
        </AuthContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
