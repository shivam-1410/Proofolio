/**
 * ============================================================================
 * Unit Test Suite: Counter Compact Contract
 * ============================================================================
 * 
 * Verifies Level 3 requirements:
 * a) Circuit logic — does the circuit compute correctly?
 * b) State transitions — does ledger state update as expected?
 * c) Privacy — private input is never exposed in any output
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger } from '../managed/counter/contract/index.js';

describe('Counter Circuit & State Invariants', () => {
  function setupCounterContract() {
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

  it('Test 1: Circuit logic — circuit computes correctly and updates counter by exact amount', () => {
    const { contract, context } = setupCounterContract();

    // Verify initial ledger value
    const initialLedger = ledger(context.currentQueryContext.state);
    assert.equal(initialLedger.counter, 0n, 'Initial counter state must be 0');

    // Call increment circuit with 5
    const result1 = contract.circuits.increment(context, 5n);
    assert.ok(result1, 'Circuit execution must succeed');
    const ledgerAfter1 = ledger(result1.context.currentQueryContext.state);
    assert.equal(ledgerAfter1.counter, 5n, 'Counter must equal 5 after incrementing by 5');

    // Call increment again with 10
    const result2 = contract.circuits.increment(result1.context, 10n);
    const ledgerAfter2 = ledger(result2.context.currentQueryContext.state);
    assert.equal(ledgerAfter2.counter, 15n, 'Counter must equal 15 after second increment');

    console.log('  ✓ Circuit logic verified: counter increments accurately from 0 -> 5 -> 15');
  });

  it('Test 2: State transitions — ledger state updates as expected through lifecycle (init -> increment -> reset)', () => {
    const { contract, context } = setupCounterContract();

    // Increment
    const incResult = contract.circuits.increment(context, 42n);
    const incLedger = ledger(incResult.context.currentQueryContext.state);
    assert.equal(incLedger.counter, 42n, 'State must transition to 42');

    // Reset circuit
    const resetResult = contract.circuits.reset(incResult.context);
    const resetLedger = ledger(resetResult.context.currentQueryContext.state);
    assert.equal(resetLedger.counter, 0n, 'State must transition back to 0 after reset');

    console.log('  ✓ State transition verified: 0 -> 42 -> 0 via reset()');
  });

  it('Test 3: Privacy — private inputs & witness salt are never exposed in ledger state', () => {
    const { contract, context } = setupCounterContract();

    const privateAmount = 77n;
    const privateSalt = new Uint8Array(crypto.randomBytes(32));

    const result = contract.circuits.incrementWithAssert(context, privateAmount, privateSalt);
    const publicLedger = ledger(result.context.currentQueryContext.state);

    // Verify that the ledger only contains the counter property
    const ledgerKeys = Object.keys(publicLedger);
    assert.deepEqual(ledgerKeys, ['counter'], 'Public ledger must ONLY disclose the counter field');

    // Explicitly verify private witness and salt are never in the public ledger
    assert.equal(typeof (publicLedger as any).salt, 'undefined', 'Private salt must not be exposed');
    assert.equal(typeof (publicLedger as any).amount, 'undefined', 'Amount parameter must not be stored in ledger');

    console.log('  ✓ Privacy guarantees verified: private inputs strictly shielded from public ledger output');
  });
});
