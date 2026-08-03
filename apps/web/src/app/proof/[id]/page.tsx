'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProofMetadata } from '@wowweb/shared';
import { ProofBadge } from '../../../components/ProofBadge';
import { ShieldCheck, ArrowLeft, ExternalLink, Hash, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProofExplorerPage() {
  const params = useParams();
  const id = params?.id as string;
  const [proof, setProof] = useState<ProofMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    fetch(`${backendUrl}/api/agent/task/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.task?.proof) setProof(data.task.proof);
      })
      .catch(err => console.error('Error fetching proof details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-ritual animate-spin" />
        <p className="text-xs text-zinc-400 font-mono">Fetching proof metadata from RitualNet...</p>
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-border text-center space-y-4 my-8">
        <h2 className="text-lg font-bold text-white">Proof Commitment Not Found</h2>
        <p className="text-xs text-zinc-400">Could not locate on-chain proof for execution ID: {id}</p>
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

      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ritual/10 border border-ritual/30 flex items-center justify-center text-ritual">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">RitualNet On-Chain Proof Explorer</h1>
            <p className="text-xs text-zinc-400 font-mono">Execution ID: {proof.executionId}</p>
          </div>
        </div>

        <ProofBadge proof={proof} />
      </div>
    </div>
  );
}
