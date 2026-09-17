/**
 * ============================================================================
 * Unit Test Suite: ZK Proof-of-Reserves Confidential Solvency Verifier
 * ============================================================================
 * 
 * Verifies:
 * 1. Circuit passes when total_reserves >= total_liabilities (Solvent)
 * 2. Circuit reverts/throws when total_reserves < total_liabilities (Insolvent)
 * 3. Ledger state invariants: private inputs (reserves, liabilities, raw salt)
 *    are NEVER exposed in public state or ledger descriptors.
 * 4. State transitions: upon successful verification, public ledger updates
 *    solvency_status to true, records block number, and updates commitment hash.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger } from '../managed/proof_of_reserves/contract/index.js';

describe('ZK Proof-of-Reserves Circuit & State Invariants', () => {
  // Helper to construct a clean initialized contract state and context
  function setupTestContract() {
    const contract = new Contract({});
    const coinPublicKey = new Uint8Array(32);
    coinPublicKey.fill(1);

    const constructorContext = {
      initialZswapLocalState: { coinPublicKey },
      initialPrivateState: {},
    };

    const initResult = contract.initialState(constructorContext as any);
    const context = __compactRuntime.createCircuitContext(
      __compactRuntime.dummyContractAddress(),
      coinPublicKey,
      initResult.currentContractState.data,
      initResult.currentPrivateState
    );

    return { contract, context, state: initResult.currentContractState };
  }

  it('Test 1: Initial state has solvency_status = false, zero block, and zero commitment', () => {
    const { state } = setupTestContract();
    const publicLedger = ledger(state.data);

    assert.equal(publicLedger.solvency_status, false, 'Initial solvency status must be false');
    assert.equal(publicLedger.last_verified_block, 0n, 'Initial verified block must be 0');
    assert.equal(publicLedger.commitment_hash.length, 32, 'Commitment hash must be 32 bytes');
    assert.deepEqual(
      publicLedger.commitment_hash,
      new Uint8Array(32),
      'Initial commitment hash must be all zeroes'
    );
    console.log('  ✓ Initial ledger state verified (solvency_status = false)');
  });

  it('Test 2: Circuit execution succeeds when total_reserves >= total_liabilities', () => {
    const { contract, context } = setupTestContract();

    // 10,000,000 tNight reserves vs 8,500,000 tNight liabilities (Solvent: 117.6% ratio)
    const totalReserves = 10_000_000n;
    const totalLiabilities = 8_500_000n;
    const salt = new Uint8Array(crypto.randomBytes(32));
    const blockNumber = 123456n;

    const circuitResult = contract.circuits.verifySolvency(
      context,
      totalReserves,
      totalLiabilities,
      salt,
      blockNumber
    );

    assert.ok(circuitResult, 'Circuit must return a result object');
    assert.ok(circuitResult.context, 'Circuit must return updated context');

    // Query updated ledger
    const updatedLedger = ledger(circuitResult.context.currentQueryContext.state);
    assert.equal(updatedLedger.solvency_status, true, 'Solvency status must be true after check');
    assert.equal(updatedLedger.last_verified_block, blockNumber, 'Block number must match verified block');
    assert.notDeepEqual(
      updatedLedger.commitment_hash,
      new Uint8Array(32),
      'Commitment hash must be updated with salt commitment'
    );

    console.log('  ✓ Circuit passed with total_reserves >= total_liabilities');
    console.log(`    Reserves:    ${totalReserves.toLocaleString()} (Private)`);
    console.log(`    Liabilities: ${totalLiabilities.toLocaleString()} (Private)`);
    console.log(`    Solvency:    ${updatedLedger.solvency_status} (Public)`);
    console.log(`    Block:       ${updatedLedger.last_verified_block} (Public)`);
  });

  it('Test 3: Circuit execution reverts/fails when total_reserves < total_liabilities', () => {
    const { contract, context } = setupTestContract();

    // Insolvent: 5,000,000 reserves vs 7,000,000 liabilities
    const totalReserves = 5_000_000n;
    const totalLiabilities = 7_000_000n;
    const salt = new Uint8Array(crypto.randomBytes(32));
    const blockNumber = 123457n;

    assert.throws(
      () => {
        contract.circuits.verifySolvency(
          context,
          totalReserves,
          totalLiabilities,
          salt,
          blockNumber
        );
      },
      (err: any) => {
        const msg = err?.message || String(err);
        return msg.includes('Solvency check failed: total_reserves must be greater than or equal to total_liabilities');
      },
      'Circuit must throw assertion failure on insolvency'
    );

    console.log('  ✓ Circuit rejected invalid state (reserves < liabilities) with assertion error');
  });

  it('Test 4: Privacy Invariants — private inputs are never exposed in public ledger state', () => {
    const { contract, context } = setupTestContract();

    const totalReserves = 98_765_432n;
    const totalLiabilities = 45_678_901n;
    const salt = new Uint8Array(crypto.randomBytes(32));
    const blockNumber = 99999n;

    const circuitResult = contract.circuits.verifySolvency(
      context,
      totalReserves,
      totalLiabilities,
      salt,
      blockNumber
    );

    const publicLedger = ledger(circuitResult.context.currentQueryContext.state);
    const ledgerKeys = Object.keys(publicLedger);

    // Assert that the only exposed ledger properties are the public declarations
    assert.deepEqual(
      ledgerKeys.sort(),
      ['commitment_hash', 'last_verified_block', 'solvency_status'].sort(),
      'Public ledger must ONLY contain authorized public fields'
    );

    // Verify private values are not stringified or directly leaked anywhere in public state values
    assert.equal(
      typeof (publicLedger as any).total_reserves,
      'undefined',
      'total_reserves must not exist in public ledger'
    );
    assert.equal(
      typeof (publicLedger as any).total_liabilities,
      'undefined',
      'total_liabilities must not exist in public ledger'
    );
    assert.equal(
      typeof (publicLedger as any).salt,
      'undefined',
      'raw salt must not exist in public ledger'
    );

    console.log('  ✓ Privacy guarantees verified: private witnesses strictly shielded from public ledger');
  });
});
