import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  ArrowRight,
  FileCheck,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useMidnight } from './hooks/useMidnight';
import { Layout } from './components/Layout';
import { WalletConnect } from './components/WalletConnect';
import { SolvencyGate } from './components/SolvencyGate';
import { CompactCodeViewer } from './components/CompactCodeViewer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { FeedbackModal } from './components/FeedbackModal';
import './index.css';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is Proofolio, and how does it prevent balance leakage?',
    answer:
      'Proofolio is a zero-knowledge solvency verifier built on the Midnight Network. Unlike legacy Proof-of-Reserves that require publishing sensitive wallet balances or full Merkle liability trees, Proofolio computes the solvency invariant (reserves >= liabilities) entirely inside your browser WebAssembly memory. Only a mathematical validity proof and a 32-byte commitment are anchored on-chain.',
  },
  {
    question: 'What is the difference between private witness and public ledger state?',
    answer:
      'The private witness consists of your total reserves, customer liabilities, and a 32-byte cryptographic salt. These values are never sent over the network, never logged, and never stored on-chain. The public ledger state records only a binary boolean flag (solvency_status = true), the block height of verification, and the collision-resistant commitment hash.',
  },
  {
    question: 'Can an institution generate a valid proof if liabilities exceed reserves?',
    answer:
      'No. The underlying Halo2 / PLONK arithmetic constraint in the Compact smart contract strictly asserts that total_reserves >= total_liabilities. If liabilities exceed reserves by even 1 unit, the polynomial constraints cannot be satisfied, causing the prover to fail locally without creating any on-chain attestation.',
  },
  {
    question: 'How do auditors and depositors verify an existing proof?',
    answer:
      'Anyone can query the Midnight Indexer GraphQL endpoint or inspect the public ledger state of the deployed Proofolio contract. The attestation proves that at the recorded block height, the custodian possessed sufficient reserve assets to back all customer liabilities.',
  },
  {
    question: 'Where is the Proofolio smart contract deployed?',
    answer:
      'Proofolio is currently deployed on the Midnight Preprod and Preview networks at contract address 25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d. You can inspect its contract actions directly via the Midnight Indexer GraphQL API.',
  },
];

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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
      {/* Hero Section: Immediately answers What, How, and Next Step */}
      <section className="hero-section">
        <div className="hero-pill">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Midnight Network &bull; Zero-Knowledge Solvency Verification</span>
        </div>

        <h1 className="hero-title">
          Confidential Solvency Verification
          <span style={{ display: 'block', marginTop: '0.2rem' }}>for Digital Asset Institutions</span>
        </h1>

        <p className="hero-subtitle">
          Prove 100%+ customer reserve backing with mathematical certainty on Midnight. Your balances, customer liability lists, and asset allocations remain confidential inside local browser memory.
        </p>

        {/* Primary Action Group: Unmistakable Next Steps */}
        <div className="hero-cta-group">
          <a href="#prover-app" className="hero-cta-primary">
            <span>Launch Solvency Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {!isConnected && (
            <button
              type="button"
              onClick={() => connectDemoWallet()}
              className="hero-cta-secondary"
              title="Launch instant testing sandbox with demo keys"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Instant Sandbox</span>
            </button>
          )}

          <a href="#how-it-works" className="hero-cta-secondary">
            <span>How Verification Works</span>
          </a>
        </div>

        {/* 3 Questions Quick-Answer Bar */}
        <div className="hero-trio-grid">
          <div className="hero-trio-card">
            <div className="trio-badge">1. What is Proofolio?</div>
            <div className="trio-title">Zero-Knowledge Proof of Solvency</div>
            <p className="trio-desc">
              A privacy-preserving protocol on Midnight proving asset reserves exceed liabilities without disclosing financial records or wallet holdings.
            </p>
          </div>

          <div className="hero-trio-card">
            <div className="trio-badge">2. How does it work?</div>
            <div className="trio-title">Client Witness + Halo2 Circuit</div>
            <p className="trio-desc">
              Your balance sheet stays in local RAM. A zk-SNARK circuit asserts <code>reserves &gt;= liabilities</code> and publishes an immutable attestation on-chain.
            </p>
          </div>

          <div className="hero-trio-card">
            <div className="trio-badge">3. What should I do next?</div>
            <div className="trio-title">Configure &amp; Generate Proof</div>
            <p className="trio-desc">
              Connect your Lace wallet (or run the instant sandbox), test your balance sheet scenario, and verify solvency on Midnight Preprod in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Public Ledger State Ribbon */}
      <section className="ledger-banner" aria-label="On-chain ledger state status">
        <div className="ledger-banner-left">
          <div className="ledger-banner-item">
            <span className="ledger-banner-label">Network &amp; Ledger Status</span>
            <div className="ledger-banner-value">
              <span className="pulse-dot" />
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
          <span className="section-tag">Interactive Terminal</span>
          <h2 className="section-title">Zero-Knowledge Solvency Terminal</h2>
          <p className="section-desc">
            Connect your wallet provider, configure your balance sheet, and generate a client-side zero-knowledge proof.
          </p>
        </div>

        {/* Signer Connection Panel */}
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

        {/* Dual-State Solvency Gate */}
        <SolvencyGate
          contractAddress={contractAddress}
          isConnected={isConnected}
          walletAddress={walletAddress}
          isProving={isProving}
          provingStep={provingStep}
          txResult={txResult}
          onConnectWallet={() => connectDemoWallet()}
          onCallCircuit={(reserves, liabilities) => {
            callVerifySolvencyCircuit(reserves, liabilities);
          }}
          onOpenCertificateModal={() => setCertificateModalOpen(true)}
        />
      </section>

      {/* How It Works: Short, Understandable Sequence */}
      <section className="section-container" id="how-it-works">
        <div className="section-heading-group">
          <span className="section-tag">Verification Protocol</span>
          <h2 className="section-title">The Three-Stage Proving Sequence</h2>
          <p className="section-desc">
            A privacy-preserving cryptographic pipeline designed for institutional compliance without public exposure.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-header">
              <div className="feature-card-icon">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="step-counter">Step 01</span>
            </div>
            <h3 className="feature-card-title">1. Private Client Witness</h3>
            <p className="feature-card-body">
              Custodian reserve balances and customer deposit liabilities are loaded strictly into your browser's ephemeral WebAssembly memory. Raw balance sheet numbers never leave your device.
            </p>
            <div className="feature-card-footer">
              <span className="visibility-badge private-tag">Confidential (RAM)</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-header">
              <div className="feature-card-icon">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="step-counter">Step 02</span>
            </div>
            <h3 className="feature-card-title">2. Zero-Knowledge Circuit</h3>
            <p className="feature-card-body">
              Midnight's Compact circuit executes the mathematical constraint (<code>total_reserves &gt;= total_liabilities</code>) using Halo2 zk-SNARKs. If liabilities exceed reserves, the proof fails locally.
            </p>
            <div className="feature-card-footer">
              <span className="visibility-badge circuit-tag">Halo2 Prover Engine</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-header">
              <div className="feature-card-icon">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="step-counter">Step 03</span>
            </div>
            <h3 className="feature-card-title">3. Public Ledger Attestation</h3>
            <p className="feature-card-body">
              The verified proof and a 32-byte cryptographic commitment digest are settled on Midnight Preprod. External counterparties, auditors, and DAOs verify solvency without seeing reserve sizes.
            </p>
            <div className="feature-card-footer">
              <span className="visibility-badge public-tag">Public Consensus State</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-State Ledger Architecture & Privacy Guarantee */}
      <section className="section-container" id="privacy-model">
        <div className="section-heading-group">
          <span className="section-tag">Privacy Architecture</span>
          <h2 className="section-title">Public vs. Private Ledger Domain Separation</h2>
          <p className="section-desc">
            Strict isolation between client-side private witness memory and publicly verifiable on-chain consensus state.
          </p>
        </div>

        <div className="table-card">
          <table className="clean-table" role="table">
            <thead>
              <tr>
                <th style={{ width: '22%' }} scope="col">Protocol Dimension</th>
                <th style={{ width: '39%' }} scope="col">Private Witness Space (Browser Wasm)</th>
                <th style={{ width: '39%' }} scope="col">Public Ledger State (Midnight Preprod)</th>
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
                <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Institutional Protection</td>
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

      {/* Frequently Asked Questions Accordion */}
      <section className="section-container" id="faq">
        <div className="section-heading-group">
          <span className="section-tag">Institutional FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Common questions regarding zero-knowledge proofs, cryptographic assumptions, and Midnight ledger integration.
          </p>
        </div>

        <div className="faq-container">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggleFaq(idx)}
                aria-expanded={expandedFaq === idx}
              >
                <span>{item.question}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="faq-answer-content">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
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
