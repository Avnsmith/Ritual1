'use client';

import React from 'react';
import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';
import { ArrowRight, Sparkles, Globe, ShieldCheck, Cpu } from 'lucide-react';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 selection:bg-purple-900 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/20">
            W
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">WowWeb</h1>
            <p className="text-[11px] text-slate-400 font-medium">Verifiable AI Browser Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-900/30"
          >
            Start Research &rarr;
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl mx-auto w-full text-center space-y-8 my-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-mono font-medium shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          The First Verifiable AI Browser Agent
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
            Research anything. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
              Verify everything.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            WowWeb autonomously searches the web, crawls documentation & GitHub repositories, performs deep LLM reasoning, and cryptographically verifies every research output on RitualNet.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isConnected ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-950/80 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Start Research</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={() => {
                const injected = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask');
                if (injected) connect({ connector: injected });
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-950/80 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Connect Wallet</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-base transition-colors"
          >
            Launch Browser Agent
          </Link>
        </div>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-slate-200">Autonomous Web Retrieval</h3>
            <p className="text-xs text-slate-400">Multi-engine search, GitHub parsing, PDF text extraction & web crawling.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-200">Multi-LLM Reasoning</h3>
            <p className="text-xs text-slate-400">Support for OpenAI, Gemini, Claude, Groq, OpenRouter & Ollama.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-200">Ritual Verification Layer</h3>
            <p className="text-xs text-slate-400">Cryptographic hash commitments anchored on RitualNet smart contracts.</p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-6xl mx-auto w-full py-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>WowWeb Verifiable AI Browser Agent</div>
        <div>RitualNet Chain ID: 1979</div>
      </footer>
    </div>
  );
}
