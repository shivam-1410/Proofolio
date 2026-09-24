/**
 * Proofolio Smart Contract Interaction Helpers
 * Provides utilities for interacting with Proofolio Compact contracts on Midnight Preprod.
 */

export interface SolvencyWitnessInputs {
  totalReserves: bigint;
  totalLiabilities: bigint;
  salt: Uint8Array;
}

export interface SolvencyLedgerState {
  solvency_status: boolean;
  last_verified_block: bigint;
  commitment_hash: string;
}

export interface SolvencyProofResult {
  txHash: string;
  blockHeight: number;
  verifiedSolvent: boolean;
  commitment: string;
  timestamp: string;
  gasFeeTDU: string;
}

/**
 * Generates a secure random 32-byte salt for zero-knowledge commitment blinding.
 */
export function generateBlindingSalt(): Uint8Array {
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);
  return salt;
}

/**
 * Converts a Uint8Array into a hex string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string into a Uint8Array.
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Formats a BigInt or numeric amount to USD/Token display format.
 */
export function formatCurrency(amount: bigint | number, decimals: number = 0): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Computes the simulated commitment hash for audit tracking (matches Compact persistentHash).
 */
export async function computeAuditCommitment(salt: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', salt.buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks whether the given reserves and liabilities satisfy the solvency threshold constraint.
 */
export function verifySolvencyConstraint(reserves: bigint, liabilities: bigint): boolean {
  return reserves >= liabilities;
}

/**
 * Calculates the reserve backing ratio percentage without revealing underlying numbers.
 */
export function calculateReserveRatio(reserves: bigint, liabilities: bigint): number {
  if (liabilities === 0n) return 100;
  return Number((reserves * 10000n) / liabilities) / 100;
}

/**
 * Preprod contract configuration constants.
 */
export const CONTRACT_CONFIG = {
  NETWORK_ID: 'preprod',
  CONTRACT_ADDRESS: '25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d',
  DEPLOYER_ADDRESS: 'mn_addr_preview1j4qdvwggfyz43g8yuhata2ejszt23kc3nxwn2lfyvs0dwp4g37vsgxaku5',
  DEFAULT_BLOCK_HEIGHT: 900942,
  INDEXER_URL: 'https://indexer.preprod.midnight.network',
  RPC_URL: 'https://rpc.preprod.midnight.network',
  PROOF_SERVER_URL: 'http://localhost:6300',
};
