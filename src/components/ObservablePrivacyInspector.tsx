import React, { useState } from 'react';
import { Eye, EyeOff, Shield, ShieldCheck, Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const ObservablePrivacyInspector: React.FC = () => {
  const [showSecretWitnesses, setShowSecretWitnesses] = useState(false);
  const [mockReserves, setMockReserves] = useState(12500000);
  const [mockLiabilities, setMockLiabilities] = useState(8750000);

  const isSolvent = mockReserves >= mockLiabilities;

  return (
    <div className="privacy-inspector-card">
      <div className="inspector-header">
        <div className="flex items-center gap-2">
          <div className="icon-badge icon-badge-cyan">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="inspector-title">Observable Privacy Behavior</h3>
            <p className="inspector-subtitle">Proof-of-Reserves Invariant: Proven Mathematically Without Disclosure</p>
          </div>
        </div>
        <div className="badge-pill badge-pill-cyan">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span>Zero Knowledge Guarantee</span>
        </div>
      </div>

      <div className="inspector-intro">
        <p>
          In traditional blockchains, proving you have enough funds requires publishing your balances publicly. On Midnight, the user proves that <code>total_reserves &gt;= total_liabilities</code> <strong>without anyone ever seeing the actual amounts</strong>.
        </p>
      </div>

      <div className="comparison-grid">
        {/* Left Side: Client Private Witness */}
        <div className="comparison-box private-box">
          <div className="comparison-box-header">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="box-header-title text-purple-300">Client Memory (Private Witness)</span>
            </div>
            <button
              onClick={() => setShowSecretWitnesses(!showSecretWitnesses)}
              className="witness-toggle-btn"
              title="Toggle private witness visibility for local demonstration"
            >
              {showSecretWitnesses ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 mr-1 text-purple-300" />
                  <span>Mask Secret Values</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1 text-purple-300" />
                  <span>Reveal Local Secrets</span>
                </>
              )}
            </button>
          </div>

          <div className="witness-fields-list">
            <div className="witness-field">
              <span className="witness-field-name">Private Reserves Witness:</span>
              <span className="witness-field-val font-mono">
                {showSecretWitnesses ? `${mockReserves.toLocaleString()} tNight` : '•••••••••••••••• (Encapsulated)'}
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Private Liabilities Witness:</span>
              <span className="witness-field-val font-mono">
                {showSecretWitnesses ? `${mockLiabilities.toLocaleString()} tNight` : '•••••••••••••••• (Encapsulated)'}
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Blinding Entropy (Salt):</span>
              <span className="witness-field-val font-mono text-xs text-purple-300 truncate">
                {showSecretWitnesses ? '0x9f8b4c2e1a7d658e3b0c2a5f... (32 bytes)' : '••••••••••••••••••••••••••••••••'}
              </span>
            </div>
          </div>

          <div className="witness-status-bar">
            <span className="status-indicator-dot dot-purple"></span>
            <span className="text-xs text-purple-300">
              Never transmitted to the network or written on-chain
            </span>
          </div>
        </div>

        <div className="arrow-divider">
          <div className="arrow-circle">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Right Side: Public On-Chain State */}
        <div className="comparison-box public-box">
          <div className="comparison-box-header">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="box-header-title text-emerald-300">On-Chain Ledger (What Observers See)</span>
            </div>
            <span className="public-live-tag">Globally Verifiable</span>
          </div>

          <div className="witness-fields-list">
            <div className="witness-field">
              <span className="witness-field-name">Public Solvency Assertion:</span>
              <span className="witness-field-val font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{isSolvent ? 'true (SOLVENT)' : 'false (UNVERIFIED)'}</span>
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Audit Anchor (Commitment):</span>
              <span className="witness-field-val font-mono text-xs text-cyan-300 truncate">
                0x678605e736b76aac95555f7b1b5940893de24decf...
              </span>
            </div>

            <div className="witness-field">
              <span className="witness-field-name">Freshness Block Height:</span>
              <span className="witness-field-val font-mono text-cyan-300">#900942</span>
            </div>
          </div>

          <div className="witness-status-bar">
            <span className="status-indicator-dot dot-emerald"></span>
            <span className="text-xs text-emerald-300">
              Immutable verification: Observers CANNOT determine balance figures
            </span>
          </div>
        </div>
      </div>

      <div className="inspector-footer-banner">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>Observable Privacy Behavior Verified:</strong> An on-chain observer sees that solvency passed with 100% mathematical certainty, yet has zero knowledge whether reserves were 12.5M, 500M, or 10B. <em>Privacy preserved; solvency guaranteed.</em>
          </div>
        </div>
      </div>
    </div>
  );
};
