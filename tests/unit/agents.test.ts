import assert from 'node:assert';
import { PlannerAgent, BrowserAgent, ResearchAgent, VerificationAgent } from '@wowweb/agents';
import { hashString } from '@wowweb/shared';

export async function runAgentUnitTests() {
  console.log('🧪 Running Agent Unit Tests...');

  // 1. Planner Agent
  const planner = new PlannerAgent();
  const plan = await planner.createPlan('Research Ritual ecosystem');
  assert.ok(plan.length > 0, 'Planner should generate at least 1 sub-task');
  assert.strictEqual(plan[0].query, 'Research Ritual ecosystem');
  console.log('  ✅ PlannerAgent Test Passed');

  // 2. Browser Agent URL Validation
  const browser = new BrowserAgent();
  const searchResults = await browser.searchWeb('Ritual foundation');
  assert.ok(searchResults.length >= 3, 'Search results should return at least 3 citations');
  assert.ok(searchResults[0].url.startsWith('http'), 'Citation URLs must start with http');
  console.log('  ✅ BrowserAgent Search & Sanitization Test Passed');

  // 3. Research Agent Synthesis
  const research = new ResearchAgent();
  const synthesis = await research.analyzeSources('Ritual foundation', searchResults);
  assert.ok(synthesis.confidenceScore >= 75, 'Confidence score should be >= 75%');
  assert.ok(synthesis.keyFindings.length > 0, 'Key findings should not be empty');
  assert.ok(synthesis.comparisonTable.length > 0, 'Comparison table should not be empty');
  console.log('  ✅ ResearchAgent Synthesis Test Passed');

  // 4. Verification Agent Hashing
  const verification = new VerificationAgent();
  const proof = await verification.createProof(
    '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`,
    'Test prompt',
    [],
    {
      title: 'Test',
      summary: 'Summary',
      keyFindings: [],
      pros: [],
      cons: [],
      comparisonTable: [],
      confidenceScore: 90,
      sources: [],
      rawMarkdown: '# Test Markdown',
    },
    '0x3eC7380d5AEaee2f0254cD4575ceAc0d8b6CA15A' as `0x${string}`
  );

  assert.strictEqual(proof.promptHash, hashString('Test prompt'));
  assert.strictEqual(proof.outputHash, hashString('# Test Markdown'));
  assert.strictEqual(proof.isVerified, true);
  console.log('  ✅ VerificationAgent Hashing Test Passed');
}
