/**
 * Proves solvency on-chain for the deployed contract on Midnight Preview.
 */
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateWallet, getDeployment } from '../src/network.js';
import { createWallet, persistWalletState } from '../src/wallet.js';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'proofOfReservesPrivateState';
const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const deployment = getDeployment(network);

if (!deployment) {
  console.error(`No deployment found for network ${network}`);
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'managed', 'proof_of_reserves');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');
const ProofOfReserves = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('proof_of_reserves', ProofOfReserves.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function main() {
  console.log('Connecting to wallet...');
  const walletCtx = await createWallet({ network, networkConfig, seed: WALLET.seed });
  await walletCtx.wallet.waitForSyncedState();

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'proof-of-reserves-state',
      accountId,
      privateStoragePasswordProvider: () => 'Local-Devnet-Development-Placeholder-1',
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };

  console.log(`Connecting to contract ${deployment.address}...`);
  const deployed: any = await findDeployedContract(providers, {
    compiledContract: compiledContract as any,
    contractAddress: deployment.address,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
  });

  const totalReserves = 10_000_000n;
  const totalLiabilities = 8_500_000n;
  const salt = new Uint8Array(crypto.randomBytes(32));
  const blockNumber = 900800n;

  console.log('\n--- Proving Solvency in Zero-Knowledge ---');
  console.log(`  Private Reserves:    ${totalReserves.toLocaleString()}`);
  console.log(`  Private Liabilities: ${totalLiabilities.toLocaleString()}`);
  console.log(`  Generating ZK proof and submitting transaction...`);

  const tx = await deployed.callTx.verifySolvency(
    totalReserves,
    totalLiabilities,
    salt,
    blockNumber
  );

  console.log('\n🎉 Transaction Confirmed!');
  console.log(`  Transaction ID: ${tx.public.txId}`);
  console.log(`  Block Height:   ${tx.public.blockHeight}\n`);

  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
}

main().catch(console.error);
