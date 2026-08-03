'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AgentTask, ExecutionStep } from '@wowweb/shared';
import { ExecutionTimeline } from '../../../components/ExecutionTimeline';
import { ReportViewer } from '../../../components/ReportViewer';
import { SourcePanel } from '../../../components/SourcePanel';
import { ShieldCheck, Compass, ArrowLeft, ExternalLink, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DedicatedResearchPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<AgentTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    // Check local history first
    const localHistoryStr = localStorage.getItem('wowweb_history');
    if (localHistoryStr) {
      try {
        const history: AgentTask[] = JSON.parse(localHistoryStr);
        const match = history.find(t => t.id === taskId);
        if (match) {
          setTask(match);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Fetch from backend API endpoint
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    fetch(`${backendUrl}/api/agent/task/${taskId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Task ${taskId} not found`);
        return res.json();
      })
      .then(data => {
        if (data.task) setTask(data.task);
        else setError(`Research session ${taskId} not found.`);
      })
      .catch(err => {
        setError(err.message || 'Failed to load research session.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Retrieving Research Session {taskId}...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">Research Session Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-md text-center">{error || 'The requested research session does not exist or has expired.'}</p>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-zinc-300 hover:text-white hover:border-accent transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Research Assistant
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-ritual/10 border border-ritual/30 text-ritual flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> RitualNet (Chain ID: 1979)
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface border border-border text-zinc-400">
            ID: {task.id.slice(0, 12)}...
          </span>
        </div>
      </div>

      {/* Session Title & Prompt Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-accent/40 bg-zinc-950/80 space-y-2">
        <div className="text-[11px] font-mono text-accent uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Dedicated Research Session
        </div>
        <h1 className="text-xl font-bold text-white">
          &ldquo;{task.prompt}&rdquo;
        </h1>
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-400">
          <span>Owner: <code className="text-zinc-200">{task.ownerWallet}</code></span>
          <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
          <span>Status: <code className="text-emerald-400 uppercase font-bold">{task.status}</code></span>
        </div>
      </div>

      {/* Execution Stage Timeline */}
      {task.steps && task.steps.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-border">
          <ExecutionTimeline steps={task.steps} />
        </div>
      )}

      {/* Main Grid: Executive Report & Visited Source Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {task.report ? (
            <ReportViewer report={task.report} proof={task.proof} />
          ) : (
            <div className="p-8 rounded-2xl bg-surface border border-border text-center text-xs text-zinc-400">
              No report generated for this task.
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {task.report?.sources && (
            <SourcePanel sources={task.report.sources} />
          )}
        </div>
      </div>
    </div>
  );
}
