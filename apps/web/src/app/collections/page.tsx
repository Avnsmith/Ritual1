'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Collection } from '@wowweb/shared';
import { Folder, Search, Plus, MoreHorizontal, Trash2, Copy, Edit2 } from 'lucide-react';

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredCollections = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDuplicate = (col: Collection) => {
    const newCol: Collection = {
      ...col,
      id: `col-${Date.now()}`,
      name: `${col.name} (Copy)`,
      createdAt: Date.now(),
    };
    setCollections((prev) => [newCol, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      <Sidebar />

      <main className="flex-1 max-w-[950px] mx-auto p-8 space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📁</span> Knowledge Base &amp; Collections
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Organize, search, and manage research sessions into persistent topic collections.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono w-64"
            />
          </div>
        </div>

        {/* Collections Database Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-600/60 transition-all space-y-4 shadow-lg group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 rounded-xl bg-purple-950 border border-purple-800/60">
                    {col.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{col.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(col);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Duplicate Collection"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(col.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-800/60">
                <span>{col.taskIds?.length || 0} Saved Sessions</span>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Open Database</span> &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
