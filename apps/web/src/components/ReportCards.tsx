'use client';

import React from 'react';
import { ResearchReport, ProofMetadata } from '@wowweb/shared';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Globe } from 'lucide-react';
import { ProofBadge } from './ProofBadge';

interface ReportCardsProps {
  report: ResearchReport;
  proof?: ProofMetadata;
}

export function ReportCards({ report, proof }: ReportCardsProps) {
  if (!report) return null;

  const sourcesCount = report.sources?.length || 0;

  return (
    <div className="space-y-6 max-w-[950px] mx-auto font-sans text-slate-200">
      {/* 1. Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Overview
          </h3>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Sources Used: {sourcesCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950 text-emerald-400 border border-slate-800">
              Evidence: {report.evidenceQuality || 'High'}
            </span>
          </div>
        </div>
        <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans pt-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.summary || report.rawMarkdown || 'No overview available.'}
          </ReactMarkdown>
        </div>
      </div>

      {/* 2. Evidence & Key Findings Card */}
      {report.keyFindings && report.keyFindings.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-purple-400 border-b border-slate-800/80 pb-2">
            Evidence &amp; Key Findings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 border border-purple-800">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-normal">{finding}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Comparison & Tradeoffs */}
      {(report.pros?.length > 0 || report.cons?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.pros?.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4" /> Architectural Advantages
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.cons?.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <AlertTriangle className="w-4 h-4" /> Tradeoffs &amp; Considerations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 4. Ritual Verification Badge */}
      {proof && (
        <div className="pt-2">
          <ProofBadge proof={proof} />
        </div>
      )}
    </div>
  );
}
