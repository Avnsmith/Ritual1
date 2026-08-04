'use client';

import React from 'react';
import { ArrowRight, Table, Layers, FileText, Globe, ShieldCheck, Download } from 'lucide-react';

interface QuickActionsProps {
  onAction: (actionType: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'continue', label: 'Continue Research', icon: ArrowRight },
    { id: 'compare', label: 'Compare Alternatives', icon: Layers },
    { id: 'table', label: 'Generate Comparison Table', icon: Table },
    { id: 'expand', label: 'Expand Analysis', icon: FileText },
    { id: 'sources', label: 'Open Sources', icon: Globe },
    { id: 'verify', label: 'Verify on Ritual', icon: ShieldCheck },
    { id: 'export', label: 'Export Report', icon: Download },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 font-sans text-xs select-none">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={() => onAction(act.id)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-600/60 text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-sm font-medium active:scale-95"
          >
            <Icon className="w-3.5 h-3.5 text-purple-400" />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}
