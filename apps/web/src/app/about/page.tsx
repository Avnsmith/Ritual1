'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ShieldCheck, Globe, Cpu, ExternalLink, ArrowRight, Github } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-purple-900 selection:text-white">
      <Sidebar />

      <main className="flex-1 max-w-[950px] mx-auto p-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4 border-b border-slate-800 pb-8 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Verifiable AI Research Workspace
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Research anything. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              Verify everything.
            </span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            WowWeb combines autonomous web retrieval, multi-LLM analytical reasoning, and cryptographic execution proofs anchored on RitualNet.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-950/50 flex items-center gap-2"
            >
              <span>Start Research</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://github.com/Avnsmith/Ritual1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          </div>
        </div>

        {/* 3 Core Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">How WowWeb Works</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              WowWeb deconstructs user prompts into sub-queries, searches multi-engine indexes, crawls live web pages & GitHub repos, and synthesizes answers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">How Ritual Verifies Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every execution generates cryptographic keccak256 hash commitments of the prompt, visited sources, and report outputs, which are anchored on-chain.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Why Verification Matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verification eliminates hallucinations and unverified AI claims. Anyone can audit on-chain proof commitments to confirm source authenticity.
            </p>
          </div>
        </div>

        {/* Verified Network Infrastructure Information */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h2 className="text-sm font-mono uppercase font-bold text-purple-400 border-b border-slate-800 pb-2">
            Verified Network &amp; Contract Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">NETWORK</span>
              <span className="text-white font-bold">Ritual Testnet</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">CHAIN ID</span>
              <span className="text-purple-300 font-bold">1979</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">RPC ENDPOINT</span>
              <span className="text-slate-300 truncate block">https://rpc.ritualfoundation.org</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">BLOCK EXPLORER</span>
              <a
                href="https://explorer.ritualfoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:underline flex items-center gap-1"
              >
                <span>explorer.ritualfoundation.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
              <span className="text-[10px] text-slate-500 block">APPLICATION PROOF REGISTRY CONTRACT</span>
              <a
                href="https://explorer.ritualfoundation.org/address/0x23cc1998562c39474623639c18c31d49abd0c310"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1.5 break-all mt-0.5"
              >
                <span>WowWebProofRegistry (0x23cc1998562c39474623639c18c31d49abd0c310)</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
