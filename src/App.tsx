import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';
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
} from 'lucide-react';
import './index.css';

export const App: React.FC = () => {
  const {
    isConnected,
    walletAddress,
    shieldedAddress,
    networkId,
    isConnecting,
    error,
    setError,
    connectWallet,
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

  return (
    <div className="app-container">
      {/* Background glowing gradients */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-content">
          <div className="brand-group">
            <div className="brand-logo-container">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="brand-name-row">
                <span className="brand-title">Proofolio</span>
                <span className="brand-version-tag">Level 2 dApp</span>
              </div>
              <span className="brand-subtitle">Midnight ZK Proof-of-Reserves</span>
            </div>
          </div>

          <div className="nav-actions">
            <div className="network-status-badge">
              <span className="pulse-indicator"></span>
              <span className="network-text">Midnight Preprod</span>
            </div>

            <a
              href="https://midnight.mcp.kapa.ai"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="Midnight Docs"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Docs</span>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="GitHub Repo"
            >
              <Code2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-tag">
            <Lock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <span>Confidential Solvency Verifier</span>
          </div>
          <h1 className="hero-title">
            Verify Solvency with <span className="gradient-text">Zero-Knowledge</span>
          </h1>
          <p className="hero-description">
            Proofolio enables custodians, exchanges, and funds to mathematically prove that reserve assets exceed customer obligations without ever publishing proprietary balance sheets or customer balances.
          </p>
        </section>

        {/* Live On-Chain Contract Ledger Banner */}
        <section className="ledger-overview-section">
          <div className="ledger-card">
            <div className="ledger-card-header">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="ledger-title">Public Ledger State (Preprod)</h3>
              </div>
              <button
                onClick={fetchLedgerState}
                disabled={isLoadingLedger}
                className="refresh-btn"
                title="Refresh on-chain state"
              >
                {isLoadingLedger ? 'Syncing...' : 'Sync State'}
              </button>
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
                <div className="stat-value-mono truncate" title={ledgerState?.commitment_hash || ''}>
                  {ledgerState?.commitment_hash || '0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Interaction Grid */}
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
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              onClearError={() => setError(null)}
            />
          </div>

          {/* Step 2: Circuit Call & Verification */}
          <div className="grid-col">
            <div className="step-label">
              <span className="step-num">2</span>
              <span>Execute Zero-Knowledge Circuit</span>
            </div>
            <CircuitCall
              contractAddress={contractAddress}
              isConnected={isConnected}
              isProving={isProving}
              provingStep={provingStep}
              txResult={txResult}
              onCallCircuit={callVerifySolvencyCircuit}
            />
          </div>
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
                <li><code>total_reserves: Uint&lt;64&gt;</code> (Raw custodian assets)</li>
                <li><code>total_liabilities: Uint&lt;64&gt;</code> (Deposit debts)</li>
                <li><code>salt: Bytes&lt;32&gt;</code> (Blinding entropy)</li>
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
                <li><code>solvency_status: Boolean</code> (Global solvency flag)</li>
                <li><code>last_verified_block: Uint&lt;64&gt;</code> (Proof freshness)</li>
                <li><code>commitment_hash: Bytes&lt;32&gt;</code> (Audit anchor)</li>
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
                <li>Mathematical constraint: <code>total_reserves &gt;= total_liabilities</code></li>
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
              An on-chain observer or adversary inspecting the Midnight blockchain sees only the binary certification that the audited entity holds sufficient reserves to cover liabilities, along with an immutable cryptographic commitment hash and timestamp. The observer <strong>CANNOT</strong> deduce, estimate, or reconstruct the actual reserve balances, customer liabilities, or deposit sizes.
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
                git clone &lt;repo&gt; &amp;&amp; cd Proofolio<br />
                npm install<br />
                npm run dev &nbsp;&nbsp;# Launches frontend at http://localhost:5173<br />
                npm test &nbsp;&nbsp;&nbsp;&nbsp;# Runs Midnight Compact circuit unit test suite
              </code>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 Proofolio — Midnight Builder Challenge Level 2 (Rise In)</p>
          <div className="footer-links">
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Midnight Network <ExternalLink className="w-3 h-3 inline ml-0.5" />
            </a>
            <span className="dot-divider">•</span>
            <a
              href="https://midnight.mcp.kapa.ai"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Midnight Docs MCP <ExternalLink className="w-3 h-3 inline ml-0.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
