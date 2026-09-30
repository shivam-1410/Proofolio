import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Lock,
  ArrowRight,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { BalanceSlider } from '@/components/ui/balance-slider';
import type { TxResult } from '../hooks/useMidnight';
import { useMidnightWallet } from '../hooks/useMidnightWallet';
import { WalletConnect } from './WalletConnect';

export interface SolvencyGateProps {
  contractAddress?: string;
  isConnected?: boolean;
  walletAddress?: string | null;
  isProving?: boolean;
  provingStep?: string | null;
  txResult?: TxResult | null;
  onConnectWallet?: () => void;
  onCallCircuit?: (reserves?: number, liabilities?: number) => void;
  onOpenCertificateModal?: () => void;
}

interface ScenarioPreset {
  id: string;
  name: string;
  category: string;
  reserves: number;
  liabilities: number;
  description: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'custodian-prime',
    name: 'Exchange Custody',
    category: 'Exchange',
    reserves: 12500000,
    liabilities: 9800000,
    description: 'Proves 127.6% backing ratio across retail and spot client deposits.',
  },
  {
    id: 'lending-pool',
    name: 'DeFi Lending Vault',
    category: 'DeFi',
    reserves: 45000000,
    liabilities: 38200000,
    description: 'Verifies overcollateralized debt solvency without disclosing liquidation limits.',
  },
  {
    id: 'dao-treasury',
    name: 'DAO Treasury',
    category: 'Treasury',
    reserves: 8200000,
    liabilities: 5100000,
    description: 'Certifies 160.8% multi-year operational runway without exposing asset allocation.',
  },
];

export const SolvencyGate: React.FC<SolvencyGateProps> = ({
  contractAddress = '25c4b17fc652493af4ba88e4bd25d1f82a80bcebe7e3189f199c32e3910efc1d',
  isConnected: propIsConnected,
  walletAddress: propAddress,
  isProving = false,
  provingStep = null,
  txResult = null,
  onConnectWallet,
  onCallCircuit,
  onOpenCertificateModal,
}) => {
  const wallet = useMidnightWallet();
  const isConnected = propIsConnected !== undefined ? (propIsConnected || wallet.isConnected) : wallet.isConnected;
  const walletAddress = propAddress || wallet.address;

  const [selectedPreset, setSelectedPreset] = useState<string>('custodian-prime');
  const [customReserves, setCustomReserves] = useState<number>(12500000);
  const [customLiabilities, setCustomLiabilities] = useState<number>(9800000);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedCommitment, setCopiedCommitment] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [showIndexerQuery, setShowIndexerQuery] = useState(false);

  const handlePresetSelect = (preset: ScenarioPreset) => {
    setSelectedPreset(preset.id);
    setCustomReserves(preset.reserves);
    setCustomLiabilities(preset.liabilities);
  };

  const handleCopy = (text: string, type: 'tx' | 'contract' | 'commitment') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else if (type === 'contract') {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } else {
      setCopiedCommitment(true);
      setTimeout(() => setCopiedCommitment(false), 2000);
    }
  };

  const isSolvent = customReserves >= customLiabilities;
  const reserveRatio =
    customLiabilities > 0 ? ((customReserves / customLiabilities) * 100).toFixed(1) : '100.0';
  const surplus = customReserves - customLiabilities;

  const truncate = (val: string, start = 12, end = 8) => {
    if (!val || val.length <= start + end) return val;
    return `${val.slice(0, start)}...${val.slice(-end)}`;
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="prover-card" id="prover-app" role="region" aria-label="Solvency Verifier Terminal">
      {/* Terminal Header & Mode Bar */}
      <div className="prover-header">
        <div className="prover-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge-pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
              Dual-State Terminal
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Compact v0.17 Circuit &bull; Halo2 / PLONK</span>
          </div>
          <h2>Zero-Knowledge Solvency Terminal</h2>
          <p>
            Prove that your reserves exceed liabilities without disclosing balances, counterparty identities, or asset composition.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="presets-bar" role="toolbar" aria-label="Balance sheet scenario presets">
          <span className="presets-label">Institutional Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`preset-chip ${selectedPreset === preset.id ? 'active' : ''}`}
              title={preset.description}
              aria-pressed={selectedPreset === preset.id}
            >
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPreset('custom')}
            className={`preset-chip ${selectedPreset === 'custom' ? 'active' : ''}`}
            aria-pressed={selectedPreset === 'custom'}
          >
            Custom Input
          </button>
        </div>
      </div>

      {/* Two Column Architectural Split: Private Witness vs Public Ledger */}
      <div className="prover-grid">
        {/* Left Column: Private Witness Space (Browser Wasm Memory) */}
        <div className="prover-col prover-col-private" aria-labelledby="private-witness-heading">
          <div className="prover-col-header">
            <div>
              <span className="col-step-title">Stage 1 &bull; Client-Side Private Witness</span>
              <h3 id="private-witness-heading" className="col-heading">Private Balance Sheet</h3>
            </div>
            <div className="badge-pill badge-private">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>In-Memory Only</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1rem' }}>
            These figures are held strictly in your browser's local WebAssembly memory. They are used to synthesize the Halo2 proof witness and are <strong style={{ color: '#f1f5f9' }}>never broadcast</strong> over RPC or ledger transactions.
          </p>

          {/* Connected Signer Metadata or Sandbox Indicator */}
          {isConnected ? (
            <div className="signer-status-row">
              <span className="signer-status-label">Active Prover Signer:</span>
              <span className="signer-status-value font-mono">
                {truncate(walletAddress || '', 10, 6)}
              </span>
            </div>
          ) : (
            <div className="signer-status-row" style={{ borderColor: 'rgba(59, 130, 246, 0.25)', background: 'rgba(30, 41, 59, 0.35)' }}>
              <span className="signer-status-label">Prover Signer:</span>
              <span style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 500 }}>
                Interactive Sandbox &bull; Ready to Prove
              </span>
            </div>
          )}

          {/* Reserve Assets Input */}
              <BalanceSlider
                label="Total Reserve Assets (Private)"
                value={customReserves}
                min={1000000}
                max={50000000}
                step={250000}
                defaultValue={PRESETS.find((p) => p.id === selectedPreset)?.reserves}
                onChange={(val) => {
                  setCustomReserves(val);
                  setSelectedPreset('custom');
                }}
                onReset={() => {
                  const defaultVal = PRESETS.find((p) => p.id === selectedPreset)?.reserves;
                  if (defaultVal) setCustomReserves(defaultVal);
                }}
                badge="Private Witness"
              />

              {/* Customer Liabilities Input */}
              <BalanceSlider
                label="Customer Deposit Liabilities (Private)"
                value={customLiabilities}
                min={1000000}
                max={50000000}
                step={250000}
                defaultValue={PRESETS.find((p) => p.id === selectedPreset)?.liabilities}
                onChange={(val) => {
                  setCustomLiabilities(val);
                  setSelectedPreset('custom');
                }}
                onReset={() => {
                  const defaultVal = PRESETS.find((p) => p.id === selectedPreset)?.liabilities;
                  if (defaultVal) setCustomLiabilities(defaultVal);
                }}
                badge="Private Witness"
              />

              {/* Live Solvency Ratio & Invariant Check Card */}
              <div className={`solvency-ratio-card ${isSolvent ? 'solvent-border' : 'insolvent-border'}`}>
                <div className="ratio-value-group">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="ratio-label">Backing Ratio</span>
                    <span className={`ratio-number ${isSolvent ? 'solvent' : 'insolvent'}`}>
                      {reserveRatio}%
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="ratio-label">Net Reserve Position</span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: isSolvent ? '#34d399' : '#f87171',
                      }}
                    >
                      {isSolvent ? `+${formatUSD(surplus)}` : `-${formatUSD(Math.abs(surplus))}`}
                    </span>
                  </div>
                </div>

                {/* Backing Gauge Bar */}
                <div className="gauge-container" role="progressbar" aria-valuenow={Math.min(Number(reserveRatio), 200)} aria-valuemin={0} aria-valuemax={200}>
                  <div
                    className={`gauge-fill ${isSolvent ? 'gauge-solvent' : 'gauge-insolvent'}`}
                    style={{ width: `${Math.min(Math.max((Number(reserveRatio) / 200) * 100, 5), 100)}%` }}
                  />
                  <div className="gauge-target-marker" style={{ left: '50%' }} title="100% Solvency Invariant Requirement" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: '#64748b', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                  <span>0%</span>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>100% Min Invariant</span>
                  <span>200%+</span>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className={`status-badge ${isSolvent ? 'solvent' : 'insolvent'}`}>
                    {isSolvent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Solvent: Circuit Invariant <code>reserves &gt;= liabilities</code> Satisfied</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Insolvent: Deficit of {formatUSD(Math.abs(surplus))}. ZK Circuit will reject proof generation.</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Client-Side Zero Disclosure Guarantee Callout */}
              <div className="privacy-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem', color: '#60a5fa', fontWeight: 600 }}>
                  <Info className="w-3.5 h-3.5" />
                  <span>Client-Side Zero Disclosure Guarantee</span>
                </div>
                <span>
                  Midnight's Compact compiler enforces that <code>total_reserves</code> and <code>total_liabilities</code> are declared as <code>witness</code> parameters. They never exist on the ledger or in network mempools.
                </span>
              </div>
        </div>

        {/* Right Column: Public Consensus State (Midnight Preprod Ledger) */}
        <div className="prover-col prover-col-public" aria-labelledby="public-consensus-heading">
          <div className="prover-col-header">
            <div>
              <span className="col-step-title">Stage 2 &bull; Public On-Chain Settlement</span>
              <h3 id="public-consensus-heading" className="col-heading">Public Attestation</h3>
            </div>
            <div className="badge-pill badge-public">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Midnight Preprod</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1rem' }}>
            The public output: a binary verification flag (<code>is_solvent = true</code>) and a 32-byte collision-resistant commitment binding your private balance sheet without disclosing it.
          </p>

          {/* Target Smart Contract Address Card */}
          <div className="contract-meta-card">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span className="contract-meta-label">Midnight Contract Address</span>
                <span className="badge-pill" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  Deployed
                </span>
              </div>
              <div className="contract-meta-address font-mono" title={contractAddress}>
                {truncate(contractAddress, 14, 8)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleCopy(contractAddress, 'contract')}
                className="nav-btn"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                title="Copy full 32-byte contract address"
                aria-label="Copy contract address"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContract ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowIndexerQuery(!showIndexerQuery)}
                className="nav-btn"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                title="View GraphQL verification query"
                aria-expanded={showIndexerQuery}
              >
                <span>GraphQL</span>
              </button>
            </div>
          </div>

          {/* Collapsible GraphQL Query View for Indexer Verification */}
          {showIndexerQuery && (
            <div className="indexer-query-box" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Midnight Indexer Query (GraphQL v4)
                </span>
                <a
                  href="https://indexer.preview.midnight.network/api/v4/graphql"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.7rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>API Endpoint</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <pre className="font-mono" style={{ fontSize: '0.7rem', color: '#cbd5e1', margin: 0, overflowX: 'auto', background: 'transparent', padding: 0 }}>
{`query CheckContractSolvency {
  contractAction(address: "${contractAddress}") {
    id
    timestamp
    contract {
      address
    }
  }
}`}
              </pre>
            </div>
          )}

          {/* Primary Action Button */}
          <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => {
                if (!isConnected) {
                  if (onConnectWallet) onConnectWallet();
                } else if (onCallCircuit) {
                  onCallCircuit(customReserves, customLiabilities);
                }
              }}
              disabled={isProving || (isConnected && !isSolvent)}
              className={`cta-button cta-button-primary ${isConnected && !isSolvent ? 'cta-disabled' : ''}`}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem 1.25rem' }}
              aria-busy={isProving}
            >
              {isProving ? (
                <>
                  <div className="spinner-sm" />
                  <span>Synthesizing ZK Proof in Browser Wasm...</span>
                </>
              ) : !isConnected ? (
                <>
                  <Sparkles className="w-4 h-4 mr-1 text-amber-300" />
                  <span>Launch Sandbox &amp; Verify Solvency</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : !isSolvent ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-1 text-red-400" />
                  <span>Cannot Prove: Invariant Violation (Deficit)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1 text-amber-300" />
                  <span>Generate ZK Proof &amp; Verify Solvency</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Proving In Progress Multi-Stage Stepper */}
          {isProving && (
            <div className="proving-card" role="status" aria-live="polite">
              <div className="proving-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">Local zk-SNARK Prover Engine</span>
                </div>
                <span className="proving-step-text font-mono">Halo2 WebAssembly</span>
              </div>

              <div className="progress-bar-bg" style={{ margin: '0.75rem 0' }}>
                <div className="progress-bar-active" />
              </div>

              <div className="stepper-list">
                <div className="stepper-step completed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private witness constructed in ephemeral RAM</span>
                </div>
                <div className="stepper-step active">
                  <div className="spinner-xs" />
                  <span>{provingStep || 'Synthesizing polynomial constraints...'}</span>
                </div>
                <div className="stepper-step pending">
                  <div className="circle-dot-pending" />
                  <span>Settling verified attestation on Midnight consensus</span>
                </div>
              </div>
            </div>
          )}

          {/* Verified On-Chain Receipt */}
          {txResult && (
            <div className="receipt-card" role="status" aria-label="On-chain verification receipt">
              <div className="receipt-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="receipt-title">Verified On-Chain &bull; 100%+ Backed</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{txResult.timestamp}</span>
              </div>

              <div className="receipt-grid">
                <div className="receipt-item">
                  <div className="receipt-label">Solvency Invariant</div>
                  <div className="receipt-val text-emerald-400 font-semibold">
                    {txResult.verifiedSolvent ? 'SATISFIED (Solvent)' : 'UNVERIFIED'}
                  </div>
                </div>

                <div className="receipt-item">
                  <div className="receipt-label">Settled Block Height</div>
                  <div className="receipt-val text-blue-400 font-mono">
                    #{txResult.blockHeight}
                  </div>
                </div>

                <div className="receipt-item receipt-item-full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="receipt-label">Transaction Hash</div>
                    <button
                      type="button"
                      onClick={() => handleCopy(txResult.txHash, 'tx')}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                      title="Copy Transaction Hash"
                    >
                      {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="receipt-val text-xs truncate font-mono text-slate-200">
                    {txResult.txHash}
                  </div>
                </div>

                <div className="receipt-item receipt-item-full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="receipt-label">Cryptographic Audit Commitment (Bytes32)</div>
                    <button
                      type="button"
                      onClick={() => handleCopy(txResult.commitment, 'commitment')}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                      title="Copy Commitment"
                    >
                      {copiedCommitment ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="receipt-val text-xs truncate font-mono text-slate-300">
                    {txResult.commitment}
                  </div>
                </div>
              </div>

              <div className="receipt-actions">
                <button
                  type="button"
                  onClick={() => handleCopy(txResult.txHash, 'tx')}
                  className="receipt-btn"
                >
                  {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTx ? 'Copied' : 'Copy Tx Hash'}</span>
                </button>

                {onOpenCertificateModal && (
                  <button
                    type="button"
                    onClick={onOpenCertificateModal}
                    className="receipt-btn receipt-btn-primary"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Audit Certificate</span>
                  </button>
                )}

                <a
                  href="https://indexer.preview.midnight.network/api/v4/graphql"
                  target="_blank"
                  rel="noreferrer"
                  className="receipt-btn"
                >
                  <span>Indexer API</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Empty State when no proof generated yet */}
          {!txResult && !isProving && (
            <div className="empty-receipt-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Layers className="w-4 h-4 text-slate-500" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}>
                  No Active Attestation Generated
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                Adjust balance sheet parameters on the left and click <strong>Generate ZK Proof</strong>. Upon proof synthesis, your immutable verification receipt and verifiable audit certificate will populate here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolvencyGate;
