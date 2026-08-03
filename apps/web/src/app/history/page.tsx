'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { AgentTask } from '@wowweb/shared';
import { History, ShieldCheck, Search, ExternalLink, ArrowRight, Clock, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Read from localStorage history first
    try {
      const localHistoryStr = localStorage.getItem('wowweb_history');
      if (localHistoryStr) {
        setTasks(JSON.parse(localHistoryStr));
      }
    } catch {
      // Ignore
    }

    // 2. Fetch from backend API if wallet connected
    if (address) {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
      fetch(`${backendUrl}/api/agent/history/${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.tasks) {
            setTasks(prev => {
              const combined = [...data.tasks, ...prev];
              const uniqueMap = new Map();
              combined.forEach(t => uniqueMap.set(t.id, t));
              return Array.from(uniqueMap.values());
            });
          }
        })
        .catch(err => console.error('Failed to fetch task history:', err))
        .finally(() => setLoading(false));
    }
  }, [address]);

  const filteredTasks = tasks.filter(t => t.prompt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 py-4">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-accent" /> Research Session History &amp; Proof Audit
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Searchable persistent log of all autonomous browser research sessions anchored to RitualNet (Chain ID: 1979).
          </p>
        </div>

        {/* Search Input Filter */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter research prompt..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent font-sans"
          />
        </div>
      </div>

      {/* Task List Table */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShieldCheck className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No research sessions found in local browser storage or wallet history.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
            >
              Start your first research session <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated border-b border-border font-mono text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-3">Prompt &amp; Session</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sources</th>
                  <th className="p-3">Ritual Proof</th>
                  <th className="p-3 text-right">Dedicated Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-zinc-300">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-elevated/50 transition-colors">
                    <td className="p-3 space-y-1 max-w-xs">
                      <div className="font-semibold text-white truncate">{task.prompt}</div>
                      <div className="text-[10px] font-mono text-zinc-500">ID: {task.id.slice(0, 12)}...</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-ritual/10 text-ritual font-mono text-[10px] border border-ritual/30 uppercase font-bold">
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{task.report?.sources.length || 0} sources</td>
                    <td className="p-3 font-mono text-[11px]">
                      {task.proof?.transactionHash ? (
                        <a
                          href={task.proof.explorerUrl || `https://explorer.ritualfoundation.org/tx/${task.proof.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ritual hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>{task.proof.transactionHash.slice(0, 10)}...</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-500">Unverified</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/research/${task.id}`}
                        className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" /> View /research/{task.id.slice(0, 6)}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
