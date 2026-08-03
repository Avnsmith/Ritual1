'use client';

import React from 'react';
import { Cpu, ShieldCheck, Terminal, Layers, Globe, ExternalLink, Code2 } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="space-y-8 py-4">
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-2">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" /> WowWeb Architecture Blueprint
        </h1>
        <p className="text-xs text-zinc-400">
          Native integration with RitualNet infrastructure (Chain ID: 1979), precompiles, and smart contracts.
        </p>
      </div>

      {/* Precompiles Specification */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-ritual" /> Enshrined Ritual Precompiles
        </h2>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-elevated border-b border-border font-mono text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-3">Precompile</th>
                <th className="p-3">Address</th>
                <th className="p-3">Execution Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-zinc-300 font-mono text-[11px]">
              <tr>
                <td className="p-3 font-semibold text-white">HTTP Precompile</td>
                <td className="p-3 text-accent">0x0000000000000000000000000000000000000801</td>
                <td className="p-3 text-zinc-400 font-sans">On-chain external HTTP API & webhook calls</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">LLM Inference</td>
                <td className="p-3 text-accent">0x0000000000000000000000000000000000000802</td>
                <td className="p-3 text-zinc-400 font-sans">On-chain AI chat & structured LLM JSON outputs</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Long-Running HTTP</td>
                <td className="p-3 text-accent">0x0000000000000000000000000000000000000805</td>
                <td className="p-3 text-zinc-400 font-sans">Multi-phase async web scraping jobs</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Autonomous Agent</td>
                <td className="p-3 text-accent">0x0000000000000000000000000000000000000820</td>
                <td className="p-3 text-zinc-400 font-sans">Stateful agent execution precompile</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Agent Memory</td>
                <td className="p-3 text-accent">0x000000000000000000000000000000000000080C</td>
                <td className="p-3 text-zinc-400 font-sans">Persistent key-value memory for sovereign agents</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* System Contracts */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" /> Core System Contracts
        </h2>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-elevated border-b border-border font-mono text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-3">Contract</th>
                <th className="p-3">Address</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-zinc-300 font-mono text-[11px]">
              <tr>
                <td className="p-3 font-semibold text-white">RitualWallet</td>
                <td className="p-3 text-ritual">0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948</td>
                <td className="p-3 text-zinc-400 font-sans">Precompile fee deposits, locks, and payments</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">SecretsAccessControl</td>
                <td className="p-3 text-ritual">0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD</td>
                <td className="p-3 text-zinc-400 font-sans">ECIES encryption & access control</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">WowWebProofRegistry</td>
                <td className="p-3 text-ritual">0x8A79c67B92A2C683dFE59188FfA20C215682C5E0</td>
                <td className="p-3 text-zinc-400 font-sans">Native proof registry contract on RitualNet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
