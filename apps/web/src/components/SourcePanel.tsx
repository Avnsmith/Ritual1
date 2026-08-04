'use client';

import React, { useState } from 'react';
import { SourceCitation } from '@wowweb/shared';
import { ExternalLink, Globe, Hash, Clock, X, Code, BookOpen, FileText, Newspaper, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SourcePanelProps {
  sources: SourceCitation[];
}

export function SourcePanel({ sources }: SourcePanelProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [activePreview, setActivePreview] = useState<SourceCitation | null>(null);

  if (!sources || sources.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs font-mono">
        Waiting for Browser Agent to discover and crawl web pages...
      </div>
    );
  }

  const groups = [
    { key: 'all', label: 'All Visited', icon: Globe },
    { key: 'official', label: 'Official Docs', icon: ShieldCheck },
    { key: 'github', label: 'GitHub Repos', icon: Code },
    { key: 'tech', label: 'Technical Docs', icon: BookOpen },
    { key: 'academic', label: 'Academic', icon: FileText },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'community', label: 'Community', icon: MessageSquare },
  ];

  const mapToGroup = (src: SourceCitation): string => {
    const url = src.url.toLowerCase();
    if (url.includes('ritual') || url.includes('official') || url.includes('foundation')) return 'official';
    if (url.includes('github.com')) return 'github';
    if (url.includes('docs') || url.includes('gitbook') || url.includes('readme')) return 'tech';
    if (url.includes('arxiv.org') || url.includes('paper') || url.includes('pdf')) return 'academic';
    if (url.includes('medium.com') || url.includes('substack.com') || url.includes('news')) return 'news';
    if (url.includes('twitter.com') || url.includes('x.com') || url.includes('reddit')) return 'community';
    return 'tech';
  };

  const filteredSources = selectedGroup === 'all'
    ? sources
    : sources.filter((s) => mapToGroup(s) === selectedGroup);

  return (
    <div className="space-y-4 select-none font-sans">
      {/* Visited Browser History Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
          <span>Visited Browser History</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] border border-purple-800/60">
            {sources.length} Pages Opened
          </span>
        </h3>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        {groups.map((grp) => {
          const Icon = grp.icon;
          const isActive = selectedGroup === grp.key;
          return (
            <button
              key={grp.key}
              onClick={() => setSelectedGroup(grp.key)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-700 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3 h-3 text-purple-400" />
              <span>{grp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Visited Source Cards List */}
      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
        {filteredSources.map((src, idx) => {
          let domain = 'web';
          try {
            domain = new URL(src.url).hostname.replace('www.', '');
          } catch {
            // Fallback
          }

          const charLength = src.snippet ? src.snippet.length : 0;

          return (
            <div
              key={idx}
              onClick={() => setActivePreview(src)}
              className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-purple-600/60 transition-all cursor-pointer space-y-2 group shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono flex items-center justify-center shrink-0 font-bold">
                    ✓
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
                <span className="text-purple-400">
                  {charLength} chars extracted
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-800/80 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono uppercase">
                  Crawled Page Preview
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
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Visited URL</label>
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
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Extracted Text Content ({activePreview.snippet?.length || 0} chars)</label>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-sans leading-relaxed max-h-52 overflow-y-auto">
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
                <span>Open Original Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
