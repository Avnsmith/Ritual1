'use client';

import React, { useState } from 'react';
import { ProofMetadata } from '@wowweb/shared';
import { ShieldCheck, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export function ProofBadge({ proof }: { proof?: ProofMetadata }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!proof) return null;

  const txHash = proof.transactionHash || proof.executionHash || '';
  const shortTx = txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : 'Verified';
  const explorerUrl = proof.explorerUrl || (proof.transactionHash ? `https://explorer.ritualfoundation.org/tx/${proof.transactionHash}` : '#');

  return (
    <div className="my-3 font-mono select-none">
      {/* Compact GitHub-style Badge */}
      <div className="inline-flex items-center rounded-lg bg-purple-950/60 border border-purple-800/60 text-xs shadow-sm hover:border-purple-600 transition-all overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-900/80 text-emerald-400 font-semibold border-r border-purple-800/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified ✓</span>
        </div>

        <div className="px-2.5 py-1 text-slate-300 font-medium border-r border-purple-800/60">
          RitualNet
        </div>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 text-purple-300 hover:text-white hover:bg-purple-900/40 flex items-center gap-1 transition-colors"
        >
          <span>{shortTx}</span>
          <ExternalLink className="w-3 h-3 text-purple-400" />
        </a>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-purple-900/40 transition-colors border-l border-purple-800/60"
          title="Toggle Proof Details"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Cryptographic Details Drawer */}
      {isExpanded && (
        <div className="mt-2 p-3.5 rounded-xl bg-slate-950 border border-purple-800/40 text-[11px] space-y-2 font-mono text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-purple-400 uppercase tracking-wider">RitualNet On-Chain Proof Record</span>
            <span className="text-[10px] text-slate-500">Chain ID: 1979</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">PROMPT HASH</span>
              <span className="text-slate-200 text-[11px] truncate block">{proof.promptHash}</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">OUTPUT HASH</span>
              <span className="text-slate-200 text-[11px] truncate block">{proof.outputHash}</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">VISITED SOURCES HASH</span>
              <span className="text-slate-200 text-[11px] truncate block">{proof.visitedUrlsHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
