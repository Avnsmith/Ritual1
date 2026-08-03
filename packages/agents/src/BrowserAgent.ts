import axios from 'axios';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { SourceCitation, hashString } from '@wowweb/shared';

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
          'User-Agent': 'WowWeb-Autonomous-Browser-Agent/1.0 (RitualNet Verifiable Agent)',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      $('script, style, iframe, nav, footer, ads').remove();

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
    const mockWebResults: SourceCitation[] = [
      {
        title: 'Ritual Chain Developer Documentation',
        url: 'https://docs.ritualfoundation.org',
        snippet: 'Developer documentation for Ritual Chain: precompiles (0x0801, 0x0802, 0x0805, 0x0820), autonomous agents, chain architecture, and Symphony consensus.',
        contentHash: hashString('Ritual Chain Developer Documentation 0x0802 0x0820'),
        fetchedAt: Date.now(),
      },
      {
        title: 'Ritual dApp Skills & Agent Protocols',
        url: 'https://skills.ritualfoundation.org',
        snippet: 'Agent skills and behavioral protocols for building dApps on Ritual Chain with automated verification, precompiles ABI, and smart contract callers.',
        contentHash: hashString('Ritual dApp Skills & Agent Protocols'),
        fetchedAt: Date.now(),
      },
      {
        title: 'Ritual Explorer - Chain ID 1979',
        url: 'https://explorer.ritualfoundation.org',
        snippet: 'Official block explorer for RitualNet (Chain ID 1979). View contracts, system precompiles, and verified execution proof transactions.',
        contentHash: hashString('Ritual Explorer Chain ID 1979'),
        fetchedAt: Date.now(),
      },
    ];

    if (query.toLowerCase().includes('agent') || query.toLowerCase().includes('browser')) {
      mockWebResults.push({
        title: 'WowWeb AI Browser Agent Specs',
        url: 'https://github.com/ritual-foundation/wowweb',
        snippet: 'Production-ready AI Browser Agent running on RitualNet. Stores cryptographic proof commitments on-chain via WowWebProofRegistry.',
        contentHash: hashString('WowWeb AI Browser Agent Specs'),
        fetchedAt: Date.now(),
      });
    }

    return mockWebResults;
  }
}
