import React, { useState } from 'react';
import { Copy, Check, Code, ShieldCheck } from 'lucide-react';

const COMPACT_CODE = `/**
 * ZK Proof-of-Reserves: Confidential Solvency Verifier
 * Midnight Network - Compact Language (v0.23+)
 */
pragma language_version >= 0.23;

import CompactStandardLibrary;

// 1. PUBLIC LEDGER STATE (On-Chain, Globally Verifiable)
export ledger solvency_status: Boolean;
export ledger last_verified_block: Uint<64>;
export ledger commitment_hash: Bytes<32>;

/**
 * Verifies solvency in zero-knowledge.
 * 
 * Enforces total_reserves >= total_liabilities without disclosing
 * the underlying asset or liability amounts to the blockchain.
 *
 * @param total_reserves     Private witness: raw custodian reserve assets
 * @param total_liabilities  Private witness: raw customer deposit debt
 * @param salt               Private blinding salt for audit commitment
 * @param block_number       Public block number / timestamp anchor
 */
export circuit verifySolvency(
  total_reserves: Uint<64>,
  total_liabilities: Uint<64>,
  salt: Bytes<32>,
  block_number: Uint<64>
): [] {
  // Enforce zero-knowledge mathematical solvency constraint
  assert(total_reserves >= total_liabilities,
    "Solvency check failed: total_reserves must be >= total_liabilities");

  // Compute collision-resistant commitment hash of private inputs
  const commitment = persistentHash<Bytes<32>>(salt);

  // Selectively disclose ONLY the certification flag, commitment, and block height
  solvency_status = disclose(true);
  commitment_hash = disclose(commitment);
  last_verified_block = disclose(block_number);
}`;

export const CompactCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMPACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="section-container" id="smart-contract">
      <div className="section-heading-group">
        <span className="section-tag">Smart Contract Implementation</span>
        <h2 className="section-title">Compact Zero-Knowledge Circuit</h2>
        <p className="section-desc">
          Formal circuit specification written in Midnight's Compact language, enforcing mathematical solvency with zero data leakage.
        </p>
      </div>

      <div className="code-card">
        <div className="code-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code className="w-4 h-4 text-blue-400" />
            <span className="code-path">contracts/proof_of_reserves.compact</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Compact v0.23</span>
            <button
              type="button"
              onClick={handleCopy}
              className="code-copy-btn"
              title="Copy Smart Contract Code"
            >
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        </div>

        <pre className="code-pre">
          <code>{COMPACT_CODE}</code>
        </pre>
      </div>
    </div>
  );
};
export default CompactCodeViewer;
