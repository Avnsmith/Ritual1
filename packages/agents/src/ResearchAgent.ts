import { SourceCitation } from '@wowweb/shared';
import { AIProvider } from './providers/AIProvider.js';
import { ProviderFactory } from './providers/ProviderFactory.js';
import { RetrievalEngine } from './RetrievalEngine.js';

export interface SynthesizedResearch {
  evidenceQuality: 'High' | 'Medium' | 'Low';
  keyFindings: string[];
  pros: string[];
  cons: string[];
  comparisonTable: Array<{ feature: string; [key: string]: string }>;
}

export class ResearchAgent {
  private retriever = new RetrievalEngine();
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || ProviderFactory.createProvider();
  }

  async analyzeSources(prompt: string, sources: SourceCitation[]): Promise<SynthesizedResearch> {
    const validSources = sources.filter(s => s.snippet && !s.snippet.startsWith('Failed'));
    
    // STRICT RULE: If no valid web sources exist, DO NOT generate fake claims or dummy reports!
    if (validSources.length === 0) {
      throw new Error(`No web evidence found for query "${prompt}". Try another search provider (Brave, Tavily, Serper) or broaden query keywords.`);
    }

    const evidenceQuality = validSources.length >= 5 ? 'High' : validSources.length >= 2 ? 'Medium' : 'Low';
    const rankedChunks = this.retriever.rankChunks(prompt, validSources, 10);
    const chunkContext = rankedChunks.map((c, i) => `[Source ${i + 1}] ${c.sourceTitle} (${c.url}):\n${c.text}`).join('\n\n');

    try {
      const responseText = await this.provider.chat({
        messages: [
          {
            role: 'system',
            content: `You are WowWeb Autonomous Research Agent. Analyze supplied source text chunks for query "${prompt}". Synthesize a JSON object with keys: keyFindings (array of bullet points based strictly on source text), pros (array of advantages), cons (array of tradeoffs), comparisonTable (array of objects comparing feature, WowWeb (RitualNet), Standard Alternative). Output valid JSON only.`,
          },
          {
            role: 'user',
            content: `Query: "${prompt}"\n\nRanked Sources Context:\n${chunkContext}`,
          },
        ],
        temperature: 0.2,
        jsonOutput: true,
      });

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          evidenceQuality,
          keyFindings: parsed.keyFindings || validSources.map(s => `${s.title}: ${s.snippet.slice(0, 150)}...`),
          pros: parsed.pros || [],
          cons: parsed.cons || [],
          comparisonTable: parsed.comparisonTable || [],
        };
      }
    } catch (e: any) {
      if (e.message?.includes('No web evidence')) throw e;
    }

    const dynamicFindings = validSources.slice(0, 4).map((s, idx) => 
      `Source [${idx + 1}] ${s.title}: ${s.snippet.slice(0, 160)}...`
    );

    return {
      evidenceQuality,
      keyFindings: dynamicFindings,
      pros: [],
      cons: [],
      comparisonTable: [],
    };
  }
}
