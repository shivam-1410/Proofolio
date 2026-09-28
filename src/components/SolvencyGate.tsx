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
  onCallCircuit?: () => void;
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
    description: 'Proves 127.5% backing ratio across retail and spot client deposits.',
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
  contractAddress = 'preprod_contract_por_001',
  isConnected: propIsConnected,
  walletAddress: propAddress,
  isProving = false,
  provingStep = null,
  txResult = null,
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
  const [copiedContract, setCopiedContract] = useState(false);

  const handlePresetSelect = (preset: ScenarioPreset) => {
    setSelectedPreset(preset.id);
    setCustomReserves(preset.reserves);
    setCustomLiabilities(preset.liabilities);
  };

  const handleCopy = (text: string, type: 'tx' | 'contract') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  const isSolvent = customReserves >= customLiabilities;
  const reserveRatio =
    customLiabilities > 0 ? ((customReserves / customLiabilities) * 100).toFixed(1) : '100.0';

  const truncate = (val: string, start = 12, end = 8) => {
    if (!val || val.length <= start + end) return val;
    return `${val.slice(0, start)}...${val.slice(-end)}`;
  };

  return (
    <div className="prover-card" id="prover-app">
      {/* Card Header & Presets */}
      <div className="prover-header">
        <div className="prover-title-group">
          <h2>Solvency Verifier Terminal</h2>
          <p>Configure confidential balance sheet parameters and generate zero-knowledge proof</p>
        </div>

        <div className="presets-bar">
          <span className="presets-label">Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`preset-chip ${selectedPreset === preset.id ? 'active' : ''}`}
            >
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPreset('custom')}
            className={`preset-chip ${selectedPreset === 'custom' ? 'active' : ''}`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="prover-grid">
        {/* Left Column: Private Witness Configuration */}
        <div className="prover-col">
          <div className="prover-col-header">
            <div>
              <span className="col-step-title">Step 1 &bull; Private Inputs</span>
              <h3 className="col-heading">Balance Sheet Configuration</h3>
            </div>
            <div className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Private Witness</span>
            </div>
          </div>

          {!isConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  Wallet Connection Required
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Connect your Lace wallet to unlock the private balance sheet inputs and verify zero-knowledge solvency on-chain.
                </p>
              </div>
              <WalletConnect />
            </div>
          ) : (
            <>
              {/* Display Truncated Connected Wallet Address */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0b1120',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.45rem 0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: '#94a3b8' }}>Connected Signer:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600 }}>
                  {truncate(walletAddress || '', 10, 6)}
                </span>
              </div>

              {/* Reserve Assets Input via shadcn BalanceSlider */}
              <BalanceSlider
                label="Total Reserve Assets"
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

              {/* Customer Liabilities Input via shadcn BalanceSlider */}
              <BalanceSlider
                label="Customer Deposit Liabilities"
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

              {/* Live Solvency Ratio Card */}
              <div className="solvency-ratio-card">
                <div className="ratio-value-group">
                  <span className="ratio-label">Backing Ratio</span>
                  <span className={`ratio-number ${isSolvent ? 'solvent' : 'insolvent'}`}>
                    {reserveRatio}%
                  </span>
                </div>
                <div>
                  <span className={`status-badge ${isSolvent ? 'solvent' : 'insolvent'}`}>
                    {isSolvent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Solvent (100%+ Backed)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Insolvent (Deficit)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Privacy Guarantee Note */}
              <div className="privacy-banner">
                <strong>Client-Side Zero Disclosure:</strong> Balances are processed strictly inside local browser WebAssembly memory. Raw figures never leave this device and are never submitted to the ledger or indexer.
              </div>
            </>
          )}
        </div>

        {/* Right Column: Execution & On-Chain Confirmation */}
        <div className="prover-col">
          <div className="prover-col-header">
            <div>
              <span className="col-step-title">Step 2 &bull; Verification</span>
              <h3 className="col-heading">On-Chain Proof Execution</h3>
            </div>
            <div className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Midnight Preprod</span>
            </div>
          </div>

          {/* Target Contract Card */}
          <div className="contract-meta-card">
            <div>
              <span className="contract-meta-label">Contract Address</span>
              <div className="contract-meta-address" title={contractAddress}>
                {truncate(contractAddress, 16, 8)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(contractAddress, 'contract')}
              className="nav-btn"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              title="Copy Contract Address"
            >
              {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedContract ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Action Trigger */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={() => {
                // TODO: Submit proof to Compact contract once integration is wired up via ConnectedAPI / midnight.js
                // That's a separate step once the Compact contract integration is wired up.
                if (onCallCircuit) {
                  onCallCircuit();
                } else {
                  console.info('TODO: Submit proof to Compact contract via ConnectedAPI');
                }
              }}
              disabled={!isConnected || isProving || !isSolvent}
              className="cta-button cta-button-primary"
            >
              {isProving ? (
                <span>Generating ZK Proof in Browser...</span>
              ) : !isConnected ? (
                <span>Connect Wallet to Submit Proof</span>
              ) : !isSolvent ? (
                <span>Cannot Prove: Insolvent Balance Sheet</span>
              ) : (
                <>
                  <span>Generate ZK Proof &amp; Verify Solvency</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Proving In Progress Indicator */}
          {isProving && (
            <div className="proving-card">
              <div className="proving-header">
                <span className="text-xs font-semibold text-slate-200">Local zk-SNARK Execution</span>
                <span className="proving-step-text">Proving in WebAssembly</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-active"></div>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {provingStep || 'Computing Halo2 polynomial commitments...'}
              </p>
            </div>
          )}

          {/* Verified On-Chain Receipt */}
          {txResult && (
            <div className="receipt-card">
              <div className="receipt-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="receipt-title">Verified On-Chain &bull; 100% Backed</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{txResult.timestamp}</span>
              </div>

              <div className="receipt-grid">
                <div className="receipt-item">
                  <div className="receipt-label">Status</div>
                  <div className="receipt-val text-emerald-400 font-semibold">
                    {txResult.verifiedSolvent ? 'Solvent' : 'Unverified'}
                  </div>
                </div>

                <div className="receipt-item">
                  <div className="receipt-label">Confirmed Block</div>
                  <div className="receipt-val text-blue-400 font-mono">
                    #{txResult.blockHeight}
                  </div>
                </div>

                <div className="receipt-item receipt-item-full">
                  <div className="receipt-label">Transaction Hash</div>
                  <div className="receipt-val text-xs truncate font-mono">
                    {txResult.txHash}
                  </div>
                </div>

                <div className="receipt-item receipt-item-full">
                  <div className="receipt-label">Audit Commitment Hash</div>
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
                  href="https://indexer.preprod.midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="receipt-btn"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SolvencyGate;
