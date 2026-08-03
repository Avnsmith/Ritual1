import { AgentOrchestrator } from '@wowweb/agents';
import { AgentTask } from '@wowweb/shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (event: string, data: Record<string, unknown>) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(payload));
  };

  const orchestrator = new AgentOrchestrator();

  orchestrator
    .executeTask(prompt, owner as `0x${string}`, (step, task) => {
      taskStore.set(task.id, task);
      sendEvent('step', { step, task });
    })
    .then(async finalTask => {
      taskStore.set(finalTask.id, finalTask);
      await sendEvent('complete', { task: finalTask });
      await writer.close();
    })
    .catch(async err => {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await sendEvent('error', { error: errorMsg });
      await writer.close();
    });

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
