'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '@wowweb/shared';
import { CheckCircle2, Loader2, AlertCircle, Compass, Globe, FileText, ShieldCheck, Terminal, Layers, Sparkles } from 'lucide-react';

export function ExecutionTimeline({ steps }: { steps: ExecutionStep[] }) {
  const currentStep = steps[steps.length - 1];
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const totalEstimated = 6;
  const progressPercent = Math.min(100, Math.round((completedCount / totalEstimated) * 100));

  const getIcon = (stage: ExecutionStep['stage']) => {
    switch (stage) {
      case 'planner': return <Compass className="w-4 h-4 text-accent" />;
      case 'browser': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'research': return <FileText className="w-4 h-4 text-purple-400" />;
      case 'summary': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'verification':
      case 'proof': return <ShieldCheck className="w-4 h-4 text-ritual" />;
      default: return <Compass className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header & Progress Indicator */}
      <div className="glass-panel p-4 rounded-xl border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-spin" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Live Agent Execution Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-ritual">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-accent via-purple-500 to-ritual transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Active Agent: <strong className="text-white uppercase">{currentStep?.stage || 'Initializing'}</strong></span>
          <span>Step {completedCount} of {totalEstimated}</span>
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
                  ? 'bg-surface border-accent/50 shadow-lg shadow-accent/10'
                  : step.status === 'completed'
                  ? 'bg-elevated/80 border-border/80'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface border border-border shrink-0 mt-0.5">
                    {getIcon(step.stage)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
                      {step.title}
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-border text-zinc-400">
                        {step.stage}
                      </span>
                    </h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {step.status === 'in_progress' ? (
                    <Loader2 className="w-4.5 h-4.5 text-accent animate-spin" />
                  ) : step.status === 'completed' ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-ritual" />
                  ) : (
                    <AlertCircle className="w-4.5 h-4.5 text-red-400" />
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
