'use client';

import React, { useState, useEffect } from 'react';
import { X, Sliders, Key, Cpu, ShieldCheck, Check, Sparkles, Server } from 'lucide-react';
import { AIProviderConfig } from '@wowweb/agents';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIProviderConfig;
  onSave: (newConfig: AIProviderConfig) => void;
}

export function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [provider, setProvider] = useState<AIProviderConfig['provider']>(config.provider || 'openai');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'gpt-4o-mini');
  const [temperature, setTemperature] = useState(config.temperature ?? 0.3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProvider(config.provider || 'openai');
    setApiKey(config.apiKey || '');
    setModel(config.model || 'gpt-4o-mini');
    setTemperature(config.temperature ?? 0.3);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (p: AIProviderConfig['provider']) => {
    setProvider(p);
    if (p === 'openai') setModel('gpt-4o-mini');
    else if (p === 'gemini') setModel('gemini-1.5-flash');
    else if (p === 'anthropic') setModel('claude-3-5-sonnet-20241022');
    else if (p === 'groq') setModel('llama-3.1-8b-instant');
    else if (p === 'openrouter') setModel('anthropic/claude-3.5-sonnet');
    else if (p === 'ollama') setModel('llama3');
  };

  const handleSave = () => {
    const newConfig: AIProviderConfig = {
      provider,
      apiKey: apiKey.trim(),
      model,
      temperature,
    };
    onSave(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-accent/40 shadow-2xl space-y-6 bg-zinc-950/90 text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/50 flex items-center justify-center text-accent">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Provider Settings <Sparkles className="w-4 h-4 text-accent" />
            </h3>
            <p className="text-xs text-zinc-400">Configure LLM Provider, API Keys, and Inference Parameters</p>
          </div>
        </div>

        {/* Provider Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-accent" /> Select AI Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'openai', label: 'OpenAI', desc: 'GPT-4o / GPT-4.1' },
              { id: 'gemini', label: 'Gemini', desc: 'Gemini 1.5 / 2.5' },
              { id: 'anthropic', label: 'Anthropic', desc: 'Claude 3.5 Sonnet' },
              { id: 'groq', label: 'Groq', desc: 'Llama-3.1 Instant' },
              { id: 'openrouter', label: 'OpenRouter', desc: 'Universal API' },
              { id: 'ollama', label: 'Ollama', desc: 'Local LLM' },
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id as any)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  provider === p.id
                    ? 'bg-accent/20 border-accent text-accent shadow-md shadow-accent/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[10px] text-zinc-500 truncate">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-accent" /> {provider.toUpperCase()} API Key
            </span>
            <span className="text-[10px] text-zinc-400">Stored in localStorage only</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={provider === 'ollama' ? 'Not required for local Ollama' : `Enter your ${provider.toUpperCase()} API Key (e.g. sk-...)`}
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-mono"
          />
        </div>

        {/* Model & Temperature */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Target Model
            </label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Model identifier"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center justify-between">
              <span>Temperature</span>
              <span className="text-accent font-bold">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>
        </div>

        {/* Security Guarantee */}
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-2.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-ritual shrink-0 mt-0.5" />
          <span>
            API Keys are stored exclusively in your browser&apos;s <code className="text-zinc-200 font-mono">localStorage</code>. They are never saved on remote servers or committed to repositories.
          </span>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <span>Save &amp; Apply Provider Settings</span>
          )}
        </button>
      </div>
    </div>
  );
}
