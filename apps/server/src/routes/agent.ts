import { Router, Request, Response } from 'express';
import { AgentOrchestrator } from '@wowweb/agents';
import { db } from '../storage.js';
import { createPublicClient, http } from 'viem';
import { ritualNet, hashString, hashArray, SourceCitation, UserSettings } from '@wowweb/shared';
import { WOWWEB_PROOF_REGISTRY_ADDRESS, WOWWEB_PROOF_REGISTRY_ABI } from '@wowweb/contracts';

export const agentRouter = Router();
const orchestrator = new AgentOrchestrator();

const publicClient = createPublicClient({
  chain: ritualNet,
  transport: http(process.env.NEXT_PUBLIC_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'),
});

// SSE Stream route
agentRouter.get('/stream', async (req: Request, res: Response) => {
  const prompt = (req.query.prompt as string) || 'Research top autonomous AI browser agents';
  const ownerWallet = (req.query.owner as `0x${string}`) || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  const providerParam = (req.query.provider as any) || 'openai';
  const searchEngineParam = (req.query.searchEngine as any) || 'duckduckgo';
  const apiKeyParam = (req.query.apiKey as string) || undefined;
  const autoPublishParam = req.query.autoPublish === 'false' ? false : true;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent('status', { message: 'Initializing Verifiable AI Browser Agent...', status: 'searching' });

    const userSettings: Partial<UserSettings> = {
      ai: { provider: providerParam, apiKey: apiKeyParam || '', temperature: 0.3, topP: 1, maxTokens: 2048 },
      search: { provider: searchEngineParam, apiKey: '' },
      ritual: { autoPublish: autoPublishParam, publishMode: 'auto', verificationLevel: 'standard' },
    };

    const task = await orchestrator.executeTask(
      prompt,
      ownerWallet,
      (step, currentTask) => {
        sendEvent('step', { step, task: currentTask });
      },
      { provider: providerParam, apiKey: apiKeyParam },
      { userSettings, autoPublish: autoPublishParam }
    );

    db.saveTask(task);
    sendEvent('complete', { task });
    res.end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    sendEvent('error', { error: message });
    res.end();
  }
});

// Standard REST execution
agentRouter.post('/execute', async (req: Request, res: Response) => {
  const { prompt, ownerWallet, provider, apiKey, searchEngine, autoPublish } = req.body;
  if (!prompt || !ownerWallet) {
    return res.status(400).json({ error: 'Missing prompt or ownerWallet' });
  }

  try {
    const userSettings: Partial<UserSettings> = {
      ai: { provider: provider || 'openai', apiKey: apiKey || '', temperature: 0.3, topP: 1, maxTokens: 2048 },
      search: { provider: searchEngine || 'duckduckgo', apiKey: '' },
    };

    const task = await orchestrator.executeTask(
      prompt,
      ownerWallet,
      undefined,
      { provider: provider || 'openai', apiKey },
      { userSettings, autoPublish: autoPublish ?? true }
    );
    db.saveTask(task);
    res.json({ success: true, task });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Task lookup
agentRouter.get('/task/:id', (req: Request, res: Response) => {
  const task = db.getTask(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

// History lookup
agentRouter.get('/history/:wallet', (req: Request, res: Response) => {
  const tasks = db.getTasksByOwner(req.params.wallet);
  res.json({ tasks });
});

// Stats lookup
agentRouter.get('/stats/:wallet', (req: Request, res: Response) => {
  const stats = db.getAgentStats(req.params.wallet);
  res.json({ stats });
});

// Proof lookup
agentRouter.get('/proof/:id', (req: Request, res: Response) => {
  const task = db.getTask(req.params.id);
  if (!task || !task.proof) {
    return res.status(404).json({ error: 'Proof not found' });
  }
  res.json({ proof: task.proof, task });
});

// Collections API
agentRouter.get('/collections', (req: Request, res: Response) => {
  res.json({ collections: db.getCollections() });
});

agentRouter.post('/collections/add', (req: Request, res: Response) => {
  const { collectionId, taskId } = req.body;
  if (!collectionId || !taskId) {
    return res.status(400).json({ error: 'Missing collectionId or taskId' });
  }
  const success = db.addTaskToCollection(collectionId, taskId);
  res.json({ success });
});

// Verification API
agentRouter.get('/proof/:id/verify', async (req: Request, res: Response) => {
  const task = db.getTask(req.params.id);
  if (!task || !task.proof) {
    return res.status(404).json({ error: 'Proof not found for calculation' });
  }

  try {
    const computedPromptHash = hashString(task.prompt);
    const computedOutputHash = hashString(task.report?.rawMarkdown || '');
    const computedVisitedUrlsHash = hashArray(task.report?.sources?.map((s: SourceCitation) => s.url) || []);

    const isPromptMatch = computedPromptHash === task.proof.promptHash;
    const isOutputMatch = computedOutputHash === task.proof.outputHash;
    const isVisitedMatch = computedVisitedUrlsHash === task.proof.visitedUrlsHash;

    const contractAddress = (process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS || WOWWEB_PROOF_REGISTRY_ADDRESS) as `0x${string}`;

    let onChainRecord: any = null;
    let onChainMatch = false;

    try {
      onChainRecord = await publicClient.readContract({
        address: contractAddress,
        abi: WOWWEB_PROOF_REGISTRY_ABI,
        functionName: 'getProof',
        args: [task.proof.executionId as `0x${string}`],
      });

      if (onChainRecord && onChainRecord.timestamp > 0n) {
        onChainMatch =
          onChainRecord.promptHash === task.proof.promptHash &&
          onChainRecord.outputHash === task.proof.outputHash &&
          onChainRecord.ownerWallet.toLowerCase() === task.proof.ownerWallet.toLowerCase();
      }
    } catch (contractErr) {
      console.warn('On-chain read verification failed:', contractErr);
    }

    const verificationPassed = isPromptMatch && isOutputMatch && isVisitedMatch && onChainMatch;

    res.json({
      executionId: task.proof.executionId,
      transactionHash: task.proof.transactionHash,
      verificationPassed,
      computedHashes: {
        promptHash: computedPromptHash,
        outputHash: computedOutputHash,
        visitedUrlsHash: computedVisitedUrlsHash,
      },
      storedHashes: {
        promptHash: task.proof.promptHash,
        outputHash: task.proof.outputHash,
        visitedUrlsHash: task.proof.visitedUrlsHash,
      },
      checks: {
        promptHashMatch: isPromptMatch,
        outputHashMatch: isOutputMatch,
        visitedUrlsHashMatch: isVisitedMatch,
        onChainMatch,
      },
      onChainRecord: onChainRecord ? {
        executionId: onChainRecord.executionId,
        ownerWallet: onChainRecord.ownerWallet,
        timestamp: Number(onChainRecord.timestamp),
        status: onChainRecord.status,
      } : null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});
