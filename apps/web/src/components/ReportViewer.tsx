'use client';

import React, { useState } from 'react';
import { ResearchReport } from '@wowweb/shared';
import { ProofBadge } from './ProofBadge';
import { ProofMetadata } from '@wowweb/shared';
import { Copy, Download, Share2, Check, ExternalLink, Sparkles, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ReportViewer({ report, proof }: { report: ResearchReport; proof?: ProofMetadata }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([report.rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wowweb_report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Proof Badge Banner */}
      {proof && <ProofBadge proof={proof} />}

      {/* Header Actions */}
      <div className="glass-panel rounded-2xl p-6 border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-medium flex items-center gap-1.5 w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Verifiable Autonomous Report
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{report.title}</h1>
            <p className="text-xs text-zinc-400 mt-1">Confidence Score: <span className="text-ritual font-bold">{report.confidenceScore}%</span> | {report.sources.length} Verified Sources</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-zinc-500 text-xs text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-ritual" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" /> Executive Summary
          </h3>
          <p className="text-sm text-zinc-200 leading-relaxed bg-surface p-4 rounded-xl border border-border">
            {report.summary}
          </p>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.keyFindings.map((finding, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-surface border border-border text-xs text-zinc-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-ritual shrink-0 mt-0.5" />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {report.comparisonTable && report.comparisonTable.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Architecture Comparison Matrix</h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-elevated border-b border-border font-mono text-zinc-400 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-accent">WowWeb (RitualNet)</th>
                    <th className="p-3">Standard AI Chatbot</th>
                    <th className="p-3">Web2 Extension</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-zinc-300">
                  {report.comparisonTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-elevated/50 transition-colors">
                      <td className="p-3 font-semibold text-white">{row.feature}</td>
                      <td className="p-3 text-ritual font-medium">{row['WowWeb (RitualNet)']}</td>
                      <td className="p-3 text-zinc-400">{row['Standard AI Chatbot']}</td>
                      <td className="p-3 text-zinc-400">{row['Web2 Browser Extension']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Advantages & Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-ritual/5 border border-ritual/20 space-y-2">
            <h4 className="text-xs font-bold text-ritual uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Key Advantages
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {report.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-ritual">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-2">
            <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Considerations
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {report.cons.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verified Sources */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Verified Sources & Citations</h3>
          <div className="space-y-2">
            {report.sources.map((src, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-surface border border-border hover:border-zinc-500 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5">
                    <span>{idx + 1}. {src.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="font-mono text-[10px] text-zinc-500">Hash: {src.contentHash.slice(0, 10)}...</span>
                </div>
                <p className="text-xs text-zinc-400 italic">"{src.snippet}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
