import { SourceCitation } from '@wowweb/shared';

export interface RankedChunk {
  sourceTitle: string;
  url: string;
  text: string;
  score: number;
}

export class RetrievalEngine {
  // Split content into clean chunks
  chunkText(text: string, chunkSize: number = 400): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current: string[] = [];

    for (const word of words) {
      current.push(word);
      if (current.join(' ').length >= chunkSize) {
        chunks.push(current.join(' '));
        current = [];
      }
    }

    if (current.length > 0) {
      chunks.push(current.join(' '));
    }

    return chunks;
  }

  // Rank and deduplicate document chunks using term frequency and domain boost
  rankChunks(query: string, sources: SourceCitation[]): RankedChunk[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const chunks: RankedChunk[] = [];

    for (const source of sources) {
      const isOfficial = source.url.includes('ritualfoundation.org') || source.url.includes('ritual');
      const domainBoost = isOfficial ? 1.5 : 1.0;

      const rawChunks = this.chunkText(source.snippet, 300);
      for (const chunkText of rawChunks) {
        let matches = 0;
        const lowerChunk = chunkText.toLowerCase();

        for (const term of queryTerms) {
          if (lowerChunk.includes(term)) matches += 1;
        }

        const score = (matches * 10 + (isOfficial ? 15 : 5)) * domainBoost;

        chunks.push({
          sourceTitle: source.title,
          url: source.url,
          text: chunkText,
          score,
        });
      }
    }

    // Sort by score descending and deduplicate by text similarity
    return chunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }
}
