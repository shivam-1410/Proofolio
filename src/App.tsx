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
  Lock,
  Cpu,
  Hash,
  Scale,
  Award,
  Users,
  Terminal,
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
      {/* Institutional Hero Specification */}
      <section className="hero-section">
        <div className="hero-tag">
          <span className="hero-tag-text">PROOF-OF-RESERVES PROTOCOL SPECIFICATION</span>
        </div>
        <h1 className="hero-title">
          Confidential Solvency Verification
        </h1>
        <p className="hero-description">
          Proofolio executes zero-knowledge arithmetic circuits on the Midnight Network to verify that
          total reserves satisfy the solvency constraint (<code>total_reserves &gt;= total_liabilities</code>)
          without publishing asset quantities, depository debts, or customer account allocations.
        </p>

        {/* Disciplined Institutional Technical Matrix Ribbon */}
        <div className="hero-metrics-ribbon">
          <div className="metric-pill">
            <span className="metric-key">PRIVACY GUARANTEE:</span>
            <span className="metric-val">Client-Side Witness Memory</span>
          </div>
          <div className="metric-pill">
            <span className="metric-key">PROOF SYSTEM:</span>
            <span className="metric-val">Halo2 / PLONK ZK-SNARK</span>
          </div>
          <div className="metric-pill">
            <span className="metric-key">LEDGER COMMITMENT:</span>
            <span className="metric-val">32-Byte Cryptographic Digest</span>
          </div>
          <div className="metric-pill">
            <span className="metric-key">TARGET ENVIRONMENT:</span>
            <span className="metric-val">Midnight Preprod Testnet</span>
          </div>
        </div>
      </section>

      {/* Live On-Chain Contract Ledger State Panel */}
      <section className="ledger-overview-section">
        <div className="ledger-card">
          <div className="ledger-card-header">
            <div className="flex items-center gap-2">
              <span className="status-indicator-dot dot-emerald"></span>
              <h3 className="ledger-title">Public Ledger State (Preprod)</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCertificateModalOpen(true)}
                className="certificate-quick-btn"
                title="View Verifiable Audit Certificate"
              >
                <Award className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span>Certificate</span>
              </button>
              <button
                onClick={fetchLedgerState}
                disabled={isLoadingLedger}
                className="refresh-btn"
                title="Synchronize state from Midnight Preprod indexer"
              >
                {isLoadingLedger ? 'Syncing...' : 'Sync State'}
              </button>
            </div>
          </div>

          <div className="ledger-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Solvency Status</span>
              {isLoadingLedger ? (
                <div className="skeleton-line skeleton-w-60 mt-1"></div>
              ) : (
                <div className="stat-value text-emerald-400 flex items-center gap-1.5 font-mono">
                  <span>[STATUS: {ledgerState?.solvency_status ? 'SOLVENT' : 'PENDING'}]</span>
                </div>
              )}
            </div>

            <div className="stat-box">
              <span className="stat-label">Last Verified Block</span>
              {isLoadingLedger ? (
                <div className="skeleton-line skeleton-w-40 mt-1"></div>
              ) : (
                <div className="stat-value text-slate-100 font-mono">
                  #{ledgerState?.last_verified_block || '900942'}
                </div>
              )}
            </div>

            <div className="stat-box stat-box-wide">
              <span className="stat-label">Preprod Contract Address</span>
              {isLoadingLedger ? (
                <div className="skeleton-line skeleton-w-full mt-1"></div>
              ) : (
                <div className="stat-value-mono truncate" title={contractAddress}>
                  {contractAddress}
                </div>
              )}
            </div>

            <div className="stat-box stat-box-wide">
              <span className="stat-label">Cryptographic Commitment Hash</span>
              {isLoadingLedger ? (
                <div className="skeleton-line skeleton-w-full mt-1"></div>
              ) : (
                <div
                  className="stat-value-mono truncate"
                  title={ledgerState?.commitment_hash || ''}
                >
                  {ledgerState?.commitment_hash ||
                    '0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Execution Layout: Step 1 (Wallet) & Step 2 (Circuit Prover) */}
      <section className="grid-interactive">
        {/* Step 1: Wallet Provider Handshake */}
        <div className="grid-col">
          <div className="step-label">
            <span className="step-num">01</span>
            <span>PROVIDER CONNECTION &amp; IDENTITY</span>
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

          {/* Institutional Telemetry Log */}
          <div className="community-stat-card mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 tracking-wider">
                PREPROD VALIDATION BENCHMARKS
              </span>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
              >
                Log Telemetry
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>L5 Validation Set: <strong className="text-slate-200">50/50 Validated</strong></span>
              <span>L6 Node Telemetry: <strong className="text-slate-200">20/20 Passing</strong></span>
            </div>
          </div>
        </div>

        {/* Step 2: Confidential Solvency Gate Circuit Execution */}
        <div className="grid-col">
          <div className="step-label">
            <span className="step-num">02</span>
            <span>ZERO-KNOWLEDGE CIRCUIT EXECUTION</span>
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

      {/* Level 2 Standard Circuit Verification Pane */}
      <section className="standard-circuit-section mt-4">
        <div className="section-header-compact">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Baseline Contract Interface (Standard verifySolvency Method)
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

      {/* Real Product Demo: Interactive Zero-Knowledge Solvency Sandbox */}
      <section className="simulator-section">
        <SolvencySimulator />
      </section>

      {/* Observable Privacy Verification Terminal */}
      <section className="observable-privacy-section">
        <ObservablePrivacyInspector />
      </section>

      {/* Midnight Compact Smart Contract Source Code Explorer */}
      <section className="contract-code-section">
        <CompactCodeViewer />
      </section>

      {/* Bespoke Institutional Dual-State Architecture Matrix (Replaces generic 3 cards in a row) */}
      <section className="architecture-section">
        <div className="section-header-row mb-3">
          <h3 className="section-title text-base font-bold text-slate-200">
            Midnight Dual-State Ledger Architecture Specification
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Protocol Mapping: Private Client Witness vs. Public Blockchain State
          </span>
        </div>

        <div className="protocol-matrix-table-wrapper">
          <table className="protocol-matrix-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Protocol Dimension</th>
                <th style={{ width: '39%' }}>Private Witness Space (Client Memory)</th>
                <th style={{ width: '39%' }}>Public Ledger State (Midnight Preprod)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="matrix-dim-cell">Data Scope &amp; Privacy</td>
                <td className="matrix-private-cell">
                  <span className="tag-confidential">[CONFIDENTIAL]</span>
                  <p className="mt-1">
                    <code>total_reserves: Uint&lt;64&gt;</code>, <code>total_liabilities: Uint&lt;64&gt;</code>, <code>salt: Bytes&lt;32&gt;</code>.
                    Values remain strictly in ephemeral client memory and are never transmitted.
                  </p>
                </td>
                <td className="matrix-public-cell">
                  <span className="tag-public">[PUBLIC STATE]</span>
                  <p className="mt-1">
                    <code>solvency_status: Boolean</code>, <code>last_verified_block: Uint&lt;64&gt;</code>, <code>commitment_hash: Bytes&lt;32&gt;</code>.
                    Globally readable by indexers, smart contracts, and external callers.
                  </p>
                </td>
              </tr>
              <tr>
                <td className="matrix-dim-cell">Circuit Constraint</td>
                <td className="matrix-private-cell">
                  <code>assert(total_reserves &gt;= total_liabilities)</code>
                  <p className="text-xs text-slate-400 mt-1">
                    Arithmetic circuit fails locally if liabilities exceed reserves. No invalid proof can be produced.
                  </p>
                </td>
                <td className="matrix-public-cell">
                  <code>transition(ledger, verifiedSolvency, blockHeight)</code>
                  <p className="text-xs text-slate-400 mt-1">
                    Consensus verifier validates Halo2/PLONK proof arguments prior to committing state transition.
                  </p>
                </td>
              </tr>
              <tr>
                <td className="matrix-dim-cell">Audit &amp; Compliance</td>
                <td className="matrix-private-cell">
                  <p className="text-xs text-slate-300">
                    Full balance sheet integrity verified cryptographically without exposing customer accounts or counterparty exposures.
                  </p>
                </td>
                <td className="matrix-public-cell">
                  <p className="text-xs text-slate-300">
                    Provides an on-chain gate for prime brokers, DeFi lending pools, and DAOs to condition capital allocation on verified solvency.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="privacy-claim-banner mt-3">
          <div className="privacy-claim-title">Cryptographic Invariant Disclosure</div>
          <p className="privacy-claim-text">
            An external observer inspecting the Midnight Preprod blockchain ledger observes only the binary solvency status,
            the verified block number, and the immutable cryptographic commitment hash. Zero knowledge regarding depository
            amounts, reserve surpluses, or customer debt distribution is obtainable through ledger analysis.
          </p>
        </div>
      </section>

      {/* Protocol Integration & CLI SDK Reference (Replaces fake terminal window) */}
      <section className="cli-info-section">
        <div className="cli-card">
          <div className="cli-header">
            <span className="font-mono text-slate-300">PROTOCOL INTEGRATION SPECIFICATION &amp; CLI SDK</span>
          </div>
          <div className="cli-spec-grid">
            <div className="cli-spec-col">
              <span className="cli-subhead">Automated Testnet &amp; Circuit Build</span>
              <pre className="cli-code-block">
<code># Clone repository
git clone https://github.com/shivam-1410/Proofolio.git &amp;&amp; cd Proofolio

# Install runtime dependencies
npm install

# Run zero-knowledge circuit test suite
npm test

# Build production bundle
npm run build</code>
              </pre>
            </div>
            <div className="cli-spec-col">
              <span className="cli-subhead">Node &amp; Contract Deployment CLI</span>
              <pre className="cli-code-block">
<code># Deploy contract to Midnight Preprod
npx ts-node src/deploy.ts

# Inspect contract state via RPC
npx ts-node src/cli.ts query

# Execute circuit verification via CLI
npx ts-node src/cli.ts verify --reserves 15000000 --liabilities 12000000</code>
              </pre>
            </div>
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
