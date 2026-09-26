import React, { useState } from 'react';
import type { TxResult } from '../hooks/useMidnight';

interface CircuitCallProps {
  contractAddress: string;
  isConnected: boolean;
  isProving: boolean;
  provingStep: string | null;
  txResult: TxResult | null;
  onCallCircuit: () => void;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  contractAddress,
  isConnected,
  isProving,
  provingStep,
  txResult,
  onCallCircuit,
}) => {
  const [copiedTx, setCopiedTx] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="circuit-card">
      <div className="circuit-card-header">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 border border-primary/40 bg-primary/10 text-primary">
            [CIRCUIT]
          </span>
          <div>
            <h3 className="circuit-heading">Proof-of-Reserves Circuit</h3>
            <p className="circuit-subheading">Compact Circuit: <code className="circuit-code">verifySolvency()</code></p>
          </div>
        </div>
        <div className="badge-pill">
          <span className="font-mono text-xs text-primary mr-1.5">[ZK-SNARK]</span>
          <span>Constrained Execution</span>
        </div>
      </div>

      <div className="contract-ref-box">
        <span className="contract-ref-label">Target Preprod Contract:</span>
        <code className="contract-address-text" title={contractAddress}>
          {contractAddress}
        </code>
      </div>

      <div className="privacy-assurance-box">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-emerald-400 font-bold">[VERIFIED]</span>
          <span className="privacy-highlight-label">
            Proved without revealing confidential inputs
          </span>
        </div>
        <p className="privacy-assurance-text">
          The zero-knowledge circuit enforces that reserve assets exceed customer liabilities
          (<code>total_reserves &gt;= total_liabilities</code>). The balance sheet figures remain strictly
          confidential within client-side memory: <strong>raw figures never appear in the UI, ledger state, or transaction payload</strong>.
        </p>
      </div>

      <div className="action-row">
        <button
          onClick={onCallCircuit}
          disabled={!isConnected || isProving}
          className={`prove-btn ${!isConnected ? 'prove-btn-disabled' : ''} ${isProving ? 'prove-btn-loading' : ''}`}
          id="call-circuit-btn"
        >
          {isProving ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner spinner-purple"></span>
              <span>Generating ZK Proof in Browser...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs font-bold text-accent-blue">[EXECUTE]</span>
              <span>Call Solvency Circuit &amp; Submit Proof</span>
              <span className="font-mono text-xs ml-1">&rarr;</span>
            </div>
          )}
        </button>
      </div>

      {!isConnected && (
        <p className="connect-hint-text font-mono text-xs">
          [PROVIDER REQUIRED] Connect Lace wallet above to enable circuit execution.
        </p>
      )}

      {/* Loading state indicator during proof generation */}
      {isProving && (
        <div className="proving-progress-card">
          <div className="flex items-center justify-between mb-2">
            <span className="proving-title">Generating Proof Locally</span>
            <span className="proving-tag">Client-Side ZK</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
          <p className="proving-step-desc font-mono">{provingStep || 'Processing zero-knowledge constraints...'}</p>
          <div className="proving-note">
            <span className="font-mono text-xs text-emerald-400 mr-1">[WITNESS PRIVACY]</span>
            <span>Private inputs are NEVER sent to the network.</span>
          </div>
        </div>
      )}

      {/* Transaction Result Display */}
      {txResult && (
        <div className="tx-result-card" id="tx-result-display">
          <div className="tx-result-header">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-bold">[ON-CHAIN CONFIRMED]</span>
              <span className="tx-success-title font-mono">[PROOF VERIFIED]</span>
            </div>
            <span className="tx-time-tag font-mono">{txResult.timestamp}</span>
          </div>

          <div className="label-badge-success mb-3">
            <span className="font-mono text-xs mr-1">[CONFIDENTIAL]</span>
            <span>Proved without revealing confidential inputs</span>
          </div>

          <div className="result-field-grid">
            <div className="result-field">
              <span className="field-name">On-Chain Solvency Status:</span>
              <span className="field-value font-mono font-bold text-emerald-400">
                {txResult.verifiedSolvent ? '[STATUS: VERIFIED SOLVENT]' : '[STATUS: UNVERIFIED]'}
              </span>
            </div>

            <div className="result-field">
              <span className="field-name">Confirmed Block Height:</span>
              <span className="field-value text-accent-blue font-mono">
                #{txResult.blockHeight}
              </span>
            </div>

            <div className="result-field result-field-full">
              <div className="flex items-center justify-between">
                <span className="field-name">Transaction Hash:</span>
                <button
                  onClick={() => handleCopy(txResult.txHash)}
                  className="copy-mini-btn"
                  title="Copy Tx Hash"
                >
                  <span className="font-mono text-xs mr-1">[COPY]</span>
                  <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="field-code">{txResult.txHash}</code>
            </div>

            <div className="result-field result-field-full">
              <span className="field-name">Audit Commitment Hash:</span>
              <code className="field-code text-slate-300">{txResult.commitment}</code>
            </div>
          </div>

          <div className="explorer-footer">
            <a
              href={`https://indexer.preprod.midnight.network`}
              target="_blank"
              rel="noreferrer"
              className="explorer-link"
            >
              <span>View On Midnight Preprod Explorer</span>
              <span className="font-mono text-xs ml-1">&nearr;</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
