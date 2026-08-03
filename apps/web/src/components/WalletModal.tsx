'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useSignMessage, useSwitchChain } from 'wagmi';
import { useAuth } from '../app/providers';
import { Wallet, ShieldAlert, CheckCircle2, ArrowRight, X, Cpu } from 'lucide-react';
import { ritualNet } from '@wowweb/shared';

export function WalletModal() {
  const { isModalOpen, setIsModalOpen, setSessionToken } = useAuth();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const isRitualNet = chain?.id === 1979;

  const handleConnect = async (connector: any) => {
    try {
      setError(null);
      connect({ connector });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleSwitchNetwork = () => {
    try {
      switchChain({ chainId: 1979 });
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    }
  };

  const handleSignSession = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const message = `Sign to verify wallet ownership for WowWeb AI Agent on RitualNet (Chain ID: 1979).\n\nWallet: ${address}\nNonce: ${Math.random().toString(36).substring(2, 10)}\nTimestamp: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });

      // Create session
      const mockToken = `wowweb_session_${Date.now()}_${address.slice(0, 8)}`;
      setSessionToken(mockToken);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Signature rejected by wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 border border-border shadow-2xl space-y-5">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
            <p className="text-xs text-zinc-400">Authenticating for WowWeb on RitualNet</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Connect Wallet */}
        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">Select your Web3 wallet provider:</p>
            {connectors.map(c => (
              <button
                key={c.id}
                onClick={() => handleConnect(c)}
                className="w-full p-3 rounded-xl bg-surface border border-border hover:border-accent/50 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-zinc-200">{c.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        ) : !isRitualNet ? (
          /* Step 2: Switch Network */
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
              <strong>Network Switch Required:</strong> Please switch your wallet network to RitualNet (Chain ID: 1979).
            </div>
            <button
              onClick={handleSwitchNetwork}
              className="w-full py-3 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent/90 transition-colors"
            >
              Switch to RitualNet (Chain ID 1979)
            </button>
          </div>
        ) : (
          /* Step 3: Sign Session Challenge */
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-ritual/10 border border-ritual/30 text-ritual text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Wallet connected to RitualNet (Chain ID: 1979).</span>
            </div>
            <p className="text-xs text-zinc-400">
              Sign a cryptographic message challenge to register your wallet as the Agent Owner and initiate your session.
            </p>
            <button
              onClick={handleSignSession}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Waiting for signature...' : 'Sign Message & Enter Dashboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
