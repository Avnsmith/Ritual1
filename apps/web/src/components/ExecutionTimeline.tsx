'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '@wowweb/shared';
import { CheckCircle2, Loader2, AlertCircle, Compass, Globe, FileText, ShieldCheck, Terminal, Sparkles, Search, Cpu } from 'lucide-react';

export function ExecutionTimeline({ steps }: { steps: ExecutionStep[] }) {
  const currentStep = steps[steps.length - 1];
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const totalEstimated = 8;
  const progressPercent = Math.min(100, Math.round((completedCount / totalEstimated) * 100));

  const getIcon = (stage: string) => {
    switch (stage) {
      case 'planner': return <Compass className="w-4 h-4 text-purple-400" />;
      case 'search': return <Search className="w-4 h-4 text-cyan-400" />;
      case 'browser': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'retriever': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'reasoner': return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'writer': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'verifier':
      case 'publisher':
      case 'verification':
      case 'proof': return <ShieldCheck className="w-4 h-4 text-purple-300" />;
      default: return <Compass className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header & Progress Indicator */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Live Verifiable Pipeline Execution
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Active Stage: <strong className="text-white uppercase">{currentStep?.stage || 'Initializing'}</strong></span>
          <span>Stage {completedCount} of {totalEstimated}</span>
        </div>
      </div>

      {/* Trajectory Step Cards */}
      <div className="space-y-2">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                step.status === 'in_progress'
                  ? 'bg-purple-950/40 border-purple-600/60 shadow-lg shadow-purple-950/40'
                  : step.status === 'completed'
                  ? 'bg-slate-900/70 border-slate-800'
                  : 'bg-rose-950/40 border-rose-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {getIcon(step.stage)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                      {step.title}
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {step.stage}
                      </span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {step.status === 'in_progress' ? (
                    <Loader2 className="w-4.5 h-4.5 text-purple-400 animate-spin" />
                  ) : step.status === 'completed' ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
