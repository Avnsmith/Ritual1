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
  async analyze(userPrompt: string): Promise<AgentDecisionPlan> {
    const cleanPrompt = userPrompt.trim();
    const lower = cleanPrompt.toLowerCase();

    // Autonomous Capability Decisions (Enabled internally by default)
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
        query: 'RitualNet AI precompiles and proof registry documentation',
        targetUrls: ['https://docs.ritualfoundation.org', 'https://skills.ritualfoundation.org', 'https://explorer.ritualfoundation.org'],
        type: 'docs',
      });
    }

    if (lower.includes('github') || lower.includes('code') || lower.includes('repo')) {
      subTasks.push({
        id: 'task-3',
        query: 'Ritual foundation repositories',
        targetUrls: ['https://github.com/ritual-foundation'],
        type: 'github',
      });
    }

    const reasoning = `Autonomous Planner evaluated prompt: Browser crawling (${subTasks.length} sub-tasks), synthesis, keccak256 verification, and RitualNet proof publishing automatically enabled.`;

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
