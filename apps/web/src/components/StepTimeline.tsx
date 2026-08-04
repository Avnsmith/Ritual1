'use client';

import React from 'react';
import { ExecutionStep } from '@wowweb/shared';

interface StepTimelineProps {
  steps: ExecutionStep[];
}

export function StepTimeline({ steps }: StepTimelineProps) {
  if (!steps || steps.length === 0) return null;

  const stages = ['planner', 'search', 'browser', 'extract', 'retriever', 'reasoner', 'writer', 'verifier', 'publisher'];

  return (
    <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner font-sans text-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <h4 className="text-xs font-mono font-semibold uppercase text-purple-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          Autonomous AI Browser Pipeline (9 Stages)
        </h4>
        <span className="text-[11px] font-mono text-slate-500">{steps.length} Actions Recorded</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center font-mono text-[10px]">
        {stages.map((stageKey, idx) => {
          const matchedStep = steps.find(s => s.stage === stageKey);
          const isDone = matchedStep?.status === 'completed';
          const isFailed = matchedStep?.status === 'failed';
          const isCurrent = matchedStep?.status === 'in_progress';

          return (
            <div
              key={stageKey}
              className={`p-2 rounded-xl border transition-all ${
                isDone
                  ? 'bg-slate-900 border-emerald-500/50 text-emerald-400'
                  : isFailed
                  ? 'bg-rose-950/60 border-rose-500 text-rose-400'
                  : isCurrent
                  ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold shadow-md'
                  : 'bg-slate-950 border-slate-900 text-slate-600'
              }`}
            >
              <div className="uppercase text-[9px] truncate">{stageKey}</div>
              <div className="mt-1 font-bold">
                {isDone ? '✓' : isFailed ? '✕' : isCurrent ? '...' : idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
