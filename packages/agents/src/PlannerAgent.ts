import { LlmClient } from './LlmClient.js';

export interface PlanTask {
  id: string;
  query: string;
  targetUrls?: string[];
  type: 'search' | 'scrape' | 'github' | 'docs';
}

export interface AgentDecisionPlan {
  requiresBrowser: boolean;
  requiresResearch: boolean;
  requiresVerification: boolean;
  requiresProofPublisher: boolean;
  subTasks: PlanTask[];
  reasoning: string;
}

export class PlannerAgent {
  private llm = new LlmClient();

  async analyze(userPrompt: string): Promise<AgentDecisionPlan> {
    const cleanPrompt = userPrompt.trim();
    const lower = cleanPrompt.toLowerCase();

    // 1. Try LLM Inference if API key is present
    if (this.llm.hasApiKeys()) {
      try {
        const llmPrompt = `Analyze user task and output valid JSON only:\nTask: "${cleanPrompt}"\n\nJSON Schema:\n{\n  "requiresBrowser": true,\n  "requiresResearch": true,\n  "requiresVerification": true,\n  "requiresProofPublisher": true,\n  "queries": ["string"],\n  "reasoning": "string"\n}`;
        const rawText = await this.llm.generateText({ prompt: llmPrompt });
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            requiresBrowser: parsed.requiresBrowser ?? true,
            requiresResearch: parsed.requiresResearch ?? true,
            requiresVerification: parsed.requiresVerification ?? true,
            requiresProofPublisher: parsed.requiresProofPublisher ?? true,
            subTasks: (parsed.queries || [cleanPrompt]).map((q: string, idx: number) => ({
              id: `task-${idx + 1}`,
              query: q,
              type: 'search',
            })),
            reasoning: parsed.reasoning || `LLM Planner orchestrated execution for query: "${cleanPrompt}"`,
          };
        }
      } catch {
        // Fallback to deterministic intent engine
      }
    }

    // 2. Intelligent Intent Analysis Engine
    const requiresBrowser = true;
    const requiresResearch = true;
    const requiresVerification = true;
    const requiresProofPublisher = true;

    const subTasks: PlanTask[] = [
      {
        id: 'task-1',
        query: cleanPrompt,
        type: 'search',
      },
    ];

    if (lower.includes('ritual') || lower.includes('agent') || lower.includes('precompile') || lower.includes('contract')) {
      subTasks.push({
        id: 'task-2',
        query: `${cleanPrompt} RitualNet documentation precompiles`,
        targetUrls: ['https://docs.ritualfoundation.org', 'https://skills.ritualfoundation.org', 'https://explorer.ritualfoundation.org'],
        type: 'docs',
      });
    }

    if (lower.includes('github') || lower.includes('code') || lower.includes('repo')) {
      subTasks.push({
        id: 'task-3',
        query: `${cleanPrompt} GitHub repository code`,
        targetUrls: ['https://github.com/ritual-foundation'],
        type: 'github',
      });
    }

    const reasoning = `Autonomous Planner analyzed query "${cleanPrompt}": Triggering browser crawling (${subTasks.length} sub-tasks), deep synthesis, keccak256 proof generation, and RitualNet transaction anchoring.`;

    return {
      requiresBrowser,
      requiresResearch,
      requiresVerification,
      requiresProofPublisher,
      subTasks,
      reasoning,
    };
  }

  // Legacy compatibility wrapper
  async createPlan(userPrompt: string): Promise<PlanTask[]> {
    const decision = await this.analyze(userPrompt);
    return decision.subTasks;
  }
}
