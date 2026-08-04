'use client';

import React, { useState } from 'react';
import { AgentTask, ExportFormat } from '@wowweb/shared';
import { Download, FileText, Code, Link as LinkIcon, Check, Copy } from 'lucide-react';

interface ExportMenuProps {
  task?: AgentTask;
}

export function ExportMenu({ task }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  if (!task || !task.report) return null;

  const handleExport = (format: ExportFormat) => {
    setIsOpen(false);
    const report = task.report!;

    if (format === 'copy_markdown') {
      navigator.clipboard.writeText(report.rawMarkdown);
      setCopiedStatus('Markdown Copied!');
      setTimeout(() => setCopiedStatus(null), 3000);
      return;
    }

    if (format === 'markdown') {
      const blob = new Blob([report.rawMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${task.prompt.slice(0, 30).replace(/\s+/g, '_')}_Research.md`;
      a.click();
      return;
    }

    if (format === 'json') {
      const exportData = {
        taskId: task.id,
        prompt: task.prompt,
        createdAt: task.createdAt,
        report: task.report,
        proof: task.proof,
        verifiableOnChain: true,
        chain: 'RitualNet (1979)',
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${task.id}_Export.json`;
      a.click();
      return;
    }

    if (format === 'share') {
      const shareUrl = `${window.location.origin}/research/${task.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedStatus('Share Link Copied!');
      setTimeout(() => setCopiedStatus(null), 3000);
      return;
    }

    if (format === 'pdf') {
      window.print();
      return;
    }
  };

  return (
    <div className="relative font-sans text-xs select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-purple-400" />
        <span>Export</span>
      </button>

      {copiedStatus && (
        <div className="absolute right-0 -top-8 px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 text-[11px] font-mono whitespace-nowrap shadow-lg animate-in fade-in duration-200">
          <Check className="w-3 h-3 inline mr-1 text-emerald-400" /> {copiedStatus}
        </div>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 space-y-1 z-40 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => handleExport('copy_markdown')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>Copy Markdown</span>
          </button>

          <button
            onClick={() => handleExport('markdown')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Export to PDF</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Export JSON</span>
          </button>

          <div className="border-t border-slate-900 pt-1">
            <button
              onClick={() => handleExport('share')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-purple-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Copy Share Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
