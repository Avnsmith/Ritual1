'use client';

import React from 'react';
import { SourceCitation } from '@wowweb/shared';
import { ExternalLink, ShieldCheck, Globe, Clock, Hash } from 'lucide-react';

interface SourcePanelProps {
  sources: SourceCitation[];
}

export function SourcePanel({ sources }: SourcePanelProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent" /> Visited Web Sources ({sources.length})
        </h3>
        <span className="px-2 py-0.5 rounded bg-ritual/10 border border-ritual/30 text-ritual font-mono text-[10px]">
          Verified Crawl
        </span>
      </div>

      <div className="space-y-3">
        {sources.map((src, idx) => {
          let domain = 'web';
          try {
            domain = new URL(src.url).hostname;
          } catch {
            // Fallback
          }

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface border border-border hover:border-accent/50 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-elevated border border-border text-[10px] font-mono text-accent flex items-center justify-center shrink-0 font-bold">
                    [{idx + 1}]
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-zinc-200 group-hover:text-accent truncate hover:underline flex items-center gap-1"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {src.snippet}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-zinc-500 border-t border-border/50">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Globe className="w-3 h-3 text-zinc-500" /> {domain}
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <Hash className="w-3 h-3" /> {src.contentHash ? src.contentHash.slice(0, 10) : '0x...'}...
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" /> {new Date(src.fetchedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
