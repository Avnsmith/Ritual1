export type ExecutionStatus = 'pending' | 'searching' | 'reading' | 'summarizing' | 'verifying' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  stage: 'planner' | 'browser' | 'research' | 'summary' | 'verification' | 'proof';
  title: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: Record<string, unknown>;
}

export interface SourceCitation {
  title: string;
  url: string;
  snippet: string;
  contentHash: string;
  fetchedAt: number;
}

export interface ResearchReport {
  title: string;
  summary: string;
  keyFindings: string[];
  pros: string[];
  cons: string[];
  comparisonTable: Array<{ feature: string; [key: string]: string }>;
  confidenceScore: number;
  sources: SourceCitation[];
  rawMarkdown: string;
}

export interface ProofMetadata {
  executionId: `0x${string}`;
  promptHash: `0x${string}`;
  executionHash: `0x${string}`;
  outputHash: `0x${string}`;
  visitedUrlsHash: `0x${string}`;
  agentId: string;
  ownerWallet: `0x${string}`;
  timestamp: number;
  transactionHash?: `0x${string}`;
  blockNumber?: number;
  isVerified: boolean;
  status: 'Pending' | 'Verified' | 'Failed';
  explorerUrl?: string;
}

export interface AgentTask {
  id: string;
  prompt: string;
  ownerWallet: `0x${string}`;
  agentId: string;
  createdAt: number;
  completedAt?: number;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  report?: ResearchReport;
  proof?: ProofMetadata;
}

export interface UserSession {
  walletAddress: `0x${string}`;
  sessionToken: string;
  connectedAt: number;
  totalExecutions: number;
  verifiedExecutions: number;
}

export interface AgentStats {
  walletAddress: string;
  totalExecutions: number;
  verifiedExecutions: number;
  successRate: number;
  avgRuntimeSeconds: number;
  recentProofs: ProofMetadata[];
}
