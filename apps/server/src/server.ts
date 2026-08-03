import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import { createNonceMessage, verifyWalletSignature } from './auth.js';
import { db } from './storage.js';
import { agentRouter } from './routes/agent.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', network: 'RitualNet', chainId: 1979, timestamp: Date.now() });
});

// SIWE Auth routes
app.post('/api/auth/nonce', (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'Missing walletAddress' });

  const nonce = Math.random().toString(36).substring(2, 10);
  const message = createNonceMessage(walletAddress, nonce);
  res.json({ message, nonce });
});

app.post('/api/auth/verify', async (req: Request, res: Response) => {
  const { walletAddress, signature, message } = req.body;
  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'Missing authentication parameters' });
  }

  const isValid = await verifyWalletSignature(walletAddress as `0x${string}`, signature as `0x${string}`, message);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid wallet signature' });
  }

  const sessionToken = `wowweb_session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  db.saveSession({
    walletAddress: walletAddress as `0x${string}`,
    sessionToken,
    connectedAt: Date.now(),
    totalExecutions: db.getTasksByOwner(walletAddress).length,
    verifiedExecutions: db.getTasksByOwner(walletAddress).filter(t => t.proof?.isVerified).length,
  });

  res.json({ success: true, sessionToken, walletAddress });
});

// Agent execution router
app.use('/api/agent', agentRouter);

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 WowWeb Server running on port ${PORT} connected to RitualNet (Chain ID: 1979)`);
  });
}

export default app;
