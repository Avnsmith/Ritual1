export interface RitualSource {
  title: string;
  url: string;
  category: 'docs' | 'github' | 'explorer' | 'skills' | 'blog';
  priority: number; // 1 = highest
  snippet: string;
}

export class RitualKnowledgeLayer {
  private static SOURCES: RitualSource[] = [
    {
      title: 'Ritual Chain Official Documentation',
      url: 'https://docs.ritualfoundation.org',
      category: 'docs',
      priority: 1,
      snippet: 'Official developer documentation for Ritual Chain: enshrined AI precompiles (0x0801 HTTP, 0x0802 LLM Inference, 0x0805, 0x0820 Stateful Agents), Symphony consensus, and EVM architecture (Chain ID: 1979).',
    },
    {
      title: 'Ritual Foundation GitHub Repositories',
      url: 'https://github.com/ritual-foundation',
      category: 'github',
      priority: 2,
      snippet: 'Open-source code repositories for Ritual foundation, node architecture, system contracts, WowWeb proof registry, and SDK packages.',
    },
    {
      title: 'Ritual Explorer - Block Explorer & Contracts',
      url: 'https://explorer.ritualfoundation.org',
      category: 'explorer',
      priority: 3,
      snippet: 'Official block explorer for RitualNet (Chain ID 1979). Inspect system precompiles, WowWebProofRegistry (0x23cc1998562c39474623639c18c31d49abd0c310), and verified proof transactions.',
    },
    {
      title: 'Ritual dApp Skills & Precompiles Specification',
      url: 'https://skills.ritualfoundation.org',
      category: 'skills',
      priority: 4,
      snippet: 'Agent behavioral protocols, ABI definitions for 0x0801 (HTTP), 0x0802 (LLM), 0x0820 (Stateful Agent), and SecretsAccessControl encryption.',
    },
  ];

  static getPrioritySources(query: string): RitualSource[] {
    const lower = query.toLowerCase();
    return this.SOURCES.map(source => {
      let boost = 0;
      if (lower.includes('doc') || lower.includes('precompile')) boost += 2;
      if (lower.includes('github') || lower.includes('code')) boost += 2;
      if (lower.includes('explorer') || lower.includes('proof')) boost += 2;

      return {
        ...source,
        priority: Math.max(1, source.priority - boost),
      };
    }).sort((a, b) => a.priority - b.priority);
  }
}
