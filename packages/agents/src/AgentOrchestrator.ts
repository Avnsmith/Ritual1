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
        details,
      };
      steps.push(step);
      if (onEvent) onEvent(step, task);
    };

    try {
      // Stage 1: Planner Agent
      emitStep('planner', 'Analyzing Research Strategy', `Planner Agent (${provider.name}) breaking down research intent for "${prompt}"`);
      const plan = await planner.analyze(prompt);
      emitStep('planner', 'Strategy Formulated', plan.reasoning, 'completed', { plan });

      // Stage 2: Search Agent
      task.status = 'searching';
      emitStep('search', `Querying Web Index (${searchProvider.name.toUpperCase()})`, `Searching live web for queries: "${prompt}"`);
      const searchResults = await searchProvider.search(prompt, {
        maxResults: execOptions?.userSettings?.browser?.maxPages || 8,
        apiKey: execOptions?.userSettings?.search?.apiKey,
      });
      emitStep('search', 'Search Complete', `Retrieved ${searchResults.length} candidate URLs`, 'completed', { searchResults });

      // Stage 3: Browser Agent
      task.status = 'reading';
      emitStep('browser', 'Extracting Web Pages & Repos', `Browser Agent crawling ${searchResults.length} target web pages & repositories`);
      const fetchedSources: SourceCitation[] = [];

      for (const res of searchResults) {
        emitStep('browser', `Extracting ${res.category?.toUpperCase() || 'WEB'} Content`, `Parsing content from ${res.title} (${res.url})`);
        const pageData = await this.browser.extract(res.url);
        fetchedSources.push(pageData.snippet.startsWith('Failed') ? res : pageData);
      }
      emitStep('browser', 'Extraction Complete', `Extracted raw content from ${fetchedSources.length} sources`, 'completed', { sourcesCount: fetchedSources.length, sources: fetchedSources });

      // Stage 4: Retriever Agent
      emitStep('retriever', 'Chunking & Score Reranking', 'Retriever Agent chunking documents and reranking top relevance vectors');
      const rankedChunks = this.retriever.rankChunks(prompt, fetchedSources, 10);
      emitStep('retriever', 'Context Selection Complete', `Selected top ${rankedChunks.length} high-confidence text chunks`, 'completed', { rankedCount: rankedChunks.length });

      // Stage 5: Reasoner Agent
      task.status = 'summarizing';
      emitStep('reasoner', 'Multi-Source LLM Analytical Reasoning', `Reasoner Agent (${provider.name}) synthesizing findings across retrieved context`);
      const researchData = await research.analyzeSources(prompt, fetchedSources);
      emitStep('reasoner', 'Reasoning Complete', `Computed confidence score at ${researchData.confidenceScore}%`, 'completed', { researchData });

      // Stage 6: Writer Agent
      emitStep('writer', 'Formatting Executive Report & Diagrams', 'Writer Agent building markdown answer, comparison matrices, and citations [1], [2]');
      const finalReport = await summary.generateReport(prompt, researchData, fetchedSources);
      task.report = finalReport;
      emitStep('writer', 'Executive Report Generated', 'Structured Markdown report with Mermaid architecture diagram complete', 'completed');

      // Stage 7: Verifier Agent
      task.status = 'verifying';
      emitStep('verifier', 'Computing Cryptographic Commitments', 'Verifier Agent creating keccak256 proof hashes of prompt, sources, and response');
      const proofMetadata = await this.verification.createProof(
        executionId,
        prompt,
        steps,
        task.report,
        ownerWallet,
        task.agentId
      );
      emitStep('verifier', 'Proof Hashes Computed', `PromptHash: ${proofMetadata.promptHash.slice(0, 10)}... OutputHash: ${proofMetadata.outputHash.slice(0, 10)}...`, 'completed');

      // Stage 8: Publisher Agent (RitualNet On-Chain Registration)
      const shouldPublish = execOptions?.autoPublish ?? execOptions?.userSettings?.ritual?.autoPublish ?? true;
      if (shouldPublish) {
        emitStep('publisher', 'Publishing Proof to RitualNet', 'Publisher Agent anchoring cryptographic commitment on WowWebProofRegistry');
        const publishedProof = await this.publisher.publishProof(proofMetadata);
        task.proof = publishedProof;
        emitStep('publisher', 'Proof Verified On-Chain', `Tx: ${publishedProof.transactionHash} (Chain ID: 1979)`, 'completed', { proof: publishedProof });
      } else {
        task.proof = proofMetadata;
        emitStep('publisher', 'Proof Ready for Manual Publishing', 'Cryptographic hashes verified locally. Ready for on-chain broadcast.', 'completed');
      }

      task.status = 'completed';
      task.completedAt = Date.now();

      return task;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      task.status = 'failed';
      emitStep('publisher', 'Execution Error', `Task failed: ${errorMessage}`, 'failed');
      throw err;
    }
  }
}
