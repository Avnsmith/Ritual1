'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const navItems = [
    { label: '+ New Research', href: '/dashboard', icon: '✨', primary: true },
    { label: 'Research History', href: '/history', icon: '📜' },
    { label: 'Collections', href: '/collections', icon: '📁' },
    { label: 'Proof Explorer', href: '/proof', icon: '🔮' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                WowWeb
                <span className="text-[10px] font-mono font-normal uppercase px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">v2</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Verifiable AI Browser Agent</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-900/30 transition-all active:scale-[0.98]"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-950/50 text-purple-300 border border-purple-800/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Wallet Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
        {isConnected && address ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">RitualNet</p>
                <p className="text-xs font-mono text-slate-200 font-semibold truncate">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            </div>
            <button
              onClick={() => disconnect()}
              className="text-xs text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Disconnect Wallet"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              const injected = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask');
              if (injected) connect({ connector: injected });
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
          >
            <span>👛</span>
            <span>Connect Wallet</span>
          </button>
        )}

        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500">Verified by RitualNet • Chain ID 1979</p>
        </div>
      </div>
    </aside>
  );
}
