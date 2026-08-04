import axios from 'axios';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { SourceCitation, SourceCategory, hashString } from '@wowweb/shared';
import { SearchProviderFactory, categorizeUrl } from './providers/SearchProvider.js';

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

  async crawl(url: string): Promise<SourceCitation> {
    return this.extract(url);
  }

  async extract(url: string): Promise<SourceCitation> {
    if (!this.isAllowedUrl(url)) {
      throw new Error(`Security Violation: Access denied to invalid or restricted URL ${url}`);
    }

    const category = categorizeUrl(url);

    if (category === 'github') {
      return this.extractGithub(url);
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WowWeb-Agent/1.0',
        },
        timeout: 10000,
      });

      const contentType = String(response.headers['content-type'] || '');
      let bodyText = '';
      let rawTitle = url;

      if (contentType.includes('application/pdf') || url.endsWith('.pdf')) {
        bodyText = `[PDF Document Content] Fetched document from ${url}`;
        rawTitle = `PDF: ${url.split('/').pop() || url}`;
      } else {
        const $ = cheerio.load(response.data);
        $('script, style, iframe, nav, footer, ads, svg').remove();

        rawTitle = $('title').text().trim() || $('h1').first().text().trim() || url;
        bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      }

      const cleanSnippet = bodyText.slice(0, 600);
      const sanitizedContent = sanitizeHtml(bodyText, { allowedTags: [], allowedAttributes: {} });

      return {
        title: rawTitle,
        url,
        snippet: cleanSnippet || sanitizedContent.slice(0, 400),
        contentHash: hashString(sanitizedContent),
        fetchedAt: Date.now(),
        category,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        title: `Page Fetch Error (${url})`,
        url,
        snippet: `Failed to fetch webpage: ${errorMessage}`,
        contentHash: hashString(`error:${url}:${errorMessage}`),
        fetchedAt: Date.now(),
        category,
      };
    }
  }

  async extractGithub(url: string): Promise<SourceCitation> {
    try {
      // Transform github web URL to raw user content if possible
      let rawUrl = url;
      if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
        rawUrl = url
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const res = await axios.get(rawUrl, { timeout: 8000 });
      const rawText = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      const cleanSnippet = rawText.replace(/\s+/g, ' ').slice(0, 600);

      return {
        title: `GitHub Repository File: ${url.split('/').slice(-2).join('/')}`,
        url,
        snippet: cleanSnippet,
        contentHash: hashString(rawText),
        fetchedAt: Date.now(),
        category: 'github',
      };
    } catch {
      // Fallback to standard web crawl
      return this.fetchStandardWeb(url, 'github');
    }
  }

  private async fetchStandardWeb(url: string, category: SourceCategory): Promise<SourceCitation> {
    try {
      const response = await axios.get(url, { timeout: 8000 });
      const $ = cheerio.load(response.data);
      $('script, style, nav, footer').remove();
      const title = $('title').text().trim() || url;
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      return {
        title,
        url,
        snippet: text.slice(0, 600),
        contentHash: hashString(text),
        fetchedAt: Date.now(),
        category,
      };
    } catch (err: any) {
      return {
        title: `Error (${url})`,
        url,
        snippet: err?.message || 'Failed to fetch',
        contentHash: hashString(url),
        fetchedAt: Date.now(),
        category,
      };
    }
  }

  async fetchPage(url: string): Promise<SourceCitation> {
    return this.extract(url);
  }

  async searchWeb(query: string, engine?: any): Promise<SourceCitation[]> {
    const provider = SearchProviderFactory.create(engine);
    return provider.search(query, { maxResults: 8 });
  }

  async fetchMultiple(urls: string[]): Promise<SourceCitation[]> {
    const promises = urls.slice(0, 6).map((url) => this.extract(url));
    return Promise.all(promises);
  }
}
