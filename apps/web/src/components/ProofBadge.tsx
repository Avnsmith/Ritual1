'use client';

import React from 'react';
import { ProofMetadata } from '@wowweb/shared';
import { ShieldCheck, ExternalLink, Hash, Clock, Layers } from 'lucide-react';

export function ProofBadge({ proof }: { proof: ProofMetadata }) {
  const explorerUrl = proof.explorerUrl || `https://explorer.ritualfoundation.org/tx/${proof.transactionHash}`;

  return (
    <div className="glass-panel rounded-xl p-4 border border-ritual/40 space-y-3 bg-ritual/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-ritual animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              RitualNet On-Chain Proof <span className="px-2 py-0.5 rounded bg-ritual/20 text-ritual font-mono text-[10px]">Verified</span>
            </h4>
            <p className="text-[11px] text-zinc-400">Anchored to RitualNet (Chain ID: 1979)</p>
          </div>
        </div>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-surface border border-ritual/30 hover:border-ritual text-xs text-ritual hover:bg-ritual/10 transition-all flex items-center gap-1.5 font-mono"
        >
          <span>View on Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Cryptographic Hashes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-ritual/20">
        <div className="p-2 rounded bg-surface border border-border">
          <span className="text-zinc-500 block text-[10px]">PROMPT HASH</span>
          <span className="text-zinc-200 text-[11px] truncate block">{proof.promptHash}</span>
        </div>

        <div className="p-2 rounded bg-surface border border-border">
          <span className="text-zinc-500 block text-[10px]">OUTPUT HASH</span>
          <span className="text-zinc-200 text-[11px] truncate block">{proof.outputHash}</span>
        </div>

        <div className="p-2 rounded bg-surface border border-border">
          <span className="text-zinc-500 block text-[10px]">VISITED SOURCES HASH</span>
          <span className="text-zinc-200 text-[11px] truncate block">{proof.visitedUrlsHash}</span>
        </div>

        <div className="p-2 rounded bg-surface border border-border">
          <span className="text-zinc-500 block text-[10px]">TRANSACTION HASH & BLOCK</span>
          <span className="text-ritual text-[11px] truncate block flex items-center gap-1.5">
            {proof.transactionHash || 'Pending RPC Confirmation...'}
            {proof.blockNumber && (
              <span className="text-[10px] text-zinc-400 bg-elevated px-1.5 py-0.5 rounded border border-border">
                #{proof.blockNumber}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
