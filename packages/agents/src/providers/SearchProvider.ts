import { SourceCitation, SourceCategory, SearchEngineType } from '@wowweb/shared';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export interface SearchOptions {
  maxResults?: number;
  apiKey?: string;
}

export interface SearchProvider {
  readonly name: SearchEngineType;
  search(query: string, options?: SearchOptions): Promise<SourceCitation[]>;
}

export function categorizeUrl(url: string): SourceCategory {
  const lower = url.toLowerCase();
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('arxiv.org')) return 'academic';
  if (lower.includes('twitter.com') || lower.includes('x.com') || lower.includes('reddit.com')) return 'community';
  if (lower.includes('docs.') || lower.includes('/docs/') || lower.includes('gitbook') || lower.includes('readme.io')) return 'docs';
  if (lower.includes('pdf') || lower.includes('paper') || lower.includes('whitepaper')) return 'whitepaper';
  if (lower.includes('medium.com') || lower.includes('substack.com') || lower.includes('news')) return 'news';
  if (lower.includes('blog')) return 'blog';
  if (lower.includes('ritual')) return 'official';
  return 'general';
}

function hashUrl(url: string): string {
  return '0x' + crypto.createHash('sha256').update(url).digest('hex');
}

export class DuckDuckGoSearchProvider implements SearchProvider {
  readonly name: SearchEngineType = 'duckduckgo';

  async search(query: string, options?: SearchOptions): Promise<SourceCitation[]> {
    const limit = options?.maxResults || 8;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`DuckDuckGo HTTP status ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const results: SourceCitation[] = [];

      $('.result').each((i, el) => {
        if (results.length >= limit) return false;
        const titleEl = $(el).find('.result__title a');
        const snippetEl = $(el).find('.result__snippet');
        
        let href = titleEl.attr('href') || '';
        if (href.startsWith('//duckduckgo.com/l/?uddg=')) {
          const match = href.match(/uddg=([^&]+)/);
          if (match) {
            href = decodeURIComponent(match[1]);
          }
        }

        const title = titleEl.text().trim();
        const snippet = snippetEl.text().trim();

        if (title && href && href.startsWith('http')) {
          results.push({
            title,
            url: href,
            snippet: snippet || title,
            contentHash: hashUrl(href),
            fetchedAt: Date.now(),
            category: categorizeUrl(href),
          });
        }
      });

      return results;
    } catch (err) {
      console.warn('DuckDuckGo search error:', err);
      return [];
    }
  }
}

export class BraveSearchProvider implements SearchProvider {
  readonly name: SearchEngineType = 'brave';

  async search(query: string, options?: SearchOptions): Promise<SourceCitation[]> {
    const apiKey = options?.apiKey || process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey) {
      console.warn('Brave API Key not provided, falling back to DuckDuckGo');
      return new DuckDuckGoSearchProvider().search(query, options);
    }

    try {
      const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${options?.maxResults || 8}`, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
      });
      if (!res.ok) throw new Error(`Brave Search status ${res.status}`);
      const data = await res.json();
      const results: SourceCitation[] = (data.web?.results || []).map((r: any) => ({
        title: r.title,
        url: r.url,
        snippet: r.description || r.title,
        contentHash: hashUrl(r.url),
        fetchedAt: Date.now(),
        category: categorizeUrl(r.url),
      }));
      return results;
    } catch (e) {
      console.warn('Brave Search failed, falling back:', e);
      return new DuckDuckGoSearchProvider().search(query, options);
    }
  }
}

export class TavilySearchProvider implements SearchProvider {
  readonly name: SearchEngineType = 'tavily';

  async search(query: string, options?: SearchOptions): Promise<SourceCitation[]> {
    const apiKey = options?.apiKey || process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn('Tavily API Key not provided, falling back to DuckDuckGo');
      return new DuckDuckGoSearchProvider().search(query, options);
    }

    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, query, max_results: options?.maxResults || 8 }),
      });
      if (!res.ok) throw new Error(`Tavily status ${res.status}`);
      const data = await res.json();
      return (data.results || []).map((r: any) => ({
        title: r.title,
        url: r.url,
        snippet: r.content || r.title,
        contentHash: hashUrl(r.url),
        fetchedAt: Date.now(),
        category: categorizeUrl(r.url),
      }));
    } catch (e) {
      console.warn('Tavily Search failed, falling back:', e);
      return new DuckDuckGoSearchProvider().search(query, options);
    }
  }
}

export class SerperSearchProvider implements SearchProvider {
  readonly name: SearchEngineType = 'serper';

  async search(query: string, options?: SearchOptions): Promise<SourceCitation[]> {
    const apiKey = options?.apiKey || process.env.SERPER_API_KEY;
    if (!apiKey) {
      console.warn('Serper API Key not provided, falling back to DuckDuckGo');
      return new DuckDuckGoSearchProvider().search(query, options);
    }

    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, num: options?.maxResults || 8 }),
      });
      if (!res.ok) throw new Error(`Serper status ${res.status}`);
      const data = await res.json();
      return (data.organic || []).map((r: any) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet || r.title,
        contentHash: hashUrl(r.link),
        fetchedAt: Date.now(),
        category: categorizeUrl(r.link),
      }));
    } catch (e) {
      console.warn('Serper Search failed, falling back:', e);
      return new DuckDuckGoSearchProvider().search(query, options);
    }
  }
}

export class ExaSearchProvider implements SearchProvider {
  readonly name: SearchEngineType = 'exa';

  async search(query: string, options?: SearchOptions): Promise<SourceCitation[]> {
    const apiKey = options?.apiKey || process.env.EXA_API_KEY;
    if (!apiKey) {
      console.warn('Exa API Key not provided, falling back to DuckDuckGo');
      return new DuckDuckGoSearchProvider().search(query, options);
    }

    try {
      const res = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, numResults: options?.maxResults || 8 }),
      });
      if (!res.ok) throw new Error(`Exa status ${res.status}`);
      const data = await res.json();
      return (data.results || []).map((r: any) => ({
        title: r.title || r.url,
        url: r.url,
        snippet: r.text || r.title || r.url,
        contentHash: hashUrl(r.url),
        fetchedAt: Date.now(),
        category: categorizeUrl(r.url),
      }));
    } catch (e) {
      console.warn('Exa Search failed, falling back:', e);
      return new DuckDuckGoSearchProvider().search(query, options);
    }
  }
}

export class SearchProviderFactory {
  static create(providerType?: SearchEngineType): SearchProvider {
    switch (providerType) {
      case 'brave':
        return new BraveSearchProvider();
      case 'serper':
        return new SerperSearchProvider();
      case 'tavily':
        return new TavilySearchProvider();
      case 'exa':
        return new ExaSearchProvider();
      case 'duckduckgo':
      default:
        return new DuckDuckGoSearchProvider();
    }
  }
}
