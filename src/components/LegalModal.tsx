import React, { useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <div className="legal-modal-card">
        <div className="legal-modal-header">
          <div>
            <h3 id="legal-modal-title" className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Proofolio Institutional Governance &amp; Disclosures
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Protocol specifications, cryptographic disclosures, and terms of use
            </p>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <span className="font-mono text-sm text-slate-400 hover:text-white leading-none">✕</span>
          </button>
        </div>

        <div className="legal-tab-bar">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <span className="font-mono text-xs mr-1.5">[TERMS]</span>
            Terms of Service
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <span className="font-mono text-xs mr-1.5">[PRIVACY]</span>
            Zero-Knowledge Privacy Policy
          </button>
        </div>

        <div className="legal-modal-body">
          {activeTab === 'terms' ? (
            <div className="legal-section-content">
              <h4 className="legal-heading">1. Protocol Architecture &amp; Non-Custodial Nature</h4>
              <p className="legal-text">
                Proofolio is a decentralized, non-custodial zero-knowledge protocol deployed on the Midnight Network.
                Proofolio does not accept, hold, custody, or manage digital assets, private keys, or depository funds on
                behalf of any user or institution. All cryptographic circuits are executed client-side.
              </p>

              <h4 className="legal-heading">2. Mathematical Solvency Guarantees</h4>
              <p className="legal-text">
                The Proofolio verification circuits enforce mathematical assertions (such as <code>total_reserves &gt;= total_liabilities</code>)
                via zero-knowledge proofs. While cryptographic verification is deterministic and computationally sound, Proofolio
                makes no warranties regarding external physical asset backing or off-chain liabilities not committed to the circuit witness.
              </p>

              <h4 className="legal-heading">3. Regulatory &amp; Compliance Disclaimers</h4>
              <p className="legal-text">
                Users are solely responsible for ensuring that their utilization of zero-knowledge proof-of-reserves complies with
                local regulatory frameworks, including GAAP/IFRS audit standards, banking secrecy acts, and digital asset custody laws.
              </p>

              <h4 className="legal-heading">4. Limitation of Liability</h4>
              <p className="legal-text">
                Proofolio smart contracts and client tooling are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. In no event
                shall the developers, contributors, or Midnight Network maintainers be held liable for damages, smart contract bugs,
                or financial losses arising from protocol interactions.
              </p>
            </div>
          ) : (
            <div className="legal-section-content">
              <h4 className="legal-heading">1. Zero-Knowledge Witness Secrecy</h4>
              <p className="legal-text">
                Proofolio enforces absolute confidentiality. Private financial values (including raw reserve amounts, customer deposit
                liabilities, and blinding entropy salt) are processed exclusively in local client memory (RAM) via Midnight Compact
                witness bindings. These values are never broadcast, logged to analytics servers, or recorded on the blockchain ledger.
              </p>

              <h4 className="legal-heading">2. Public Ledger Transparency</h4>
              <p className="legal-text">
                The only parameters recorded on the public Midnight blockchain are:
              </p>
              <ul className="legal-bullet-list">
                <li><code>solvency_status</code>: A binary boolean flag certifying whether reserves met or exceeded liabilities at proof time.</li>
                <li><code>last_verified_block</code>: The block height at which the proof was verified by the network.</li>
                <li><code>commitment_hash</code>: A 32-byte cryptographic digest anchoring the audit witness state.</li>
              </ul>

              <h4 className="legal-heading">3. Telemetry &amp; Cookie Exemption</h4>
              <p className="legal-text">
                Proofolio employs zero advertising trackers, third-party behavioral analytics, or persistent browser tracking cookies.
                Wallet connections via Midnight Lace operate via standardized client-injected provider interfaces without third-party data broker transmission.
              </p>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          <span className="text-xs text-slate-400 font-mono">
            Document Version: 2026.1-Preprod • Midnight Network Compact v8.1
          </span>
          <button
            type="button"
            onClick={onClose}
            className="legal-ack-btn"
          >
            Acknowledge &amp; Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

