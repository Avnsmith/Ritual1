'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { AgentTask } from '@wowweb/shared';
import { History, ShieldCheck, Search, ExternalLink, ArrowRight, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    fetch(`${backendUrl}/api/agent/history/${address}`)
      .then(res => res.json())
      .then(data => {
        if (data.tasks) setTasks(data.tasks);
      })
      .catch(err => console.error('Failed to fetch task history:', err))
      .finally(() => setLoading(false));
  }, [address]);

  const filteredTasks = tasks.filter(t => t.prompt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-accent" /> Task History & Verification Audit
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Searchable log of all autonomous browser agent executions anchored to RitualNet (Chain ID: 1979).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by prompt..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Task List Table */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ShieldCheck className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No task executions found for your wallet.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
            >
              Start your first research task <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated border-b border-border font-mono text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-3">Prompt</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sources</th>
                  <th className="p-3">Ritual Proof</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-zinc-300">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-elevated/50 transition-colors">
                    <td className="p-3 font-semibold text-white max-w-xs truncate">{task.prompt}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-ritual/10 text-ritual font-mono text-[10px] border border-ritual/30">
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
                          className="text-ritual hover:underline flex items-center gap-1"
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
                        href={`/execution/${task.id}`}
                        className="px-2.5 py-1 rounded bg-surface border border-border hover:border-accent text-accent font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View Trajectory
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
