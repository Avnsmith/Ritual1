import { AgentTask, ExecutionStep, SourceCitation, generateExecutionId } from '@wowweb/shared';
import { PlannerAgent } from './PlannerAgent.js';
import { BrowserAgent } from './BrowserAgent.js';
import { ResearchAgent } from './ResearchAgent.js';
import { SummaryAgent } from './SummaryAgent.js';
import { VerificationAgent } from './VerificationAgent.js';
import { ProofPublisher } from './ProofPublisher.js';

export type EventCallback = (step: ExecutionStep, task: AgentTask) => void;

export class AgentOrchestrator {
  private planner = new PlannerAgent();
  private browser = new BrowserAgent();
  private research = new ResearchAgent();
  private summary = new SummaryAgent();
  private verification = new VerificationAgent();
  private publisher = new ProofPublisher();

  async executeTask(
    prompt: string,
    ownerWallet: `0x${string}`,
    onEvent?: EventCallback
  ): Promise<AgentTask> {
    const executionId = generateExecutionId();
    const startTime = Date.now();

    const steps: ExecutionStep[] = [];
    const task: AgentTask = {
      id: executionId,
      prompt,
      ownerWallet,
      agentId: 'wowweb-browser-agent-v1',
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
      // 1. Planner Agent
      emitStep('planner', 'Deconstructing Request', 'Planner Agent analyzing prompt and designing web research strategy');
      const planTasks = await this.planner.createPlan(prompt);
      emitStep('planner', 'Research Plan Created', `Planned ${planTasks.length} search sub-tasks`, 'completed', { planTasks });

      // 2. Browser Agent
      task.status = 'searching';
      emitStep('browser', 'Searching Web Infrastructure', `Querying web indexes for "${prompt}"`);
      const searchResults = await this.browser.searchWeb(prompt);

      task.status = 'reading';
      emitStep('browser', 'Extracting Web Pages & Docs', `Fetching and parsing ${searchResults.length} source pages`);

      const fetchedSources: SourceCitation[] = [];
      for (const res of searchResults) {
        emitStep('browser', 'Parsing Page Content', `Inspecting ${res.title} (${res.url})`);
        const pageData = await this.browser.fetchPage(res.url);
        fetchedSources.push(pageData.snippet.startsWith('Failed') ? res : pageData);
      }
      emitStep('browser', 'Web Crawling Completed', `Successfully extracted content from ${fetchedSources.length} pages`, 'completed', { sourcesCount: fetchedSources.length });

      // 3. Research Agent
      task.status = 'summarizing';
      emitStep('research', 'Synthesizing Findings', 'Research Agent extracting key insights, pros/cons, and comparison matrix');
      const researchData = await this.research.analyzeSources(prompt, fetchedSources);
      emitStep('research', 'Synthesis Complete', `Confidence score evaluated at ${researchData.confidenceScore}%`, 'completed');

      // 4. Summary Agent
      emitStep('summary', 'Formatting Structured Report', 'Summary Agent generating executive markdown report and citation table');
      const finalReport = await this.summary.generateReport(prompt, researchData, fetchedSources);
      task.report = finalReport;
      emitStep('summary', 'Report Formatted', 'Markdown & citation matrix generated successfully', 'completed');

      // 5. Verification Agent
      task.status = 'verifying';
      emitStep('verification', 'Generating Cryptographic Proof', 'Computing keccak256 hashes of prompt, output, and visited sources');
      const proofMetadata = await this.verification.createProof(
        executionId,
        prompt,
        steps,
        finalReport,
        ownerWallet,
        task.agentId
      );
      emitStep('verification', 'Proof Hashes Computed', `PromptHash: ${proofMetadata.promptHash.slice(0, 10)}... OutputHash: ${proofMetadata.outputHash.slice(0, 10)}...`, 'completed');

      // 6. Proof Publisher
      emitStep('proof', 'Publishing Proof to RitualNet', 'Submitting transaction to WowWebProofRegistry (Chain ID: 1979)');
      const publishedProof = await this.publisher.publishProof(proofMetadata);
      task.proof = publishedProof;
      task.status = 'completed';
      task.completedAt = Date.now();

      emitStep('proof', 'Proof Anchored on RitualNet', `TxHash: ${publishedProof.transactionHash} (Chain ID: 1979)`, 'completed', { proof: publishedProof });

      return task;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      task.status = 'failed';
      emitStep('proof', 'Execution Error', `Task failed: ${errorMessage}`, 'failed');
      throw err;
    }
  }
}
