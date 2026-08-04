'use client';

import React, { useState } from 'react';
import { ResearchReport, ProofMetadata } from '@wowweb/shared';
import { ProofBadge } from './ProofBadge';
import { Copy, Download, Sparkles, FileText, CheckCircle2, AlertTriangle, ExternalLink, Check } from 'lucide-react';

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
    <div className="space-y-6 max-w-[950px] mx-auto font-sans text-slate-200">
      {/* Proof Badge Banner */}
      {proof && <ProofBadge proof={proof} />}

      {/* Header Actions */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-mono font-medium flex items-center gap-1.5 w-fit mb-2 border border-purple-800">
              <Sparkles className="w-3.5 h-3.5" /> Verifiable Research Output
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{report.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Evidence Quality: <span className="text-emerald-400 font-bold">{report.evidenceQuality || 'High'}</span> | {report.sources?.length || 0} Verified Sources
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" /> Overview &amp; Summary
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {report.summary}
          </p>
        </div>

        {/* Key Findings */}
        {report.keyFindings && report.keyFindings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.keyFindings.map((finding, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Sources */}
        {report.sources && report.sources.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Verified Web Sources</h3>
            <div className="space-y-2">
              {report.sources.map((src, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-600/60 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-purple-300 hover:underline flex items-center gap-1.5">
                      <span>{idx + 1}. {src.title}</span>
                      <ExternalLink className="w-3 h-3 text-purple-400" />
                    </a>
                    <span className="font-mono text-[10px] text-slate-500">Hash: {src.contentHash ? src.contentHash.slice(0, 10) : '0x...'}...</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"{src.snippet}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
