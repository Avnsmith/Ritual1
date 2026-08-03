'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../providers';
import { ExecutionTimeline } from '../../components/ExecutionTimeline';
import { ReportViewer } from '../../components/ReportViewer';
import { AgentTask, ExecutionStep } from '@wowweb/shared';
import { Search, Sparkles, ShieldCheck, Terminal, Compass, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { sessionToken, setIsModalOpen } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<AgentTask | null>(null);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);

  const suggestedPrompts = [
    'Research every new AI browser agent in 2026',
    'Compare RitualNet precompiles 0x0801 vs 0x0802',
    'Inspect Ritual foundation GitHub repositories',
    'Analyze zero-knowledge proof verification on RitualNet',
  ];

  const handleStartTask = (queryPrompt?: string) => {
    const targetPrompt = queryPrompt || prompt;
    if (!targetPrompt.trim()) return;

    if (!isConnected || !address) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    setSteps([]);
    setCurrentTask(null);

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    const sseUrl = `${backendUrl}/api/agent/stream?prompt=${encodeURIComponent(targetPrompt)}&owner=${address}`;

    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('step', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.step) {
        setSteps(prev => [...prev, data.step]);
      }
      if (data.task) {
        setCurrentTask(data.task);
      }
    });

    eventSource.addEventListener('complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.task) {
        setCurrentTask(data.task);
      }
      setLoading(false);
      eventSource.close();
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      console.error('SSE Error:', e);
      setLoading(false);
      eventSource.close();
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner / Welcome */}
      <div className="glass-panel rounded-2xl p-6 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Autonomous Browser Dashboard <span className="px-2 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono text-xs">RitualNet</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enter any web research task. WowWeb will fetch sources, synthesize findings, and record a proof on RitualNet.
          </p>
        </div>

        {address ? (
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-zinc-300 flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-ritual" />
            <span>Agent Owner: {address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-colors shrink-0"
          >
            Connect Wallet to Start
          </button>
        )}
      </div>

      {/* Main Command Bar Input */}
      <div className="glass-panel rounded-2xl p-4 border border-accent/30 shadow-2xl space-y-3 bg-surface/80">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-accent" />
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStartTask()}
            placeholder="Ask WowWeb to research anything... (e.g. Research top autonomous AI browser agents)"
            className="w-full pl-12 pr-32 py-4 rounded-xl bg-elevated border border-border text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-sans"
          />

          <button
            onClick={() => handleStartTask()}
            disabled={loading || !prompt.trim()}
            className="absolute right-3 px-5 py-2.5 rounded-lg bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Executing...' : 'Research'}</span>
          </button>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-500 mr-1">TRY SUGGESTED:</span>
          {suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(s);
                handleStartTask(s);
              }}
              className="px-2.5 py-1 rounded-lg bg-elevated hover:bg-surface border border-border text-[11px] text-zinc-300 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Timeline (Visible during execution or after) */}
      {steps.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-border">
          <ExecutionTimeline steps={steps} />
        </div>
      )}

      {/* Report Viewer */}
      {currentTask?.report && (
        <ReportViewer report={currentTask.report} proof={currentTask.proof} />
      )}
    </div>
  );
}
