'use client';

import React from 'react';
import { ExecutionStep } from '@wowweb/shared';

interface StepTimelineProps {
  steps: ExecutionStep[];
}

export function StepTimeline({ steps }: StepTimelineProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <h4 className="text-xs font-mono font-semibold uppercase text-purple-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          Autonomous Pipeline Timeline
        </h4>
        <span className="text-[11px] font-mono text-slate-500">{steps.length} Stages Recorded</span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          const isInProgress = step.status === 'in_progress' || step.status === 'pending';

          return (
            <div key={step.id || idx} className="flex items-start gap-3 text-xs group">
              {/* Step indicator */}
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted && (
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/80 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                )}
                {isFailed && (
                  <div className="w-4 h-4 rounded-full bg-rose-950 border border-rose-500 text-rose-400 flex items-center justify-center font-bold text-[10px]">
                    ✕
                  </div>
                )}
                {isInProgress && (
                  <div className="w-4 h-4 rounded-full bg-purple-950 border border-purple-500 text-purple-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isCompleted ? 'text-slate-200' : isFailed ? 'text-rose-400' : 'text-purple-300'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
