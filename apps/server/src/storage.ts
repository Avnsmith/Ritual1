import { AgentTask, AgentStats, UserSession, ProofMetadata } from '@wowweb/shared';

export class StorageEngine {
  private tasks = new Map<string, AgentTask>();
  private sessions = new Map<string, UserSession>();

  saveTask(task: AgentTask): void {
    this.tasks.set(task.id, task);
    this.updateUserSessionStats(task.ownerWallet);
  }

  getTask(id: string): AgentTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  getTasksByOwner(ownerWallet: string): AgentTask[] {
    const lower = ownerWallet.toLowerCase();
    return this.getAllTasks().filter(t => t.ownerWallet.toLowerCase() === lower);
  }

  saveSession(session: UserSession): void {
    this.sessions.set(session.walletAddress.toLowerCase(), session);
  }

  getSession(walletAddress: string): UserSession | undefined {
    return this.sessions.get(walletAddress.toLowerCase());
  }

  private updateUserSessionStats(ownerWallet: `0x${string}`): void {
    const userTasks = this.getTasksByOwner(ownerWallet);
    const verified = userTasks.filter(t => t.proof?.isVerified).length;

    const existing = this.getSession(ownerWallet);
    if (existing) {
      existing.totalExecutions = userTasks.length;
      existing.verifiedExecutions = verified;
      this.saveSession(existing);
    }
  }

  getAgentStats(ownerWallet: string): AgentStats {
    const userTasks = this.getTasksByOwner(ownerWallet);
    const verifiedTasks = userTasks.filter(t => t.proof?.isVerified);
    const successRate = userTasks.length > 0 ? Math.round((verifiedTasks.length / userTasks.length) * 100) : 100;

    const runtimes = userTasks
      .filter(t => t.completedAt && t.createdAt)
      .map(t => (t.completedAt! - t.createdAt) / 1000);
    const avgRuntimeSeconds = runtimes.length > 0
      ? Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length)
      : 8;

    const recentProofs: ProofMetadata[] = userTasks
      .filter(t => t.proof)
      .map(t => t.proof!)
      .slice(0, 10);

    return {
      walletAddress: ownerWallet,
      totalExecutions: userTasks.length,
      verifiedExecutions: verifiedTasks.length,
      successRate,
      avgRuntimeSeconds,
      recentProofs,
    };
  }
}

export const db = new StorageEngine();
