'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../providers';
import { ExecutionTimeline } from '../../components/ExecutionTimeline';
import { ReportViewer } from '../../components/ReportViewer';
import { SourcePanel } from '../../components/SourcePanel';
import { AgentTask, ExecutionStep } from '@wowweb/shared';
import { Search, Sparkles, ShieldCheck, Terminal, Compass, ArrowRight, Loader2, Settings, Globe, Server, User, Cpu, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  task?: AgentTask;
  steps?: ExecutionStep[];
  isStreaming?: boolean;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const { setIsSettingsOpen, aiConfig } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeOwner = address || '0x49d50AC6842162332cc2FfC8E5A1813c2035e40e';

  const suggestedPrompts = [
    'Research RitualNet AI precompiles 0x0801 and 0x0802',
    'Compare WowWeb vs Perplexity and Manus AI agents',
    'Inspect Ritual foundation GitHub repositories and SDK',
    'Analyze zero-knowledge proof verification on RitualNet',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleStartTask = (queryPrompt?: string) => {
    const targetPrompt = queryPrompt || prompt;
    if (!targetPrompt.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: targetPrompt,
      timestamp: Date.now(),
    };

    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: Date.now(),
      steps: [],
      isStreaming: true,
    };

    setChatMessages(prev => [...prev, userMsg, assistantMsg]);
    setPrompt('');
    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    const params = new URLSearchParams({
      prompt: targetPrompt,
      owner: activeOwner,
      provider: aiConfig.provider || 'openai',
      ...(aiConfig.apiKey ? { apiKey: aiConfig.apiKey } : {}),
      ...(aiConfig.model ? { model: aiConfig.model } : {}),
      ...(aiConfig.temperature ? { temperature: String(aiConfig.temperature) } : {}),
    });

    const sseUrl = `${backendUrl}/api/agent/stream?${params.toString()}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('step', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.step) {
        setChatMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              const currentSteps = msg.steps || [];
              const updatedTask = data.task || msg.task;
              return {
                ...msg,
                steps: [...currentSteps, data.step],
                task: updatedTask,
              };
            }
            return msg;
          })
        );
      }
    });

    eventSource.addEventListener('complete', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.task) {
        setChatMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                task: data.task,
                isStreaming: false,
              };
            }
            return msg;
          })
        );

        // Save to localStorage history
        try {
          const localHistoryStr = localStorage.getItem('wowweb_history');
          const existingHistory: AgentTask[] = localHistoryStr ? JSON.parse(localHistoryStr) : [];
          const updatedHistory = [data.task, ...existingHistory.filter(t => t.id !== data.task.id)];
          localStorage.setItem('wowweb_history', JSON.stringify(updatedHistory));
        } catch {
          // Ignore storage errors
        }
      }
      setLoading(false);
      eventSource.close();
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      console.error('SSE Error:', e);
      setLoading(false);
      eventSource.close();
      setChatMessages(prev =>
        prev.map(msg => {
          if (msg.id === assistantMsgId) {
            return {
              ...msg,
              isStreaming: false,
            };
          }
          return msg;
        })
      );
    });
  };

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Provider & Settings Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Active AI Agent:</span>
              <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-mono uppercase">
                {aiConfig.provider || 'OPENAI'} ({aiConfig.model || 'gpt-4o-mini'})
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              {aiConfig.apiKey ? '🟢 Custom API Key Active' : '🟡 System Default Relayer Key Active'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-2 shrink-0"
        >
          <Settings className="w-4 h-4" />
          <span>⚙ Configure AI Settings &amp; API Keys</span>
        </button>
      </div>

      {/* Conversational Welcome Banner */}
      {chatMessages.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 border border-border text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">What do you want to research?</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
              Ask WowWeb anything. Our multi-agent browser queries official docs, parses live web pages, synthesizes research reports, and records verifiable proofs on RitualNet.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {suggestedPrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleStartTask(s)}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-elevated border border-border text-xs text-zinc-300 hover:text-accent transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-accent" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Chat Feed */}
      <div className="space-y-6">
        {chatMessages.map(msg => (
          <div key={msg.id} className="space-y-4">
            {msg.sender === 'user' ? (
              <div className="flex items-start gap-3 justify-end">
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-xs text-white max-w-xl font-medium shadow-md">
                  {msg.content}
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-4">
                  {/* Execution Steps Timeline */}
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="glass-panel rounded-2xl p-5 border border-border">
                      <ExecutionTimeline steps={msg.steps} />
                    </div>
                  )}

                  {/* Dedicated Session Link */}
                  {msg.task?.id && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-xs">
                      <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Session ID: {msg.task.id.slice(0, 14)}...
                      </span>
                      <Link
                        href={`/research/${msg.task.id}`}
                        className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent font-semibold hover:bg-accent/20 transition-colors flex items-center gap-1"
                      >
                        Open Dedicated Session Page (/research/{msg.task.id.slice(0, 8)}) <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Markdown Report & Visited Source Sidebar */}
                  {msg.task?.report && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <ReportViewer report={msg.task.report} proof={msg.task.proof} />
                      </div>
                      <div className="lg:col-span-1">
                        <SourcePanel sources={msg.task.report.sources} />
                      </div>
                    </div>
                  )}

                  {msg.isStreaming && (
                    <div className="flex items-center gap-2 text-xs text-accent font-mono animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" /> Stream executing LLM inference &amp; RitualNet block proof...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed Bottom Command Input Bar */}
      <div className="sticky bottom-4 z-30 glass-panel rounded-2xl p-3 border border-accent/40 shadow-2xl bg-zinc-950/90 backdrop-blur-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-accent" />
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStartTask()}
            placeholder="Ask WowWeb anything... (e.g. Research RitualNet AI precompiles and verify contracts)"
            className="w-full pl-12 pr-32 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-sans"
          />

          <button
            onClick={() => handleStartTask()}
            disabled={loading || !prompt.trim()}
            className="absolute right-2.5 px-5 py-2 rounded-lg bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-accent/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Executing...' : 'Research'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
