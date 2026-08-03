import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import solc from 'solc';

function compileContract() {
  console.log('📦 Compiling WowWebProofRegistry.sol with solc 0.8.20...');
  const contractPath = path.join(__dirname, '../contracts/WowWebProofRegistry.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'WowWebProofRegistry.sol': {
        content: source,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    let hasError = false;
    output.errors.forEach((err: any) => {
      if (err.severity === 'error') {
        console.error(err.formattedMessage);
        hasError = true;
      }
    });
    if (hasError) {
      throw new Error('Solidity compilation failed.');
    }
  }

  const contract = output.contracts['WowWebProofRegistry.sol']['WowWebProofRegistry'];
  const compiledArtifact = {
    abi: contract.abi,
    bytecode: ('0x' + contract.evm.bytecode.object) as `0x${string}`,
  };

  const outputPath = path.join(__dirname, '../src/compiledContract.json');
  fs.writeFileSync(outputPath, JSON.stringify(compiledArtifact, null, 2));

  console.log('✅ WowWebProofRegistry Compiled Successfully!');
  console.log(`- Bytecode Size: ${compiledArtifact.bytecode.length / 2} bytes`);
  console.log(`- Saved artifact to packages/contracts/src/compiledContract.json`);

  return compiledArtifact;
}

compileContract();
