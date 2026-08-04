'use client';

import React, { useState, useEffect } from 'react';
import { ExecutionStep, PipelineStage } from '@wowweb/shared';
import { Play, Pause, RotateCcw, Compass, Search, Globe, FileText, Database, Cpu, Terminal, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReplayAgentProps {
  steps: ExecutionStep[];
}

export function ReplayAgent({ steps }: ReplayAgentProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps]);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-mono">
        No execution replay steps recorded.
      </div>
    );
  }

  const currentStep = steps[activeStepIndex] || steps[0];

  const getStageIcon = (stage: PipelineStage) => {
    switch (stage) {
      case 'planner': return <Compass className="w-5 h-5 text-purple-400" />;
      case 'search': return <Search className="w-5 h-5 text-cyan-400" />;
      case 'browser': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'extract': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'retriever': return <Database className="w-5 h-5 text-amber-400" />;
      case 'reasoner': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'writer': return <Terminal className="w-5 h-5 text-emerald-300" />;
      case 'verifier': return <ShieldCheck className="w-5 h-5 text-purple-300" />;
      case 'publisher': return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      default: return <Compass className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 max-w-[950px] mx-auto font-sans text-slate-200">
      {/* Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎬</span> Replay Browser Agent Journey
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step reconstruction of the 9 autonomous browser pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-950/50"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play Replay'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStepIndex(0);
            }}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Replay"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubber */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Action {activeStepIndex + 1} of {steps.length}: <strong className="text-purple-300 uppercase">{currentStep.stage}</strong></span>
          <span>{currentStep.durationMs ? `${(currentStep.durationMs / 1000).toFixed(1)}s elapsed` : '1.2s'}</span>
        </div>

        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={activeStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setActiveStepIndex(parseInt(e.target.value));
          }}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>

      {/* 9 Stage Indicator Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-[9px] font-mono">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          const isFailed = step.status === 'failed';
          return (
            <div
              key={step.id || idx}
              onClick={() => {
                setIsPlaying(false);
                setActiveStepIndex(idx);
              }}
              className={`p-2 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold shadow-md'
                  : isFailed
                  ? 'bg-rose-950 border-rose-500 text-rose-400'
                  : isPassed
                  ? 'bg-slate-950 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="uppercase truncate">{step.stage}</div>
              <div className="mt-1 font-sans">{isFailed ? '✕' : isPassed ? '✓' : idx + 1}</div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-purple-800/40 space-y-3 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              {getStageIcon(currentStep.stage)}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold tracking-wider">
                Stage {activeStepIndex + 1}: {currentStep.stage}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{currentStep.title}</h4>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1 border ${
            currentStep.status === 'failed'
              ? 'bg-rose-950 border-rose-500 text-rose-400'
              : 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
          }`}>
            {currentStep.status === 'failed' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span className="uppercase">{currentStep.status}</span>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.description}</p>
      </div>
    </div>
  );
}
