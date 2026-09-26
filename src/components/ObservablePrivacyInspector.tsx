import React, { useState } from 'react';

export const ObservablePrivacyInspector: React.FC = () => {
  const [showSecretWitnesses, setShowSecretWitnesses] = useState(false);
  const [mockReserves] = useState(12500000);
  const [mockLiabilities] = useState(8750000);

  const isSolvent = mockReserves >= mockLiabilities;

  return (
    <div className="privacy-inspector-card">
      <div className="inspector-header">
        <div className="flex items-center gap-2">
          <div className="icon-badge">
            <span className="font-mono text-xs text-blue-400 font-bold">[ZK]</span>
          </div>
          <div>
            <h3 className="inspector-title">Observable Privacy Boundary Inspection</h3>
            <p className="inspector-subtitle">Deterministic Zero-Knowledge Invariant Verification</p>
          </div>
        </div>
        <div className="badge-pill">
          <span className="font-mono text-xs text-slate-300">[CRYPTOGRAPHIC BOUNDARY]</span>
        </div>
      </div>

      <div className="inspector-intro">
        <p>
          Conventional auditing architectures require public disclosure of full balance sheet ledgers. Under Midnight Network&apos;s dual-state model, the mathematical condition <code>total_reserves &gt;= total_liabilities</code> is verified without disclosing underlying balance sheets.
        </p>
      </div>

      <div className="comparison-grid">
        {/* Left Side: Client Private Witness */}
        <div className="comparison-box private-box">
          <div className="comparison-box-header">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-slate-400">[PRIVATE]</span>
              <span className="box-header-title text-slate-200">Client Memory Space (Private Witness)</span>
            </div>
            <button
              onClick={() => setShowSecretWitnesses(!showSecretWitnesses)}
              className="witness-toggle-btn"
              title="Toggle private witness visibility for local demonstration"
            >
              <span className="font-mono text-xs mr-1">{showSecretWitnesses ? '[HIDE]' : '[VIEW]'}</span>
              <span>{showSecretWitnesses ? 'Mask Secret Values' : 'Inspect Local Witnesses'}</span>
            </button>
          </div>

          <div className="witness-fields-list">
            <div className="witness-field">
              <span className="witness-field-name">Private Reserves Witness:</span>
              <span className="witness-field-val font-mono">
                {showSecretWitnesses ? `${mockReserves.toLocaleString()} tNight` : '•••••••••••••••• [Witness Encapsulated]'}
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Private Liabilities Witness:</span>
              <span className="witness-field-val font-mono">
                {showSecretWitnesses ? `${mockLiabilities.toLocaleString()} tNight` : '•••••••••••••••• [Witness Encapsulated]'}
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Blinding Entropy (Salt):</span>
              <span className="witness-field-val font-mono text-xs text-slate-300 truncate">
                {showSecretWitnesses ? '0x9f8b4c2e1a7d658e3b0c2a5f... (32 bytes)' : '••••••••••••••••••••••••••••••••'}
              </span>
            </div>
          </div>

          <div className="witness-status-bar">
            <span className="status-indicator-dot dot-slate"></span>
            <span className="text-xs text-slate-400 font-mono">
              [MEMORY BOUNDARY] Never transmitted or persisted on-chain
            </span>
          </div>
        </div>

        {/* Clean Static Divider */}
        <div className="protocol-boundary-divider">
          <span className="boundary-text">ZK SNARK BOUNDARY</span>
        </div>

        {/* Right Side: Public On-Chain State */}
        <div className="comparison-box public-box">
          <div className="comparison-box-header">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-emerald-400">[LEDGER]</span>
              <span className="box-header-title text-slate-200">Public Ledger (Midnight Preprod State)</span>
            </div>
            <span className="public-live-tag font-mono">[PUBLIC RECORD]</span>
          </div>

          <div className="witness-fields-list">
            <div className="witness-field">
              <span className="witness-field-name">Solvency Assertion Status:</span>
              <span className="witness-field-val font-bold text-emerald-400 flex items-center gap-1 font-mono">
                <span>{isSolvent ? '[STATUS: VERIFIED SOLVENT]' : '[STATUS: UNVERIFIED]'}</span>
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Cryptographic Commitment Hash:</span>
              <span className="witness-field-val font-mono text-xs text-slate-300 truncate">
                0x678605e736b76aac95555f7b1b5940893de24decf...
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Verified Block Height:</span>
              <span className="witness-field-val font-mono text-slate-100">#900942</span>
            </div>
          </div>

          <div className="witness-status-bar">
            <span className="status-indicator-dot dot-emerald"></span>
            <span className="text-xs text-slate-400 font-mono">
              [ON-CHAIN] Consensus verifier validates Halo2 proof prior to commit
            </span>
          </div>
        </div>
      </div>

      <div className="inspector-footer-banner">
        <div className="flex items-start gap-2">
          <span className="font-mono text-xs text-slate-400 mt-0.5">[NOTE]</span>
          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <strong>Security Assertion:</strong> Observers receive mathematical certainty that the audited entity holds assets equal to or exceeding liabilities, with zero information leakage regarding absolute balance sheet magnitude.
          </div>
        </div>
      </div>
    </div>
  );
};
