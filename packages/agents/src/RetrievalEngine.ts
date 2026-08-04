import { SourceCitation } from '@wowweb/shared';

export interface RankedChunk {
  sourceTitle: string;
  url: string;
  text: string;
  score: number;
  category?: string;
}

export class RetrievalEngine {
  chunkText(text: string, chunkSize: number = 400): string[] {
    if (!text) return [];
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current: string[] = [];

    for (const word of words) {
      current.push(word);
      if (current.join(' ').length >= chunkSize) {
        chunks.push(current.join(' '));
        current = current.slice(Math.floor(current.length / 3)); // 30% overlap
      }
    }

    if (current.length > 0) {
      chunks.push(current.join(' '));
    }

    return chunks;
  }

  rankChunks(query: string, sources: SourceCitation[], topK: number = 10): RankedChunk[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const chunks: RankedChunk[] = [];

    for (const source of sources) {
      const isOfficial = source.url.includes('ritual') || source.category === 'docs' || source.category === 'github';
      const categoryBoost = isOfficial ? 1.4 : 1.0;

      const rawChunks = this.chunkText(source.snippet, 350);
      for (const chunkText of rawChunks) {
        let matches = 0;
        const lowerChunk = chunkText.toLowerCase();

        for (const term of queryTerms) {
          if (lowerChunk.includes(term)) matches += 1;
        }

        const score = (matches * 12 + (isOfficial ? 10 : 5)) * categoryBoost;

        chunks.push({
          sourceTitle: source.title,
          url: source.url,
          text: chunkText,
          score,
          category: source.category,
        });
      }
    }

    return chunks.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}
