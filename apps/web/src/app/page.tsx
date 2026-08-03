'use client';

import React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useAuth } from './providers';
import { ArrowRight, Cpu, ShieldCheck, Sparkles, Globe, Terminal, Lock, CheckCircle2, Zap, Layers } from 'lucide-react';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const { setIsModalOpen } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Autonomous AI Browser Agent on RitualNet
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Don't browse. <br />
          <span className="gradient-text">Just ask.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          WowWeb is an autonomous Web3 AI agent that researches websites, reads documentation, analyzes repositories, and anchors every execution with verifiable on-chain proofs on RitualNet.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isConnected ? (
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
            >
              Launch WowWeb Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
            >
              Connect Wallet & Start <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <Link
            href="/about"
            className="px-6 py-3.5 rounded-xl bg-surface border border-border hover:border-zinc-500 text-sm font-semibold text-zinc-300 transition-colors flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-ritual" /> Architecture Blueprint
          </Link>
        </div>
      </section>

      {/* Interactive Demo Preview Widget */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-border shadow-2xl space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="font-mono text-xs text-zinc-400 ml-2">wowweb-agent://execution-preview</span>
          </div>

          <span className="px-2.5 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> RitualNet Chain ID: 1979
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-surface border border-border text-zinc-300 flex items-center gap-3">
            <span className="text-accent font-bold">&gt;</span>
            <span className="text-white">Research top autonomous AI browser agents in 2026 and compare on-chain proof systems.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-elevated border border-border">
              <span className="text-zinc-500 block">PLANNER AGENT</span>
              <span className="text-zinc-200">Deconstructing 3 sub-tasks</span>
            </div>
            <div className="p-3 rounded-lg bg-elevated border border-border">
              <span className="text-zinc-500 block">BROWSER AGENT</span>
              <span className="text-blue-400">Fetching 4 docs pages</span>
            </div>
            <div className="p-3 rounded-lg bg-elevated border border-border">
              <span className="text-zinc-500 block">VERIFICATION AGENT</span>
              <span className="text-purple-400">keccak256 proof hashing</span>
            </div>
            <div className="p-3 rounded-lg bg-elevated border border-ritual/40">
              <span className="text-zinc-500 block">RITUALNET PROOF</span>
              <span className="text-ritual font-bold">0x8A79...C5E0 Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Autonomous Web Agent</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Opens websites, navigates pages, extracts documentation, inspects GitHub repositories, and handles pagination automatically.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-ritual/10 border border-ritual/30 flex items-center justify-center text-ritual">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Verifiable On-Chain Proofs</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every prompt, step trace, and report generates an immutable cryptographic hash commitment registered on RitualNet (Chain ID: 1979).
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Enshrined AI Precompiles</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Direct integration with Ritual precompiles (0x0801 HTTP, 0x0802 LLM Inference, 0x0820 Stateful Agents, RitualWallet).
          </p>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="glass-panel rounded-2xl p-8 border border-border space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">RitualNet Native Architecture</h2>
          <p className="text-xs text-zinc-400">Off-chain browser execution coupled with on-chain cryptographic verification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-xs font-mono">
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-zinc-500 text-[10px] block">STEP 1</span>
            <span className="text-white font-bold block">User Wallet</span>
            <span className="text-zinc-400 text-[11px]">EIP-4361 Signed Session</span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-zinc-500 text-[10px] block">STEP 2</span>
            <span className="text-accent font-bold block">Planner & Browser</span>
            <span className="text-zinc-400 text-[11px]">Web Fetching & Crawling</span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-zinc-500 text-[10px] block">STEP 3</span>
            <span className="text-purple-400 font-bold block">Research & Summary</span>
            <span className="text-zinc-400 text-[11px]">Matrix & Markdown Synthesis</span>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-zinc-500 text-[10px] block">STEP 4</span>
            <span className="text-blue-400 font-bold block">Verification Agent</span>
            <span className="text-zinc-400 text-[11px]">keccak256 Hash Commitments</span>
          </div>

          <div className="p-4 rounded-xl bg-ritual/10 border border-ritual/30 space-y-2">
            <span className="text-zinc-500 text-[10px] block">STEP 5</span>
            <span className="text-ritual font-bold block">RitualNet Chain</span>
            <span className="text-zinc-400 text-[11px]">WowWebProofRegistry (1979)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
