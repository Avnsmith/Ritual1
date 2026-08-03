'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { useAuth } from '../app/providers';
import { Wallet, ShieldCheck, Cpu, Terminal, Compass, History, User, Settings, ExternalLink } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { sessionToken, setIsModalOpen, setIsSettingsOpen, disconnectWallet } = useAuth();

  const isRitualNet = chain?.id === 1979;

  const handleDisconnect = () => {
    disconnect();
    disconnectWallet();
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border/80 px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              WowWeb <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono">RitualNet</span>
            </div>
            <div className="text-[11px] text-zinc-400">Don't browse. Just ask.</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/dashboard' ? 'bg-surface text-white border border-border' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Dashboard
          </Link>

          <Link
            href="/history"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/history' ? 'bg-surface text-white border border-border' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Task History
          </Link>

          <Link
            href="/profile"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/profile' ? 'bg-surface text-white border border-border' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile
          </Link>

          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              pathname === '/about' ? 'bg-surface text-white border border-border' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Architecture
          </Link>
        </nav>
      </div>

      {/* Controls & Settings */}
      <div className="flex items-center gap-3">
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent text-zinc-300 hover:text-accent transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="AI Provider Settings"
        >
          <Settings className="w-4 h-4 text-accent" />
          <span className="hidden sm:inline">Settings</span>
        </button>

        {/* Network Badge */}
        <a
          href="https://explorer.ritualfoundation.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-xs text-zinc-300 hover:border-ritual/50 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${isRitualNet ? 'bg-ritual animate-pulse' : 'bg-yellow-500'}`} />
          <span className="font-mono text-[11px]">RitualNet (1979)</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>

        {/* Connect / User Button */}
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-surface border border-border flex items-center gap-2 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-ritual" />
              <span className="font-mono text-zinc-200">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-2.5 py-1.5 rounded-lg bg-elevated border border-border hover:border-red-500/50 text-xs text-zinc-400 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
          >
            <Wallet className="w-3.5 h-3.5" /> Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
