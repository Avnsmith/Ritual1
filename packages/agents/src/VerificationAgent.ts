import { ExecutionStep, ProofMetadata, ResearchReport, hashArray, hashString } from '@wowweb/shared';

export class VerificationAgent {
  async createProof(
    executionId: `0x${string}`,
    prompt: string,
    steps: ExecutionStep[],
    report: ResearchReport,
    ownerWallet: `0x${string}`,
    agentId: string = 'wowweb-browser-agent-v1'
  ): Promise<ProofMetadata> {
    const promptHash = hashString(prompt);
    
    const stepTraceStr = steps.map((s: ExecutionStep) => `${s.stage}:${s.title}:${s.status}:${s.timestamp}`).join(';');
    const executionHash = hashString(stepTraceStr);
    
    const outputHash = hashString(report.rawMarkdown);
    
    const visitedUrls = report.sources.map(s => s.url);
    const visitedUrlsHash = hashArray(visitedUrls);

    const timestamp = Math.floor(Date.now() / 1000);

    return {
      executionId,
      promptHash,
      executionHash,
      outputHash,
      visitedUrlsHash,
      agentId,
      ownerWallet,
      timestamp,
      isVerified: true,
      status: 'Verified',
    };
  }
}
