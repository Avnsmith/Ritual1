'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Sidebar } from '@/components/Sidebar';
import { StepTimeline } from '@/components/StepTimeline';
import { ProofBadge } from '@/components/ProofBadge';
import { SourcePanel } from '@/components/SourcePanel';
import { ReportCards } from '@/components/ReportCards';
import { ResearchWorkspace } from '@/components/ResearchWorkspace';
import { QuickActions } from '@/components/QuickActions';
import { ExportMenu } from '@/components/ExportMenu';
import { AgentTask, ExecutionStep, SourceCitation, ResearchReport, ProofMetadata } from '@wowweb/shared';
import { Search, Sparkles, Loader2, User, Cpu, PanelRightClose, PanelRightOpen, ArrowRight } from 'lucide-react';

interface ChatItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  task?: AgentTask;
  steps?: ExecutionStep[];
  sources?: SourceCitation[];
  proof?: ProofMetadata;
  report?: ResearchReport;
  isStreaming?: boolean;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeOwner = address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  const suggestedQueries = [
    'Analyze Aptos vs Sui architecture & consensus',
    'Explain Ritual Infernet precompiles 0x0801 & 0x0802',
    'Research Zama FHE & Fully Homomorphic Encryption in Web3',
    'Compare EigenLayer AVS vs RitualNet AI Verification',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'sources') {
      setRightPanelOpen(true);
      return;
    }
    if (actionId === 'continue') {
      setPrompt('Continue expanding on the architectural tradeoffs and scaling metrics...');
      return;
    }
    if (actionId === 'compare') {
      setPrompt('Compare these architecture results with EVM and Solana benchmarks...');
      return;
    }
    if (actionId === 'table') {
      setPrompt('Generate a detailed feature comparison table for these systems...');
      return;
    }
    if (actionId === 'expand') {
      setPrompt('Expand deeply on security, cryptographic proofs, and failure modes...');
      return;
    }
  };

  const handleStartTask = (queryPrompt?: string) => {
    const targetPrompt = queryPrompt || prompt;
    if (!targetPrompt.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    const userMsg: ChatItem = {
      id: userMsgId,
      role: 'user',
      content: targetPrompt,
      timestamp: Date.now(),
    };

    const assistantMsg: ChatItem = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      steps: [],
      sources: [],
      isStreaming: true,
    };

    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
    setPrompt('');
    setLoading(true);

    let aiProvider = 'openai';
    let apiKey = '';
    let searchEngine = 'duckduckgo';
    let autoPublish = true;

    try {
      const savedAi = localStorage.getItem('wowweb_ai_config');
      if (savedAi) {
        const parsed = JSON.parse(savedAi);
        if (parsed.provider) aiProvider = parsed.provider;
        if (parsed.apiKey) apiKey = parsed.apiKey;
      }
      const savedSearch = localStorage.getItem('wowweb_search_config');
      if (savedSearch) {
        const parsed = JSON.parse(savedSearch);
        if (parsed.provider) searchEngine = parsed.provider;
      }
      const savedRitual = localStorage.getItem('wowweb_ritual_config');
      if (savedRitual) {
        const parsed = JSON.parse(savedRitual);
        if (typeof parsed.autoPublish === 'boolean') autoPublish = parsed.autoPublish;
      }
    } catch {
      // Ignore
    }

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
    const params = new URLSearchParams({
      prompt: targetPrompt,
      owner: activeOwner,
      provider: aiProvider,
      searchEngine,
      autoPublish: String(autoPublish),
      ...(apiKey ? { apiKey } : {}),
    });

    const sseUrl = `${backendUrl}/api/agent/stream?${params.toString()}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('step', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.step) {
        setChatMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              const currentSteps = msg.steps || [];
              const updatedTask = data.task || msg.task;
              const extractedSources = updatedTask?.report?.sources || msg.sources || [];
              return {
                ...msg,
                steps: [...currentSteps, data.step],
                task: updatedTask,
                sources: extractedSources,
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
        setChatMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                task: data.task,
                content: data.task.report?.rawMarkdown || '',
                sources: data.task.report?.sources || [],
                proof: data.task.proof,
                report: data.task.report,
                isStreaming: false,
              };
            }
            return msg;
          })
        );
      }
      setLoading(false);
      eventSource.close();
    });

    eventSource.addEventListener('error', (e: MessageEvent) => {
      console.error('SSE Error:', e);
      setLoading(false);
      eventSource.close();
      setChatMessages((prev) =>
        prev.map((msg) => {
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

  const activeAssistantItem = chatMessages.filter((m) => m.role === 'assistant').slice(-1)[0];
  const activeSources = activeAssistantItem?.sources || [];
  const activeTask = activeAssistantItem?.task;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-purple-900 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Research Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Workspace Header */}
        <header className="p-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-sm text-white tracking-tight">AI Research Workspace</h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-800/60">
              Verified by RitualNet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ExportMenu task={activeTask} />

            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={rightPanelOpen ? 'Close Right Panel' : 'Open Sources Panel'}
            >
              {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Central Chat & Workspace Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Reading & Chat Thread (~950px Max Width Clamped) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {chatMessages.length === 0 && (
              <div className="max-w-[850px] mx-auto text-center space-y-6 my-16">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 mx-auto shadow-lg shadow-purple-950/50">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">Research anything. Verify everything.</h1>
                  <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
                    Ask WowWeb anything. Our autonomous browser agent crawls web pages, extracts GitHub repositories, synthesizes answers, and anchors cryptographic proofs on RitualNet.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
                  {suggestedQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStartTask(q)}
                      className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-600/60 text-xs text-slate-300 transition-all flex items-start gap-2.5 group shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-4 max-w-[950px] mx-auto">
                {msg.role === 'user' ? (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-xs text-white max-w-xl font-medium shadow-md">
                      {msg.content}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-700 flex items-center justify-center text-purple-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                      W
                    </div>
                    <div className="flex-1 space-y-4 overflow-hidden">
                      {/* Real-time 8-stage step timeline */}
                      {msg.steps && msg.steps.length > 0 && <StepTimeline steps={msg.steps} />}

                      {/* Render structured Notion-style Report Cards */}
                      {msg.report ? (
                        <div className="space-y-6">
                          <ReportCards report={msg.report} proof={msg.proof} />
                          <QuickActions onAction={handleQuickAction} />
                        </div>
                      ) : msg.content ? (
                        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans shadow-xl">
                          {msg.content}
                        </div>
                      ) : null}

                      {msg.isStreaming && (
                        <div className="flex items-center gap-2 text-xs text-purple-400 font-mono animate-pulse pt-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Autonomous agent retrieving web pages &amp; running LLM reasoning...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Right Collapsible Sources & Properties Panel */}
          {rightPanelOpen && (
            <div className="w-80 border-l border-slate-800/80 bg-slate-950/80 p-4 overflow-y-auto hidden lg:block animate-in slide-in-from-right duration-200">
              <SourcePanel sources={activeSources} />
            </div>
          )}
        </div>

        {/* Fixed Command Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
          <div className="max-w-[950px] mx-auto relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartTask()}
              placeholder="What do you want to research? (e.g. Compare Aptos and Sui architecture)"
              className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-sans shadow-lg"
            />

            <button
              onClick={() => handleStartTask()}
              disabled={loading || !prompt.trim()}
              className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-purple-900/40 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'Researching...' : 'Research'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
