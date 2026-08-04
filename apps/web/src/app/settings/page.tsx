'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { LLMProviderType, SearchEngineType } from '@wowweb/shared';
import { Check, Key, Cpu, Search, Globe, Shield, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'search' | 'browser' | 'ritual'>('ai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Settings State
  const [aiProvider, setAiProvider] = useState<LLMProviderType>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2048);

  // Search Settings State
  const [searchProvider, setSearchProvider] = useState<SearchEngineType>('duckduckgo');
  const [searchApiKey, setSearchApiKey] = useState('');

  // Browser Settings State
  const [depth, setDepth] = useState(2);
  const [parallelCrawlers, setParallelCrawlers] = useState(4);
  const [maxPages, setMaxPages] = useState(8);
  const [timeoutMs, setTimeoutMs] = useState(10000);

  // Ritual Settings State
  const [autoPublish, setAutoPublish] = useState(true);
  const [publishMode, setPublishMode] = useState<'auto' | 'manual'>('auto');
  const [verificationLevel, setVerificationLevel] = useState<'standard' | 'strict'>('standard');

  useEffect(() => {
    try {
      const savedAi = localStorage.getItem('wowweb_ai_config');
      if (savedAi) {
        const parsed = JSON.parse(savedAi);
        setAiProvider(parsed.provider || 'openai');
        setApiKey(parsed.apiKey || '');
        setModel(parsed.model || '');
        setTemperature(parsed.temperature ?? 0.3);
        setMaxTokens(parsed.maxTokens ?? 2048);
      }

      const savedSearch = localStorage.getItem('wowweb_search_config');
      if (savedSearch) {
        const parsed = JSON.parse(savedSearch);
        setSearchProvider(parsed.provider || 'duckduckgo');
        setSearchApiKey(parsed.apiKey || '');
      }

      const savedBrowser = localStorage.getItem('wowweb_browser_config');
      if (savedBrowser) {
        const parsed = JSON.parse(savedBrowser);
        setDepth(parsed.depth ?? 2);
        setParallelCrawlers(parsed.parallelCrawlers ?? 4);
        setMaxPages(parsed.maxPages ?? 8);
        setTimeoutMs(parsed.timeoutMs ?? 10000);
      }

      const savedRitual = localStorage.getItem('wowweb_ritual_config');
      if (savedRitual) {
        const parsed = JSON.parse(savedRitual);
        setAutoPublish(parsed.autoPublish ?? true);
        setPublishMode(parsed.publishMode || 'auto');
        setVerificationLevel(parsed.verificationLevel || 'standard');
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      'wowweb_ai_config',
      JSON.stringify({ provider: aiProvider, apiKey, model, temperature, maxTokens })
    );
    localStorage.setItem(
      'wowweb_search_config',
      JSON.stringify({ provider: searchProvider, apiKey: searchApiKey })
    );
    localStorage.setItem(
      'wowweb_browser_config',
      JSON.stringify({ depth, parallelCrawlers, maxPages, timeoutMs })
    );
    localStorage.setItem(
      'wowweb_ritual_config',
      JSON.stringify({ autoPublish, publishMode, verificationLevel })
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Agent Architecture Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure LLM inference, search engine plugins, browser depth, and Ritual verification.
          </p>
        </div>

        {/* Success Banner */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Settings saved successfully! Active configuration updated.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          {[
            { id: 'ai', label: 'AI Models', icon: Cpu },
            { id: 'search', label: 'Search Engine', icon: Search },
            { id: 'browser', label: 'Browser Agent', icon: Globe },
            { id: 'ritual', label: 'Ritual Verification', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  isActive
                    ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* 1. AI TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-3">
                  LLM Provider Selection
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'openai', label: 'OpenAI (GPT-4o)', desc: 'Best overall synthesis' },
                    { id: 'gemini', label: 'Google Gemini', desc: 'Fast & multimodal' },
                    { id: 'anthropic', label: 'Claude (Anthropic)', desc: 'Superior reasoning' },
                    { id: 'groq', label: 'Groq (Llama 3.1)', desc: 'Ultra low-latency' },
                    { id: 'openrouter', label: 'OpenRouter', desc: 'Multi-model gateway' },
                    { id: 'ollama', label: 'Ollama (Local)', desc: 'Self-hosted LLM' },
                  ].map((p) => {
                    const isSelected = aiProvider === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setAiProvider(p.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-950/80 border-purple-500 shadow-md shadow-purple-950/50'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm text-slate-100">{p.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-2">
                  API Key Input
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${aiProvider.toUpperCase()} API Key...`}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Keys are stored client-side in localStorage and never logged.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Max Output Tokens ({maxTokens})
                  </label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-3">
                  Search Engine Plugin Architecture
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'duckduckgo', label: 'DuckDuckGo', desc: 'No API Key required (Default)' },
                    { id: 'brave', label: 'Brave Search', desc: 'Independent web index' },
                    { id: 'tavily', label: 'Tavily Search', desc: 'AI-optimized retrieval' },
                    { id: 'serper', label: 'Serper.dev', desc: 'Google Search API' },
                    { id: 'exa', label: 'Exa.ai', desc: 'Neural web search' },
                  ].map((s) => {
                    const isSelected = searchProvider === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSearchProvider(s.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-950/80 border-purple-500 shadow-md'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm text-slate-100">{s.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{s.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {searchProvider !== 'duckduckgo' && (
                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-2">
                    {searchProvider.toUpperCase()} Search API Key
                  </label>
                  <input
                    type="password"
                    value={searchApiKey}
                    onChange={(e) => setSearchApiKey(e.target.value)}
                    placeholder={`Enter ${searchProvider.toUpperCase()} API Key...`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. BROWSER TAB */}
          {activeTab === 'browser' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Crawl Depth ({depth})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Parallel Crawlers ({parallelCrawlers})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={parallelCrawlers}
                    onChange={(e) => setParallelCrawlers(parseInt(e.target.value) || 4)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Max Pages Per Query ({maxPages})
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={maxPages}
                    onChange={(e) => setMaxPages(parseInt(e.target.value) || 8)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-1">
                    Timeout ({timeoutMs / 1000}s)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={timeoutMs}
                    onChange={(e) => setTimeoutMs(parseInt(e.target.value) || 10000)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. RITUAL TAB */}
          {activeTab === 'ritual' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-sm text-slate-100">Auto Publish Proof to RitualNet</div>
                  <div className="text-xs text-slate-400">Automatically broadcast cryptographic commitments to ProofRegistry smart contract</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="w-5 h-5 accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 block mb-2">
                  Verification Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setVerificationLevel('standard')}
                    className={`p-3.5 rounded-xl border cursor-pointer ${
                      verificationLevel === 'standard'
                        ? 'bg-purple-950/80 border-purple-500'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">Standard (Prompt + Output + Sources)</div>
                    <div className="text-[11px] text-slate-400 mt-1">Hashes commitments of inputs, retrieved sources, and answers</div>
                  </div>

                  <div
                    onClick={() => setVerificationLevel('strict')}
                    className={`p-3.5 rounded-xl border cursor-pointer ${
                      verificationLevel === 'strict'
                        ? 'bg-purple-950/80 border-purple-500'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">Strict (Full Pipeline Trace)</div>
                    <div className="text-[11px] text-slate-400 mt-1">Includes step-by-step state hashes and execution logs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
