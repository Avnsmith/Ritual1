'use client';

import React, { useState } from 'react';
import { AgentTask, ExecutionStep, SourceCitation, ResearchReport, ProofMetadata } from '@wowweb/shared';
import { Sparkles, Layers, Globe, Clock, ShieldCheck, Download, Bookmark, BookOpen, Cpu } from 'lucide-react';
import { ReportCards } from './ReportCards';
import { ReplayAgent } from './ReplayAgent';
import { SourcePanel } from './SourcePanel';
import { ProofBadge } from './ProofBadge';
import { ExportMenu } from './ExportMenu';

interface ResearchWorkspaceProps {
  task?: AgentTask;
  report?: ResearchReport;
  proof?: ProofMetadata;
  steps?: ExecutionStep[];
  sources?: SourceCitation[];
}

export function ResearchWorkspace({ task, report, proof, steps = [], sources = [] }: ResearchWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'evidence' | 'artifacts' | 'timeline' | 'proof'>('insights');

  const tabs = [
    { id: 'insights', label: 'Insights & Report', icon: Sparkles },
    { id: 'evidence', label: 'Evidence & Sources', icon: Globe },
    { id: 'artifacts', label: 'Architecture Specs', icon: Layers },
    { id: 'timeline', label: 'Replay Agent', icon: Clock },
    { id: 'proof', label: 'Ritual Proof', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 max-w-[950px] mx-auto font-sans select-none">
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Persistent Research Workspace
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <ExportMenu task={task} />
        </div>
      </div>

      {/* Notion-style Workspace Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto no-scrollbar text-xs font-medium">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4 text-purple-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'insights' && (
          <div>
            {report ? (
              <ReportCards report={report} proof={proof} />
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No report synthesized yet. Start a research session below.
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div>
            <SourcePanel sources={sources.length > 0 ? sources : report?.sources || []} />
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-mono uppercase font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4" /> Architecture Diagrams &amp; Specifications
            </h3>
            <p className="leading-relaxed">
              Verifiable Execution Pipeline Specs &amp; On-Chain Commitment Hashes.
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto">
              <pre>{report?.mermaidDiagram || report?.rawMarkdown?.slice(0, 800) || 'Architectural Specification Output'}</pre>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <ReplayAgent steps={steps} />
          </div>
        )}

        {activeTab === 'proof' && (
          <div className="space-y-4">
            {proof ? (
              <ProofBadge proof={proof} />
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                Proof hash commitments will be computed automatically upon research completion.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
