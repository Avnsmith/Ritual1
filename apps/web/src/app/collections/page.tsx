'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Collection } from '@wowweb/shared';
import { Folder, Sparkles } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([
    { id: 'col-ai', name: 'AI & Autonomous Agents', description: 'Agent architectures, LLMs & browser automation', icon: '🤖', createdAt: Date.now(), taskIds: [] },
    { id: 'col-blockchain', name: 'Blockchain & Layer-1s', description: 'Consensus models, smart contracts & scaling', icon: '⛓️', createdAt: Date.now(), taskIds: [] },
    { id: 'col-zk', name: 'ZK & Cryptography', description: 'Zero-knowledge proofs, FHE & verification', icon: '🔐', createdAt: Date.now(), taskIds: [] },
    { id: 'col-ritual', name: 'Ritual Ecosystem', description: 'RitualNet, Infernet & precompiles', icon: '🔮', createdAt: Date.now(), taskIds: [] },
  ]);

  useEffect(() => {
    fetch('/api/agent/collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.collections && data.collections.length > 0) {
          setCollections(data.collections);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <main className="flex-1 max-w-5xl mx-auto p-8 space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📁</span> Research Collections
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize research sessions into persistent topic collections for AI context recall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-600/60 transition-all space-y-3 shadow-lg group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-purple-950 border border-purple-800/60">
                    {col.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{col.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-800/60">
                <span>{col.taskIds?.length || 0} Research Sessions</span>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Explore</span> &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
