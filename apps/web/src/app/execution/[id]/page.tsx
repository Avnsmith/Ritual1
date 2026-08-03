'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AgentTask } from '@wowweb/shared';
import { ExecutionTimeline } from '../../../components/ExecutionTimeline';
import { ReportViewer } from '../../../components/ReportViewer';
import { ProofBadge } from '../../../components/ProofBadge';
import { ArrowLeft, Terminal, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ExecutionViewerPage() {
  const params = useParams();
  const id = params?.id as string;
  const [task, setTask] = useState<AgentTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    fetch(`${backendUrl}/api/agent/task/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.task) setTask(data.task);
      })
      .catch(err => console.error('Error fetching task details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs text-zinc-400 font-mono">Loading agent trajectory & RitualNet proof...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-border text-center space-y-4 my-8">
        <h2 className="text-lg font-bold text-white">Task Trajectory Not Found</h2>
        <p className="text-xs text-zinc-400">Could not retrieve execution metadata for ID: {id}</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-accent hover:underline font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <Link href="/history" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Task History
      </Link>

      <div className="glass-panel rounded-2xl p-6 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono">
            Execution ID: {task.id.slice(0, 14)}...
          </span>
          <span className="px-2 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono text-xs">
            Status: {task.status}
          </span>
        </div>

        <h1 className="text-xl font-bold text-white">{task.prompt}</h1>
        <p className="text-xs text-zinc-400">Agent ID: <span className="font-mono text-zinc-200">{task.agentId}</span> | Owner Wallet: <span className="font-mono text-zinc-200">{task.ownerWallet}</span></p>
      </div>

      {/* Proof Badge */}
      {task.proof && <ProofBadge proof={task.proof} />}

      {/* Timeline Steps */}
      <div className="glass-panel rounded-2xl p-6 border border-border">
        <ExecutionTimeline steps={task.steps} />
      </div>

      {/* Report Viewer */}
      {task.report && <ReportViewer report={task.report} proof={task.proof} />}
    </div>
  );
}
