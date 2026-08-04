'use client';

import React, { useState } from 'react';
import { SourceCitation, SourceCategory } from '@wowweb/shared';
import { ExternalLink, Globe, Hash, Clock, X } from 'lucide-react';

interface SourcePanelProps {
  sources: SourceCitation[];
}

export function SourcePanel({ sources }: SourcePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreview, setActivePreview] = useState<SourceCitation | null>(null);

  if (!sources || sources.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs">
        No sources crawled yet.
      </div>
    );
  }

  const categories: { label: string; key: string }[] = [
    { label: 'All', key: 'all' },
    { label: 'Github', key: 'github' },
    { label: 'Medium', key: 'medium' },
    { label: 'Docs', key: 'docs' },
    { label: 'Whitepaper', key: 'whitepaper' },
    { label: 'Twitter', key: 'twitter' },
    { label: 'Arxiv', key: 'arxiv' },
  ];

  const filteredSources = selectedCategory === 'all'
    ? sources
    : sources.filter((s) => s.category === selectedCategory || (selectedCategory === 'docs' && s.url.includes('docs')));

  return (
    <div className="space-y-4 select-none">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          <span>Sources & Citations</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] border border-purple-800/60">
            {sources.length}
          </span>
        </h3>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-700 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Source Cards List */}
      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
        {filteredSources.map((src, idx) => {
          let domain = 'web';
          try {
            domain = new URL(src.url).hostname.replace('www.', '');
          } catch {
            // Fallback
          }

          return (
            <div
              key={idx}
              onClick={() => setActivePreview(src)}
              className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-purple-600/60 transition-all cursor-pointer space-y-2 group shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono flex items-center justify-center shrink-0 font-bold">
                    [{idx + 1}]
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                    {src.title}
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {src.snippet}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                <span className="flex items-center gap-1 text-slate-400">
                  <Globe className="w-3 h-3 text-slate-500" /> {domain}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-purple-400 uppercase text-[9px]">
                  {src.category || 'web'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-800/80 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono uppercase">
                  {activePreview.category || 'Source Preview'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{activePreview.title}</h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Target URL</label>
                <a
                  href={activePreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:underline flex items-center gap-1 break-all"
                >
                  <span>{activePreview.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Extracted Snippet</label>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-sans leading-relaxed max-h-48 overflow-y-auto">
                  {activePreview.snippet}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">KECCAK256 HASH</span>
                  <span className="text-purple-300 truncate block">{activePreview.contentHash}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">FETCH TIMESTAMP</span>
                  <span className="text-slate-300 block">{new Date(activePreview.fetchedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={activePreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 transition-all"
              >
                <span>Visit Original Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
