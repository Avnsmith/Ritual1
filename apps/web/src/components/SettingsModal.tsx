'use client';

import React, { useState, useEffect } from 'react';
import { X, Sliders, Key, Cpu, ShieldCheck, Check, Sparkles } from 'lucide-react';
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
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-border shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Provider Settings <Sparkles className="w-4 h-4 text-accent" />
            </h3>
            <p className="text-xs text-zinc-400">Configure LLM Provider, API Key, and Model Parameters</p>
          </div>
        </div>

        {/* Provider Selection Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400">Select AI Provider</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'openai', label: 'OpenAI' },
              { id: 'gemini', label: 'Gemini' },
              { id: 'anthropic', label: 'Anthropic' },
              { id: 'groq', label: 'Groq' },
              { id: 'openrouter', label: 'OpenRouter' },
              { id: 'ollama', label: 'Ollama' },
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  provider === p.id
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-surface border-border text-zinc-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key Field */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-accent" /> API Key</span>
            <span className="text-[10px] text-zinc-500">Stored locally in browser only</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={provider === 'ollama' ? 'Not required for local Ollama' : `Enter your ${provider.toUpperCase()} API Key (sk-...)`}
            className="w-full px-4 py-3 rounded-xl bg-elevated border border-border text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-mono"
          />
        </div>

        {/* Model Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Target Model
            </label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g. gpt-4o-mini"
              className="w-full px-3 py-2.5 rounded-xl bg-elevated border border-border text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>Temperature</span>
              <span className="text-accent">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-2.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-ritual shrink-0 mt-0.5" />
          <span>
            API Keys are stored strictly in your browser&apos;s <code className="text-zinc-200">localStorage</code>. They are never saved on servers or tracked in commits.
          </span>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>
    </div>
  );
}
