import { AgentOrchestrator } from '@wowweb/agents';
import { AgentTask } from '@wowweb/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// In-memory task store for Next.js serverless instance
export const taskStore = new Map<string, AgentTask>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt');
  const owner = searchParams.get('owner') || '0x0000000000000000000000000000000000000000';

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: Record<string, unknown>) => {
        try {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Controller might be closed
        }
      };

      try {
        const orchestrator = new AgentOrchestrator();
        const task = await orchestrator.executeTask(prompt, owner as `0x${string}`, (step, task) => {
          taskStore.set(task.id, task);
          sendEvent('step', { step, task });
        });
        taskStore.set(task.id, task);
        sendEvent('complete', { task });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        sendEvent('error', { error: errorMsg });
      } finally {
        try {
          controller.close();
        } catch {
          // Ignore if already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
