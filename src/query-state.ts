/**
 * Quick script to query the deployed ZK Proof-of-Reserves contract state on Preview network.
 */
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { resolveNetwork, getDeployment } from './network.js';

const { network, config: networkConfig } = resolveNetwork();
const deployment = getDeployment(network);

if (!deployment) {
  console.error(`No deploy on file for network ${network}`);
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'managed', 'proof_of_reserves');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');
const ProofOfReserves = await import(pathToFileURL(contractPath).href);

console.log(`Connecting to Midnight ${network} indexer at ${networkConfig.indexer}...`);
const publicDataProvider = indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS);

console.log(`Querying contract state for ${deployment.address}...`);
const contractState = await publicDataProvider.queryContractState(deployment.address);

if (!contractState) {
  console.log('Contract state is null or still being indexed.');
} else {
  const ledger = ProofOfReserves.ledger(contractState.data);
  console.log('\n================================================================');
  console.log('  ON-CHAIN PUBLIC LEDGER STATE');
  console.log('================================================================');
  console.log(`  Contract Address:    ${deployment.address}`);
  console.log(`  Solvency Status:     ${ledger.solvency_status}`);
  console.log(`  Last Verified Block: ${ledger.last_verified_block}`);
  console.log(`  Commitment Hash:     0x${Buffer.from(ledger.commitment_hash).toString('hex')}`);
  console.log('================================================================\n');
}
