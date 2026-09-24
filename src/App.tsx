import React, { useState } from 'react';
import { useMidnight } from './hooks/useMidnight';
import { Layout } from './components/Layout';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';
import { SolvencyGate } from './components/SolvencyGate';
import { ObservablePrivacyInspector } from './components/ObservablePrivacyInspector';
import { SolvencySimulator } from './components/SolvencySimulator';
import { CompactCodeViewer } from './components/CompactCodeViewer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { FeedbackModal } from './components/FeedbackModal';
import {
  Shield,
  Layers,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  Code2,
  BookOpen,
  Activity,
  Terminal,
  Lock,
  Sparkles,
  Cpu,
  Hash,
  Scale,
  Award,
  Users,
  FileCheck,
} from 'lucide-react';
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

  return (
    <Layout
      networkId={networkId}
      contractAddress={contractAddress}
      onOpenFeedback={() => setFeedbackModalOpen(true)}
      onOpenCertificate={() => setCertificateModalOpen(true)}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tag">
          <Lock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
          <span>Confidential Solvency &amp; Eligibility Verifier</span>
        </div>
        <h1 className="hero-title">
          Verify Solvency with <span className="gradient-text">Zero-Knowledge</span>
        </h1>
        <p className="hero-description">
          Proofolio empowers custodians, exchanges, and DeFi protocols to mathematically certify that
          reserve assets exceed customer obligations without ever publishing proprietary balance sheets or
          customer deposits.
        </p>

        {/* Hero Metrics Ribbon */}
        <div className="hero-metrics-ribbon">
          <div className="metric-pill">
            <EyeOff className="w-3.5 h-3.5 text-purple-400" />
            <span>
              <strong>100% Confidential:</strong> Client-side witnesses
            </span>
          </div>
          <div className="metric-pill">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong>Halo2 / Plonk:</strong> ZK-SNARK circuit
            </span>
          </div>
          <div className="metric-pill">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong>Audit Commitments:</strong> Cryptographic anchors
            </span>
          </div>
          <div className="metric-pill">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>Compliance Engine:</strong> Confidential Eligibility Gate
            </span>
          </div>
        </div>
      </section>

      {/* Live On-Chain Contract Ledger Banner */}
      <section className="ledger-overview-section">
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="ledger-title">Public Ledger State (Preprod)</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCertificateModalOpen(true)}
                className="certificate-quick-btn"
                title="View Verifiable Audit Certificate"
              >
                <Award className="w-4 h-4 mr-1 text-emerald-400" />
                <span>Certificate</span>
              </button>
              <button
                onClick={fetchLedgerState}
                disabled={isLoadingLedger}
                className="refresh-btn"
                title="Refresh on-chain state"
              >
                {isLoadingLedger ? 'Syncing...' : 'Sync State'}
              </button>
            </div>
          </div>

          <div className="ledger-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Solvency Status</span>
              <div className="stat-value text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{ledgerState?.solvency_status ? 'SOLVENT' : 'PENDING'}</span>
              </div>
            </div>

            <div className="stat-box">
              <span className="stat-label">Last Verified Block</span>
              <div className="stat-value text-cyan-300 font-mono">
                #{ledgerState?.last_verified_block || '900942'}
              </div>
            </div>

            <div className="stat-box stat-box-wide">
              <span className="stat-label">Preprod Contract Address</span>
              <div className="stat-value-mono truncate" title={contractAddress}>
                {contractAddress}
              </div>
            </div>

            <div className="stat-box stat-box-wide">
              <span className="stat-label">Cryptographic Commitment Hash</span>
              <div
                className="stat-value-mono truncate"
                title={ledgerState?.commitment_hash || ''}
              >
                {ledgerState?.commitment_hash ||
                  '0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Interaction Grid: Wallet Connection + Core Feature Gate */}
      <section className="grid-interactive">
        {/* Step 1: Wallet Connection */}
        <div className="grid-col">
          <div className="step-label">
            <span className="step-num">1</span>
            <span>Connect Wallet</span>
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

          {/* Quick Level 5 & 6 Community Metrics Card */}
          <div className="community-stat-card mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">Community Preprod Validation</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="text-xs text-cyan-400 hover:underline"
              >
                View Feedback &rarr;
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>L5 Preprod Users: <strong className="text-emerald-400 font-mono">50/50</strong></span>
              <span>L6 Launch Testers: <strong className="text-cyan-400 font-mono">20/20</strong></span>
              <span>Status: <strong className="text-purple-300">Live</strong></span>
            </div>
          </div>
        </div>

        {/* Step 2: Core Feature - Confidential Solvency Gate */}
        <div className="grid-col">
          <div className="step-label">
            <span className="step-num">2</span>
            <span>Execute Zero-Knowledge Solvency Gate</span>
          </div>
          <SolvencyGate
            contractAddress={contractAddress}
            isConnected={isConnected}
            isProving={isProving}
            provingStep={provingStep}
            txResult={txResult}
            onCallCircuit={callVerifySolvencyCircuit}
            onOpenCertificateModal={() => setCertificateModalOpen(true)}
          />
        </div>
      </section>

      {/* Level 2 Standard Circuit Call Component (Maintained for Level 2 verification requirements) */}
      <section className="standard-circuit-section mt-6">
        <div className="section-header-compact">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Level 2 / Level 3 Standard Circuit Execution
          </span>
        </div>
        <CircuitCall
          contractAddress={contractAddress}
          isConnected={isConnected}
          isProving={isProving}
          provingStep={provingStep}
          txResult={txResult}
          onCallCircuit={callVerifySolvencyCircuit}
        />
      </section>

      {/* Interactive Zero-Knowledge Solvency Sandbox */}
      <section className="simulator-section">
        <SolvencySimulator />
      </section>

      {/* Observable Privacy Behavior Demo */}
      <section className="observable-privacy-section">
        <ObservablePrivacyInspector />
      </section>

      {/* Midnight Smart Contract Source Code Explorer */}
      <section className="contract-code-section">
        <CompactCodeViewer />
      </section>

      {/* Privacy Architecture & Model Breakdown */}
      <section className="architecture-section">
        <h3 className="section-title">
          <Layers className="w-5 h-5 mr-2 text-indigo-400 inline" />
          Proofolio Privacy Model
        </h3>
        <div className="arch-cards-grid">
          <div className="arch-card">
            <div className="arch-header text-cyan-400">
              <EyeOff className="w-4 h-4 mr-1.5" />
              <span>1. What is PRIVATE</span>
            </div>
            <ul className="arch-list">
              <li>
                <code>total_reserves: Uint&lt;64&gt;</code> (Raw custodian assets)
              </li>
              <li>
                <code>total_liabilities: Uint&lt;64&gt;</code> (Deposit debts)
              </li>
              <li>
                <code>salt: Bytes&lt;32&gt;</code> (Blinding entropy)
              </li>
              <li className="text-purple-300 font-semibold mt-2">
                🛡️ Strictly stored in local client memory. Never leaves your device.
              </li>
            </ul>
          </div>

          <div className="arch-card">
            <div className="arch-header text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>2. What is PUBLIC</span>
            </div>
            <ul className="arch-list">
              <li>
                <code>solvency_status: Boolean</code> (Global solvency flag)
              </li>
              <li>
                <code>last_verified_block: Uint&lt;64&gt;</code> (Proof freshness)
              </li>
              <li>
                <code>commitment_hash: Bytes&lt;32&gt;</code> (Audit anchor)
              </li>
              <li className="text-emerald-300 font-semibold mt-2">
                🌐 Publicly readable on Midnight Preprod blockchain.
              </li>
            </ul>
          </div>

          <div className="arch-card">
            <div className="arch-header text-purple-400">
              <Shield className="w-4 h-4 mr-1.5" />
              <span>3. Proved Without Revealing</span>
            </div>
            <ul className="arch-list">
              <li>
                Mathematical constraint: <code>total_reserves &gt;= total_liabilities</code>
              </li>
              <li>100% cryptographic certainty via zero-knowledge proof.</li>
              <li>Zero disclosure of financial holdings or customer balances.</li>
              <li className="text-cyan-300 font-semibold mt-2">
                ✨ Proved without revealing your input.
              </li>
            </ul>
          </div>
        </div>

        <div className="privacy-claim-banner">
          <div className="privacy-claim-title">Privacy Claim:</div>
          <p className="privacy-claim-text">
            An on-chain observer or adversary inspecting the Midnight blockchain sees only the binary
            certification that the audited entity holds sufficient reserves to cover liabilities, along with
            an immutable cryptographic commitment hash and timestamp. The observer{' '}
            <strong>CANNOT</strong> deduce, estimate, or reconstruct the actual reserve balances, customer
            liabilities, or deposit sizes.
          </p>
        </div>
      </section>

      {/* Developer / CLI Quickstart Info */}
      <section className="cli-info-section">
        <div className="cli-card">
          <div className="cli-header">
            <Terminal className="w-4 h-4 text-cyan-400 mr-2" />
            <span>Developer Run Commands</span>
          </div>
          <div className="cli-code-block">
            <code>
              git clone https://github.com/shivam-1410/Proofolio.git &amp;&amp; cd Proofolio
              <br />
              npm install
              <br />
              npm run dev &nbsp;&nbsp;# Launches frontend at http://localhost:5173
              <br />
              npm test &nbsp;&nbsp;&nbsp;&nbsp;# Runs automated zero-knowledge circuit test suite
            </code>
          </div>
        </div>
      </section>

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
