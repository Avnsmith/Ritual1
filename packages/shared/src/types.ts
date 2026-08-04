export type PipelineStage = 
  | 'planner' 
  | 'search' 
  | 'browser' 
  | 'retriever' 
  | 'reasoner' 
  | 'writer' 
  | 'verifier' 
  | 'publisher';

export type ExecutionStatus = 'pending' | 'searching' | 'reading' | 'summarizing' | 'verifying' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  stage: PipelineStage;
  title: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: Record<string, unknown>;
}

export type SourceCategory = 'github' | 'medium' | 'docs' | 'whitepaper' | 'twitter' | 'arxiv' | 'youtube' | 'blog' | 'general';

export interface SourceCitation {
  title: string;
  url: string;
  snippet: string;
  contentHash: string;
  fetchedAt: number;
  category?: SourceCategory;
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
  mermaidDiagram?: string;
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
  collectionId?: string;
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

export type LLMProviderType = 'openai' | 'gemini' | 'anthropic' | 'groq' | 'openrouter' | 'ollama';
export type SearchEngineType = 'brave' | 'serper' | 'tavily' | 'exa' | 'duckduckgo';

export interface AISettings {
  provider: LLMProviderType;
  apiKey: string;
  model?: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface SearchSettings {
  provider: SearchEngineType;
  apiKey: string;
}

export interface BrowserSettings {
  depth: number;
  parallelCrawlers: number;
  maxPages: number;
  timeoutMs: number;
}

export interface RitualSettings {
  autoPublish: boolean;
  publishMode: 'auto' | 'manual';
  verificationLevel: 'standard' | 'strict';
}

export interface UserSettings {
  ai: AISettings;
  search: SearchSettings;
  browser: BrowserSettings;
  ritual: RitualSettings;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: number;
  taskIds: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  steps?: ExecutionStep[];
  sources?: SourceCitation[];
  proof?: ProofMetadata;
  report?: ResearchReport;
}

