import { Router, Request, Response } from 'express';
import { AgentOrchestrator } from '@wowweb/agents';
import { db } from '../storage.js';
import { createPublicClient, http } from 'viem';
import { ritualNet, hashString, hashArray, SourceCitation } from '@wowweb/shared';
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

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent('status', { message: 'Agent initialization starting...', status: 'searching' });

    const task = await orchestrator.executeTask(prompt, ownerWallet, (step, currentTask) => {
      sendEvent('step', { step, task: currentTask });
    });

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
  const { prompt, ownerWallet } = req.body;
  if (!prompt || !ownerWallet) {
    return res.status(400).json({ error: 'Missing prompt or ownerWallet' });
  }

  try {
    const task = await orchestrator.executeTask(prompt, ownerWallet);
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

// Public Verification API - Recomputes & Verifies On-Chain Proof
agentRouter.get('/proof/:id/verify', async (req: Request, res: Response) => {
  const task = db.getTask(req.params.id);
  if (!task || !task.proof) {
    return res.status(404).json({ error: 'Proof not found for calculation' });
  }

  try {
    // 1. Recompute local canonical hashes
    const computedPromptHash = hashString(task.prompt);
    const computedOutputHash = hashString(task.report?.rawMarkdown || '');
    const computedVisitedUrlsHash = hashArray(task.report?.sources?.map((s: SourceCitation) => s.url) || []);

    const isPromptMatch = computedPromptHash === task.proof.promptHash;
    const isOutputMatch = computedOutputHash === task.proof.outputHash;
    const isVisitedMatch = computedVisitedUrlsHash === task.proof.visitedUrlsHash;

    // 2. Fetch on-chain record from RitualNet ProofRegistry contract
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
