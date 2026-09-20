import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  verifySolvency(context: __compactRuntime.CircuitContext<PS>,
                 total_reserves_0: bigint,
                 total_liabilities_0: bigint,
                 salt_0: Uint8Array,
                 block_number_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verifySolvency(context: __compactRuntime.CircuitContext<PS>,
                 total_reserves_0: bigint,
                 total_liabilities_0: bigint,
                 salt_0: Uint8Array,
                 block_number_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  verifySolvency(context: __compactRuntime.CircuitContext<PS>,
                 total_reserves_0: bigint,
                 total_liabilities_0: bigint,
                 salt_0: Uint8Array,
                 block_number_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly solvency_status: boolean;
  readonly last_verified_block: bigint;
  readonly commitment_hash: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
