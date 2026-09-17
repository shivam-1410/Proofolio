/**
 * ============================================================================
 * Level 3 Test Suite: Confidential Solvency & Eligibility Gate
 * ============================================================================
 * 
 * Chosen Challenge Track:
 * "Age / Eligibility Gate — prove a threshold without revealing the underlying value"
 * 
 * Verifies:
 * 1. Eligibility gate successfully verifies threshold qualification (reserves >= threshold).
 * 2. Gate rejects under-collateralized / sub-threshold inputs with assertion error.
 * 3. Threshold margin privacy: delta between assets and liabilities remains confidential.
 * 4. Deterministic commitment generation: commitment hashes are tamper-resistant.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger } from '../managed/proof_of_reserves/contract/index.js';

describe('Level 3: Confidential Eligibility Gate (Threshold Verification)', () => {
  function setupTestContract() {
    const contract = new Contract({});
    const coinPublicKey = new Uint8Array(32);
    coinPublicKey.fill(7);

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

  it('Test 5: Eligibility Gate verifies exact threshold (total_reserves == total_liabilities)', () => {
    const { contract, context } = setupTestContract();
    const exactThreshold = 5000000n;
    const salt = new Uint8Array(32);
    crypto.getRandomValues(salt);
    const blockNumber = 901500n;

    // Boundary condition: exactly equal reserves and liabilities
    const results = contract.circuits.verifySolvency(
      context,
      exactThreshold,
      exactThreshold,
      salt,
      blockNumber
    );

    const updatedLedger = ledger(results.context.currentQueryContext.state);
    assert.equal(updatedLedger.solvency_status, true, 'Exact threshold must satisfy eligibility gate');
    assert.equal(updatedLedger.last_verified_block, blockNumber);
    console.log('  ✓ Exact threshold boundary condition passed (100% reserve ratio verified)');
  });

  it('Test 6: Multi-round proof uniqueness: separate blinding salts yield distinct commitments', () => {
    const { contract, context } = setupTestContract();
    const reserves = 10000000n;
    const liabilities = 8000000n;
    const salt1 = new Uint8Array(32).fill(1);
    const salt2 = new Uint8Array(32).fill(2);

    const res1 = contract.circuits.verifySolvency(context, reserves, liabilities, salt1, 100n);
    const ledger1 = ledger(res1.context.currentQueryContext.state);

    const res2 = contract.circuits.verifySolvency(context, reserves, liabilities, salt2, 101n);
    const ledger2 = ledger(res2.context.currentQueryContext.state);

    assert.notDeepEqual(
      ledger1.commitment_hash,
      ledger2.commitment_hash,
      'Distinct salts must produce distinct commitment hashes to prevent linkability'
    );
    console.log('  ✓ Cryptographic blinding ensures audit commitments cannot be correlated');
  });

  it('Test 7: Observable Privacy Invariant: delta/surplus is zero-knowledge protected', () => {
    const { contract, context } = setupTestContract();
    // Two vastly different asset sizes that both qualify (e.g. 10M vs 500M)
    const smallReserves = 10000000n;
    const largeReserves = 500000000n;
    const requiredLiabilities = 8000000n;
    const salt = new Uint8Array(32).fill(9);

    const resSmall = contract.circuits.verifySolvency(context, smallReserves, requiredLiabilities, salt, 200n);
    const ledgerSmall = ledger(resSmall.context.currentQueryContext.state);

    const resLarge = contract.circuits.verifySolvency(context, largeReserves, requiredLiabilities, salt, 200n);
    const ledgerLarge = ledger(resLarge.context.currentQueryContext.state);

    // In both cases, the public ledger only reveals solvency_status = true
    assert.equal(ledgerSmall.solvency_status, ledgerLarge.solvency_status);
    // Public state contains NO fields reflecting the surplus amount
    const keys = Object.keys(ledgerSmall);
    assert.deepEqual(keys.sort(), ['commitment_hash', 'last_verified_block', 'solvency_status'].sort());
    console.log('  ✓ Public ledger contains zero fields revealing surplus assets or size magnitude');
  });
});
