import assert from 'node:assert';

export async function runApiIntegrationTests() {
  console.log('\n🌐 Running Backend API Integration Tests...');

  const baseUrl = 'http://localhost:3001';

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = (await healthRes.json()) as any;
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthData.status, 'ok');
  assert.strictEqual(healthData.chainId, 1979);
  console.log('  ✅ GET /api/health Test Passed');

  // 2. Auth Nonce Creation
  const nonceRes = await fetch(`${baseUrl}/api/auth/nonce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress: '0x3eC7380d5AEaee2f0254cD4575ceAc0d8b6CA15A' }),
  });
  const nonceData = (await nonceRes.json()) as any;
  assert.strictEqual(nonceRes.status, 200);
  assert.ok(nonceData.nonce, 'Nonce string should be returned');
  assert.ok(nonceData.message.includes('RitualNet'), 'Nonce message should mention RitualNet');
  console.log('  ✅ POST /api/auth/nonce Test Passed');

  // 3. Stats Retrieval
  const statsRes = await fetch(`${baseUrl}/api/agent/stats/0x3eC7380d5AEaee2f0254cD4575ceAc0d8b6CA15A`);
  const statsData = (await statsRes.json()) as any;
  assert.strictEqual(statsRes.status, 200);
  assert.ok(statsData.stats, 'Stats object should be returned');
  console.log('  ✅ GET /api/agent/stats/:wallet Test Passed');
}
