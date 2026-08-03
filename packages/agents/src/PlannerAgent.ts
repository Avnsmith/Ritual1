import { AIProvider } from './providers/AIProvider.js';

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
  constructor(private provider?: AIProvider) {}

  async analyze(userPrompt: string): Promise<AgentDecisionPlan> {
    const cleanPrompt = userPrompt.trim();

    if (this.provider) {
      try {
        const responseText = await this.provider.chat({
          messages: [
            {
              role: 'system',
              content: 'You are WowWeb Autonomous Planner Agent. Deconstruct user research task into JSON plan with keys: requiresBrowser (boolean), requiresResearch (boolean), requiresVerification (boolean), requiresProofPublisher (boolean), subTasks (array of {id, query, type}), reasoning (string). Output valid JSON only.',
            },
            {
              role: 'user',
              content: `Deconstruct research task: "${cleanPrompt}"`,
            },
          ],
          temperature: 0.2,
          jsonOutput: true,
        });

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            requiresBrowser: parsed.requiresBrowser ?? true,
            requiresResearch: parsed.requiresResearch ?? true,
            requiresVerification: parsed.requiresVerification ?? true,
            requiresProofPublisher: parsed.requiresProofPublisher ?? true,
            subTasks: (parsed.subTasks || [{ id: 'task-1', query: cleanPrompt, type: 'search' }]),
            reasoning: parsed.reasoning || `LLM Planner (${this.provider.name}) generated dynamic execution plan for "${cleanPrompt}"`,
          };
        }
      } catch {
        // Fallback to internal intent reasoning
      }
    }

    // Deterministic Intent Planner
    const lower = cleanPrompt.toLowerCase();
    const subTasks: PlanTask[] = [
      { id: 'task-1', query: cleanPrompt, type: 'search' },
    ];

    if (lower.includes('ritual') || lower.includes('precompile') || lower.includes('contract')) {
      subTasks.push({
        id: 'task-2',
        query: `${cleanPrompt} RitualNet documentation`,
        targetUrls: ['https://docs.ritualfoundation.org', 'https://skills.ritualfoundation.org'],
        type: 'docs',
      });
    }

    return {
      requiresBrowser: true,
      requiresResearch: true,
      requiresVerification: true,
      requiresProofPublisher: true,
      subTasks,
      reasoning: `Autonomous Planner evaluated task "${cleanPrompt}": Web research, synthesis, keccak256 proof computation, and RitualNet transaction anchoring enabled.`,
    };
  }

  async createPlan(userPrompt: string): Promise<PlanTask[]> {
    const decision = await this.analyze(userPrompt);
    return decision.subTasks;
  }
}
