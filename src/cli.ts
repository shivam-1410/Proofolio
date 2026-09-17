/**
 * ============================================================================
 * Interactive CLI for ZK Proof-of-Reserves Confidential Solvency Verifier
 * ============================================================================
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
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
import { resolveNetwork, getOrCreateWallet, formatWalletBackupNotice, getDeployment } from './network.js';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet.js';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'proofOfReservesPrivateState';
const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const SEED = WALLET.seed;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'managed', 'proof_of_reserves');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const ProofOfReserves = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('proof_of_reserves', ProofOfReserves.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

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

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'proof-of-reserves-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║        ZK Proof-of-Reserves Solvency Verifier CLI            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });
  const deployment = getDeployment(network);

  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run npm run deploy first.`);
    process.exit(1);
  }

  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network:  ${network}\n`);

  try {
    console.log('  Connecting to wallet...');
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    await walletCtx.wallet.waitForSyncedState();
    await persistWalletState(network, walletCtx);

    console.log('  Connecting to contract on Midnight...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected to contract!\n');

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Prove Solvency in Zero-Knowledge (verifySolvency)');
      console.log('  2. Query On-Chain Public Ledger State');
      console.log('  3. Check Wallet & DUST Balance');
      console.log('  4. Exit\n');

      const choice = await rl.question('  Your choice (1-4): ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n  ─── Private Solvency Witness Inputs ───');
          console.log('  (These numbers remain 100% PRIVATE and are NEVER sent to the chain)\n');
          const rawReserves = await rl.question('  Enter Total Reserves (e.g. 10000000): ');
          const rawLiabilities = await rl.question('  Enter Total Liabilities (e.g. 8500000): ');

          const totalReserves = BigInt(rawReserves.trim() || '10000000');
          const totalLiabilities = BigInt(rawLiabilities.trim() || '8500000');
          const salt = new Uint8Array(crypto.randomBytes(32));
          const blockNumber = BigInt(Math.floor(Date.now() / 1000));

          if (totalReserves < totalLiabilities) {
            console.log('\n  ❌ Solvency assertion: Total Reserves must be >= Total Liabilities.');
            console.log('     Generating a proof with reserves < liabilities will fail circuit validation.\n');
          }

          console.log('\n  Generating zero-knowledge proof with proof server...');
          console.log('  Submitting transaction to Midnight Preview network...');

          try {
            const tx = await deployed.callTx.verifySolvency(
              totalReserves,
              totalLiabilities,
              salt,
              blockNumber
            );

            console.log('\n  🎉 Solvency proven and verified on-chain!');
            console.log(`  Transaction ID: ${tx.public.txId}`);
            console.log(`  Block height:   ${tx.public.blockHeight}\n`);
          } catch (err: any) {
            console.error('\n  ❌ Transaction failed:', err?.message ?? err);
          }
          break;
        }

        case '2': {
          console.log('\n  Reading public ledger state from Midnight indexer...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledger = ProofOfReserves.ledger(contractState.data);
              console.log('\n  ════════════════════════════════════════════════');
              console.log('  ON-CHAIN PUBLIC LEDGER STATE');
              console.log('  ════════════════════════════════════════════════');
              console.log(`  Solvency Status:     ${ledger.solvency_status ? '✅ SOLVENT' : '❌ UNVERIFIED'}`);
              console.log(`  Last Verified Block: ${ledger.last_verified_block}`);
              console.log(`  Commitment Hash:     0x${Buffer.from(ledger.commitment_hash).toString('hex')}`);
              console.log('  ════════════════════════════════════════════════\n');
            } else {
              console.log('\n  Contract state not yet indexed.\n');
            }
          } catch (err: any) {
            console.error('\n  ❌ Query failed:', err?.message ?? err);
          }
          break;
        }

        case '3': {
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight Balance: ${currentBalance.toLocaleString()} tNight`);
          console.log(`  DUST Balance:   ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '4': {
          running = false;
          console.log('\n  Exiting. Goodbye!\n');
          break;
        }

        default:
          console.log('\n  Invalid option. Choose 1-4.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (err: any) {
    console.error('\n❌ Fatal CLI error:', err?.message ?? err);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
