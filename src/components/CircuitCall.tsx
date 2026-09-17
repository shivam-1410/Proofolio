import React, { useState } from 'react';
import { ShieldCheck, Cpu, CheckCircle2, Lock, ArrowRight, ExternalLink, Sparkles, Copy } from 'lucide-react';
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
          <div className="icon-badge icon-badge-purple">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="circuit-heading">Proof-of-Reserves Circuit</h3>
            <p className="circuit-subheading">Compact Circuit: <code className="circuit-code">verifySolvency()</code></p>
          </div>
        </div>
        <div className="badge-pill badge-pill-purple">
          <Lock className="w-3.5 h-3.5 mr-1" />
          <span>Zero-Knowledge Proof</span>
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
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="privacy-highlight-label">
            Proved without revealing your input
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
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
              <span>Call Solvency Circuit & Submit Proof</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          )}
        </button>
      </div>

      {!isConnected && (
        <p className="connect-hint-text">
          ⚡ Connect Lace wallet above to enable circuit execution.
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
          <p className="proving-step-desc">{provingStep || 'Processing zero-knowledge constraints...'}</p>
          <div className="proving-note">
            <Lock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            <span>Witness privacy preserved: Private inputs are NEVER sent to the network.</span>
          </div>
        </div>
      )}

      {/* Transaction Result Display */}
      {txResult && (
        <div className="tx-result-card" id="tx-result-display">
          <div className="tx-result-header">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="tx-success-title">Proof Confirmed On-Chain!</span>
            </div>
            <span className="tx-time-tag">{txResult.timestamp}</span>
          </div>

          <div className="label-badge-success mb-3">
            <ShieldCheck className="w-4 h-4 mr-1 inline" />
            <span>Proved without revealing your input</span>
          </div>

          <div className="result-field-grid">
            <div className="result-field">
              <span className="field-name">On-Chain Solvency Status:</span>
              <span className="field-value font-bold text-emerald-400">
                {txResult.verifiedSolvent ? '✅ SOLVENT (VERIFIED)' : '❌ UNVERIFIED'}
              </span>
            </div>

            <div className="result-field">
              <span className="field-name">Confirmed Block Height:</span>
              <span className="field-value text-cyan-300 font-mono">
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
                  <Copy className="w-3 h-3 mr-1" />
                  <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="field-code">{txResult.txHash}</code>
            </div>

            <div className="result-field result-field-full">
              <span className="field-name">Audit Commitment Hash:</span>
              <code className="field-code text-purple-300">{txResult.commitment}</code>
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
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
