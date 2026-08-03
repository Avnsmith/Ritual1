'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { AgentStats } from '@wowweb/shared';
import { User, ShieldCheck, Cpu, CheckCircle2, Clock, ExternalLink, Activity } from 'lucide-react';
import { useAuth } from '../providers';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { setIsModalOpen } = useAuth();
  const [stats, setStats] = useState<AgentStats | null>(null);

  useEffect(() => {
    if (!address) return;
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    fetch(`${backendUrl}/api/agent/stats/${address}`)
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
      })
      .catch(err => console.error('Failed to fetch stats:', err));
  }, [address]);

  if (!isConnected || !address) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-border text-center space-y-4 my-12">
        <User className="w-10 h-10 text-zinc-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Wallet Connection Required</h2>
        <p className="text-xs text-zinc-400">Connect your wallet to access your agent profile & RitualNet execution statistics.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* User Header */}
      <div className="glass-panel rounded-2xl p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold font-mono text-lg">
            {address.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Agent Owner Profile <span className="px-2 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono text-xs">Registered</span>
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">{address}</p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-zinc-300 flex items-center gap-2 shrink-0">
          <Cpu className="w-4 h-4 text-ritual" />
          <span>RitualNet (Chain ID 1979)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-border space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400">Total Executions</span>
          <div className="text-2xl font-extrabold text-white font-mono">{stats?.totalExecutions || 0}</div>
          <span className="text-[10px] text-zinc-500 block">Agent tasks run</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-ritual/40 space-y-1 bg-ritual/5">
          <span className="text-xs font-mono uppercase text-ritual">Verified Proofs</span>
          <div className="text-2xl font-extrabold text-ritual font-mono">{stats?.verifiedExecutions || 0}</div>
          <span className="text-[10px] text-zinc-400 block">Anchored on RitualNet</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-border space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400">Success Rate</span>
          <div className="text-2xl font-extrabold text-white font-mono">{stats?.successRate || 100}%</div>
          <span className="text-[10px] text-zinc-500 block">Verified execution ratio</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-border space-y-1">
          <span className="text-xs font-mono uppercase text-zinc-400">Avg Runtime</span>
          <div className="text-2xl font-extrabold text-white font-mono">{stats?.avgRuntimeSeconds || 8}s</div>
          <span className="text-[10px] text-zinc-500 block">Per browser task</span>
        </div>
      </div>

      {/* Recent On-Chain Proofs */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" /> Recent RitualNet Execution Proofs
        </h3>

        {!stats?.recentProofs || stats.recentProofs.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4 text-center">No on-chain proof transactions recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentProofs.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-ritual shrink-0" />
                  <div>
                    <span className="text-zinc-200 block text-[11px] font-bold">Execution ID: {p.executionId.slice(0, 14)}...</span>
                    <span className="text-zinc-500 text-[10px]">TxHash: {p.transactionHash?.slice(0, 16) || 'Pending'}...</span>
                  </div>
                </div>

                <a
                  href={p.explorerUrl || `https://explorer.ritualfoundation.org/tx/${p.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-elevated hover:bg-surface border border-border text-ritual text-[11px] flex items-center gap-1"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
