import { runAgentUnitTests } from './unit/agents.test';
import { runApiIntegrationTests } from './integration/api.test';
import { runContractTests } from './contracts/proofRegistry.test';

async function main() {
  console.log('====================================================');
  console.log('🚀 WOWWEB AUTOMATED TEST SUITE RUNNER');
  console.log('====================================================');

  const mode = process.argv[2] || 'all';

  try {
    if (mode === 'unit' || mode === 'all') {
      await runAgentUnitTests();
    }
    if (mode === 'integration' || mode === 'all') {
      await runApiIntegrationTests();
    }
    if (mode === 'contracts' || mode === 'all') {
      await runContractTests();
    }

    console.log('\n====================================================');
    console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    process.exit(1);
  }
}

main();
