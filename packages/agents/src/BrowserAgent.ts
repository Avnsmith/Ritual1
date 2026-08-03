import axios from 'axios';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { SourceCitation, hashString } from '@wowweb/shared';
import { RitualKnowledgeLayer } from './RitualKnowledgeLayer.js';

export class BrowserAgent {
  private isAllowedUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
        return false;
      }
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  async fetchPage(url: string): Promise<SourceCitation> {
    if (!this.isAllowedUrl(url)) {
      throw new Error(`Security Violation: Access denied to invalid or restricted URL ${url}`);
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WowWeb-Agent/1.0',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      $('script, style, iframe, nav, footer, ads, svg').remove();

      const rawTitle = $('title').text().trim() || url;
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      const cleanSnippet = bodyText.slice(0, 500);

      const sanitizedContent = sanitizeHtml(bodyText, {
        allowedTags: [],
        allowedAttributes: {},
      });

      return {
        title: rawTitle,
        url,
        snippet: cleanSnippet || sanitizedContent.slice(0, 300),
        contentHash: hashString(sanitizedContent),
        fetchedAt: Date.now(),
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        title: `Page Fetch Error (${url})`,
        url,
        snippet: `Failed to fetch webpage: ${errorMessage}`,
        contentHash: hashString(`error:${url}:${errorMessage}`),
        fetchedAt: Date.now(),
      };
    }
  }

  async searchWeb(query: string): Promise<SourceCitation[]> {
    const results: SourceCitation[] = [];

    // 1. Priority Ritual Knowledge Sources
    const ritualSources = RitualKnowledgeLayer.getPrioritySources(query);
    for (const rSource of ritualSources) {
      results.push({
        title: rSource.title,
        url: rSource.url,
        snippet: rSource.snippet,
        contentHash: hashString(`${rSource.title}:${rSource.url}:${rSource.snippet}`),
        fetchedAt: Date.now(),
      });
    }

    // 2. Real Live Web Search via DuckDuckGo HTML Interface
    try {
      const response = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 8000,
      });

      const $ = cheerio.load(response.data);
      $('.result').each((i, element) => {
        if (results.length >= 7) return;

        const titleEl = $(element).find('.result__title a');
        const snippetEl = $(element).find('.result__snippet');
        
        let title = titleEl.text().trim();
        let rawUrl = titleEl.attr('href') || '';

        if (rawUrl.includes('uddg=')) {
          const match = rawUrl.match(/uddg=([^&]+)/);
          if (match && match[1]) {
            rawUrl = decodeURIComponent(match[1]);
          }
        }

        const snippet = snippetEl.text().trim();

        if (title && rawUrl.startsWith('http') && this.isAllowedUrl(rawUrl)) {
          results.push({
            title,
            url: rawUrl,
            snippet: snippet || `Web search result for ${query}`,
            contentHash: hashString(`${title}:${rawUrl}:${snippet}`),
            fetchedAt: Date.now(),
          });
        }
      });
    } catch {
      // Fallback
    }

    return results;
  }
}
