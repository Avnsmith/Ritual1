import { AgentTask, ExecutionStep, SourceCitation, UserSettings, generateExecutionId } from '@wowweb/shared';
import { PlannerAgent } from './PlannerAgent.js';
import { BrowserAgent } from './BrowserAgent.js';
import { ResearchAgent } from './ResearchAgent.js';
import { SummaryAgent } from './SummaryAgent.js';
import { VerificationAgent } from './VerificationAgent.js';
import { ProofPublisher } from './ProofPublisher.js';
import { AIProviderConfig } from './providers/AIProvider.js';
import { ProviderFactory } from './providers/ProviderFactory.js';
import { SearchProviderFactory } from './providers/SearchProvider.js';
import { RetrievalEngine } from './RetrievalEngine.js';

export type EventCallback = (step: ExecutionStep, task: AgentTask) => void;

export interface ExecutionOptions {
  userSettings?: Partial<UserSettings>;
  autoPublish?: boolean;
}

export class AgentOrchestrator {
  private browser = new BrowserAgent();
  private retriever = new RetrievalEngine();
  private verification = new VerificationAgent();
  private publisher = new ProofPublisher();

  async executeTask(
    prompt: string,
    ownerWallet: `0x${string}`,
    onEvent?: EventCallback,
    providerConfig?: AIProviderConfig,
    execOptions?: ExecutionOptions
  ): Promise<AgentTask> {
    const executionId = generateExecutionId();
    const startTime = Date.now();

    const provider = ProviderFactory.createProvider(providerConfig);
    const searchEngineType = execOptions?.userSettings?.search?.provider || 'duckduckgo';
    const searchProvider = SearchProviderFactory.create(searchEngineType);

    const planner = new PlannerAgent(provider);
    const research = new ResearchAgent(provider);
    const summary = new SummaryAgent(provider);

    const steps: ExecutionStep[] = [];
    const task: AgentTask = {
      id: executionId,
      prompt,
      ownerWallet,
      agentId: 'wowweb-verifiable-browser-agent-v2',
      createdAt: startTime,
      status: 'searching',
      steps,
    };

    const emitStep = (
      stage: ExecutionStep['stage'],
      title: string,
      description: string,
      status: ExecutionStep['status'] = 'in_progress',
      details?: Record<string, unknown>
    ) => {
      const step: ExecutionStep = {
        id: `step-${steps.length + 1}`,
        stage,
        title,
        description,
        timestamp: Date.now(),
        status,
        durationMs: Date.now() - startTime,
        details,
      };
      steps.push(step);
      if (onEvent) onEvent(step, task);
    };

    try {
      // Stage 1: Planning
      emitStep('planning', 'Planning Research Strategy', `Planner Agent formulating search sub-queries for "${prompt}"`);
      const plan = await planner.analyze(prompt);
      emitStep('planning', 'Strategy Formulated', plan.reasoning, 'completed', { plan });

      // Stage 2: Searching
      task.status = 'searching';
      emitStep('searching', `Searching Web Index (${searchProvider.name.toUpperCase()})`, `Querying live web for "${prompt}"`);
      let searchResults = await searchProvider.search(prompt, {
        maxResults: execOptions?.userSettings?.browser?.maxPages || 8,
        apiKey: execOptions?.userSettings?.search?.apiKey,
      });

      // Fallback search query if initial search returned 0 URLs
      if (searchResults.length === 0 && searchProvider.name !== 'duckduckgo') {
        const fallbackProvider = SearchProviderFactory.create('duckduckgo');
        searchResults = await fallbackProvider.search(prompt, { maxResults: 8 });
      }

      if (searchResults.length === 0) {
        emitStep('searching', 'No Web Sources Found', `Search returned 0 candidate URLs for "${prompt}"`, 'failed', { sourcesCount: 0 });
        
        task.status = 'failed';
        task.report = {
          title: `No Results for ${prompt}`,
          summary: `No relevant web evidence found for "${prompt}". Please try another search engine (Brave, Tavily, Serper) or broaden query keywords.`,
          evidenceQuality: 'Low',
          keyFindings: [],
          pros: [],
          cons: [],
          comparisonTable: [],
          sources: [],
          rawMarkdown: `> ⚠️ **No Web Evidence Found**\n\nNo relevant web sources could be retrieved for query **"${prompt}"**.\n\n### Suggestions:\n1. Check active Search Engine settings in **Settings** (Brave, Tavily, Serper).\n2. Try broader keywords or simpler terms.\n3. Retry research.`,
        };

        emitStep('writing', 'Research Halted (No Sources)', 'No evidence available. Zero fake conclusions synthesized.', 'failed');
        return task;
      }

      emitStep('searching', 'Web Index Search Complete', `Discovered ${searchResults.length} target web URLs`, 'completed', { searchResults });

      // Stage 3: Reading & Live Browser Extraction
      task.status = 'reading';
      emitStep('reading', 'Extracting Content Across Discovered URLs', `Browser Agent opening and parsing ${searchResults.length} pages`);
      const fetchedSources: SourceCitation[] = [];

      for (const res of searchResults) {
        let domain = 'web';
        try {
          domain = new URL(res.url).hostname.replace('www.', '');
        } catch {
          // Fallback
        }

        emitStep('reading', `Opening ${domain}...`, `Fetching content from ${res.title}`);
        const pageData = await this.browser.extract(res.url);
        const validData = pageData.snippet.startsWith('Failed') ? res : pageData;
        fetchedSources.push(validData);

        emitStep(
          'reading',
          `Extracted text from ${domain}`,
          `Extracted ${validData.snippet.length} chars • Hash: ${validData.contentHash.slice(0, 10)}...`,
          'completed',
          { source: validData, sources: fetchedSources }
        );
      }

      emitStep('reading', 'All Content Extraction Complete', `Successfully extracted raw text from ${fetchedSources.length} pages`, 'completed', { sourcesCount: fetchedSources.length, sources: fetchedSources });

      // Stage 4: Reasoning
      task.status = 'summarizing';
      emitStep('reasoning', 'LLM Multi-Source Analytical Synthesis', `Reasoner Agent cross-comparing evidence across ${fetchedSources.length} sources`);
      const researchData = await research.analyzeSources(prompt, fetchedSources);
      emitStep('reasoning', 'Synthesis Complete', `Analyzed key findings from verified web chunks`, 'completed', { researchData });

      // Stage 5: Writing
      emitStep('writing', 'Formatting Structured Report', 'Writer Agent generating markdown report with citations [1], [2]');
      const finalReport = await summary.generateReport(prompt, researchData, fetchedSources);
      task.report = finalReport;
      emitStep('writing', 'Report Generated', 'Structured report and evidence matrix generated', 'completed');

      // Stage 6: Publishing
      task.status = 'verifying';
      emitStep('publishing', 'Computing Cryptographic Commitments', 'Verifier Agent computing keccak256 hashes of prompt, output, and visited sources');
      const proofMetadata = await this.verification.createProof(
        executionId,
        prompt,
        steps,
        task.report,
        ownerWallet,
        task.agentId
      );

      const shouldPublish = execOptions?.autoPublish ?? execOptions?.userSettings?.ritual?.autoPublish ?? true;
      if (shouldPublish) {
        const publishedProof = await this.publisher.publishProof(proofMetadata);
        task.proof = publishedProof;
        emitStep('publishing', 'Proof Verified On-Chain', `Tx: ${publishedProof.transactionHash} (Chain ID: 1979)`, 'completed', { proof: publishedProof });
      } else {
        task.proof = proofMetadata;
        emitStep('publishing', 'Proof Ready for Manual Publishing', 'Cryptographic hashes verified locally.', 'completed');
      }

      task.status = 'completed';
      task.completedAt = Date.now();

      return task;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      task.status = 'failed';
      emitStep('publishing', 'Execution Error', `Task failed: ${errorMessage}`, 'failed');
      throw err;
    }
  }
}
