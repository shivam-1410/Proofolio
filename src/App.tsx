import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  ArrowRight,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { useMidnight } from './hooks/useMidnight';
import { Layout } from './components/Layout';
import { WalletConnect } from './components/WalletConnect';
import { SolvencyGate } from './components/SolvencyGate';
import { CompactCodeViewer } from './components/CompactCodeViewer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { FeedbackModal } from './components/FeedbackModal';
import './index.css';

export const App: React.FC = () => {
  const {
    isConnected,
    walletAddress,
    shieldedAddress,
    networkId,
    setNetworkId,
    isConnecting,
    error,
    setError,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
    contractAddress,
    ledgerState,
    isLoadingLedger,
    fetchLedgerState,
    isProving,
    provingStep,
    txResult,
    callVerifySolvencyCircuit,
  } = useMidnight();

  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const truncate = (val: string, start = 8, end = 6) => {
    if (!val || val.length <= start + end) return val;
    return `${val.slice(0, start)}...${val.slice(-end)}`;
  };

  return (
    <Layout
      networkId={networkId}
      contractAddress={contractAddress}
      onOpenFeedback={() => setFeedbackModalOpen(true)}
      onOpenCertificate={() => setCertificateModalOpen(true)}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Zero-Knowledge Proof of Solvency</span>
        </div>
        <h1 className="hero-title">
          Confidential Solvency Verification for Web3 Institutions
        </h1>
        <p className="hero-subtitle">
          Proofolio allows custodians, exchanges, and DeFi protocols to mathematically prove 100%+ reserve backing on Cardano's Midnight Network with zero disclosure of customer deposits or private asset balances.
        </p>
        <div className="hero-cta-group">
          <a href="#prover-app" className="hero-cta-primary">
            <span>Launch Solvency Verifier</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#how-it-works" className="hero-cta-secondary">
            <span>How It Works</span>
          </a>
        </div>
        <div className="hero-features">
          <div className="hero-feature-item">
            <span className="feature-dot">&bull;</span>
            <span>100% Client-Side ZK Witness</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-dot">&bull;</span>
            <span>Halo2 / PLONK Arithmetic Circuit</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-dot">&bull;</span>
            <span>Cardano Midnight Preprod Network</span>
          </div>
        </div>
      </section>

      {/* Public Ledger State Ribbon */}
      <section className="ledger-banner">
        <div className="ledger-banner-left">
          <div className="ledger-banner-item">
            <span className="ledger-banner-label">Network &amp; Ledger Status</span>
            <div className="ledger-banner-value">
              <span className="pulse-dot"></span>
              <span className="text-emerald-400 font-mono">
                {ledgerState?.solvency_status ? 'SOLVENT (100%+ Backed)' : 'ACTIVE'}
              </span>
            </div>
          </div>

          <div className="ledger-banner-item">
            <span className="ledger-banner-label">Last Verified Block</span>
            <div className="ledger-banner-value font-mono">
              #{ledgerState?.last_verified_block || '900942'}
            </div>
          </div>

          <div className="ledger-banner-item">
            <span className="ledger-banner-label">Preprod Contract</span>
            <div className="ledger-banner-value font-mono" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {truncate(contractAddress, 10, 6)}
            </div>
          </div>
        </div>

        <div className="ledger-banner-actions">
          <button
            type="button"
            onClick={fetchLedgerState}
            disabled={isLoadingLedger}
            className="nav-btn"
            title="Refresh state from Midnight Preprod indexer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLedger ? 'animate-spin' : ''}`} />
            <span>{isLoadingLedger ? 'Syncing...' : 'Sync State'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCertificateModalOpen(true)}
            className="nav-btn nav-btn-primary"
            title="View Verifiable Cryptographic Audit Certificate"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Audit Certificate</span>
          </button>
        </div>
      </section>

      {/* Core Interactive Verifier Application */}
      <section className="section-container" id="prover-app">
        <div className="section-heading-group">
          <span className="section-tag">Interactive Verifier Application</span>
          <h2 className="section-title">Zero-Knowledge Solvency Terminal</h2>
          <p className="section-desc">
            Connect your wallet provider, configure your balance sheet, and generate a client-side zero-knowledge proof.
          </p>
        </div>

        <WalletConnect
          isConnected={isConnected}
          walletAddress={walletAddress}
          shieldedAddress={shieldedAddress}
          networkId={networkId}
          isConnecting={isConnecting}
          error={error}
          onConnect={() => connectWallet()}
          onConnectDemo={() => connectDemoWallet()}
          onDisconnect={disconnectWallet}
          onClearError={() => setError(null)}
          onSwitchNetwork={(net) => setNetworkId(net)}
        />

        <SolvencyGate
          contractAddress={contractAddress}
          isConnected={isConnected}
          isProving={isProving}
          provingStep={provingStep}
          txResult={txResult}
          onCallCircuit={callVerifySolvencyCircuit}
          onOpenCertificateModal={() => setCertificateModalOpen(true)}
        />
      </section>

      {/* How It Works Section */}
      <section className="section-container" id="how-it-works">
        <div className="section-heading-group">
          <span className="section-tag">Protocol Architecture</span>
          <h2 className="section-title">How Proofolio Works</h2>
          <p className="section-desc">
            A three-stage cryptographic verification pipeline engineered for institutional confidentiality and public verifiability.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="feature-card-title">1. Private Client Witness</h3>
            <p className="feature-card-body">
              Custodian reserve balances and customer deposit liabilities are loaded strictly into your browser's ephemeral WebAssembly memory. Raw balance sheet numbers never leave your device.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="feature-card-title">2. Zero-Knowledge Circuit</h3>
            <p className="feature-card-body">
              Midnight's Compact circuit executes the mathematical constraint (<code>total_reserves &gt;= total_liabilities</code>) using Halo2 zk-SNARKs. If liabilities exceed reserves, the proof fails locally.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="feature-card-title">3. Public Ledger Attestation</h3>
            <p className="feature-card-body">
              The verified proof and a 32-byte cryptographic commitment digest are settled on Midnight Preprod. External counterparties, auditors, and DAOs verify solvency without seeing reserve sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Dual-State Ledger Architecture & Privacy Guarantee */}
      <section className="section-container" id="privacy-model">
        <div className="section-heading-group">
          <span className="section-tag">Cryptographic Guarantees</span>
          <h2 className="section-title">Dual-State Ledger Architecture</h2>
          <p className="section-desc">
            Strict isolation between client-side private witness memory and publicly verifiable on-chain state.
          </p>
        </div>

        <div className="table-card">
          <table className="clean-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Protocol Dimension</th>
                <th style={{ width: '39%' }}>Private Witness Space (Browser Wasm)</th>
                <th style={{ width: '39%' }}>Public Ledger State (Midnight Preprod)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Balance Sheet Data</td>
                <td>
                  <span className="visibility-tag visibility-private" style={{ marginBottom: '0.35rem' }}>Private Witness</span>
                  <div>
                    <code>total_reserves</code> &amp; <code>total_liabilities</code> amounts remain strictly in ephemeral client memory. Never transmitted over RPC or network.
                  </div>
                </td>
                <td>
                  <span className="visibility-tag visibility-public" style={{ marginBottom: '0.35rem' }}>Public State</span>
                  <div>
                    <code>solvency_status: Boolean</code>. Binary attestation publicly readable by indexers, smart contracts, and institutional auditors.
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Audit Commitment</td>
                <td>
                  <span className="visibility-tag visibility-private" style={{ marginBottom: '0.35rem' }}>Private Blinding</span>
                  <div>
                    <code>salt: Bytes&lt;32&gt;</code> randomly sampled on client. Ensures each proof round is uncorrelatable and unlinkable across verification epochs.
                  </div>
                </td>
                <td>
                  <span className="visibility-tag visibility-public" style={{ marginBottom: '0.35rem' }}>Public Digest</span>
                  <div>
                    <code>commitment_hash: Bytes&lt;32&gt;</code> computed via collision-resistant persistent hash, binding the private inputs immutably on-chain.
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Verification Logic</td>
                <td>
                  <span className="visibility-tag visibility-private" style={{ marginBottom: '0.35rem' }}>Local Prover</span>
                  <div>
                    <code>assert(reserves &gt;= liabilities)</code> enforced by Halo2 arithmetic circuit. Invalid balance sheets cannot construct a valid proof.
                  </div>
                </td>
                <td>
                  <span className="visibility-tag visibility-public" style={{ marginBottom: '0.35rem' }}>Consensus Verifier</span>
                  <div>
                    Midnight validators verify polynomial proof commitments and anchor state transition at <code>last_verified_block</code>.
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Institutional Use Case</td>
                <td>
                  <span className="visibility-tag visibility-private" style={{ marginBottom: '0.35rem' }}>Commercial Privacy</span>
                  <div>
                    Protects proprietary trading desk strategies, treasury sizes, and individual client balances from counterparty frontrunning.
                  </div>
                </td>
                <td>
                  <span className="visibility-tag visibility-public" style={{ marginBottom: '0.35rem' }}>Programmable Gate</span>
                  <div>
                    DeFi lending vaults, prime brokers, and DAO governance gates can programmatically verify solvency before allocating liquidity.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Midnight Compact Smart Contract Source Code Explorer */}
      <CompactCodeViewer />

      {/* Modals */}
      <AuditCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        txResult={txResult}
        contractAddress={contractAddress}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </Layout>
  );
};

export default App;
