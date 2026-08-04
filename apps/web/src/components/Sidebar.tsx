'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ChevronLeft, ChevronRight, Menu, X, Plus, Clock, Folder, Shield, Settings, Wallet } from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'New Research', href: '/dashboard', icon: Plus, primary: true },
    { label: 'History', href: '/history', icon: Clock },
    { label: 'Collections', href: '/collections', icon: Folder },
    { label: 'Proof Explorer', href: '/proof', icon: Shield },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 font-sans select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-950/50 group-hover:scale-105 transition-transform">
              W
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  WowWeb
                  <span className="text-[9px] font-mono font-normal uppercase px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/60">v2</span>
                </h1>
                <p className="text-[10px] text-slate-400">Verifiable AI Workspace</p>
              </div>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden sm:block"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 mb-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-950/60 transition-all ${
                    isCollapsed ? 'px-2' : ''
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Wallet Status Footer */}
      <div className="pt-4 border-t border-slate-800/80">
        {isConnected && address ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-[9px] text-slate-400 uppercase font-mono">RitualNet</p>
                  <p className="text-[11px] font-mono text-slate-200 font-semibold truncate">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => disconnect()}
                className="text-xs text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Disconnect Wallet"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              const injected = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask');
              if (injected) connect({ connector: injected });
            }}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
            title="Connect Wallet"
          >
            <Wallet className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Connect Wallet</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sm:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="sm:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Mobile Drawer Container */}
      <div
        className={`sm:hidden fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden sm:flex flex-col bg-slate-950 border-r border-slate-800 text-slate-200 h-screen sticky top-0 z-30 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
