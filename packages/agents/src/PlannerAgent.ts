export interface PlanTask {
  id: string;
  query: string;
  targetUrls?: string[];
  type: 'search' | 'scrape' | 'github' | 'docs';
}

export class PlannerAgent {
  async createPlan(userPrompt: string): Promise<PlanTask[]> {
    const cleanPrompt = userPrompt.trim();
    
    const tasks: PlanTask[] = [
      {
        id: 'task-1',
        query: cleanPrompt,
        type: 'search',
      },
    ];

    if (cleanPrompt.toLowerCase().includes('agent') || cleanPrompt.toLowerCase().includes('browser')) {
      tasks.push({
        id: 'task-2',
        query: 'RitualNet AI agent precompiles documentation',
        targetUrls: ['https://docs.ritualfoundation.org', 'https://skills.ritualfoundation.org'],
        type: 'docs',
      });
    }

    if (cleanPrompt.toLowerCase().includes('github') || cleanPrompt.toLowerCase().includes('code')) {
      tasks.push({
        id: 'task-3',
        query: 'Ritual foundation repositories',
        targetUrls: ['https://github.com/ritual-foundation'],
        type: 'github',
      });
    }

    return tasks;
  }
}
