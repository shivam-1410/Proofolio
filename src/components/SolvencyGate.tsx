import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Copy,
  Sliders,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Building2,
  Vault,
  WalletCards,
  RefreshCw,
} from 'lucide-react';
import type { TxResult } from '../hooks/useMidnight';

interface SolvencyGateProps {
  contractAddress: string;
  isConnected: boolean;
  isProving: boolean;
  provingStep: string | null;
  txResult: TxResult | null;
  onCallCircuit: () => void;
  onOpenCertificateModal?: () => void;
}

interface ScenarioPreset {
  id: string;
  name: string;
  category: string;
  icon: typeof Building2;
  reserves: number;
  liabilities: number;
  description: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'custodian-prime',
    name: 'Tier-1 Exchange Custody',
    category: 'Centralized Custody',
    icon: Building2,
    reserves: 12500000,
    liabilities: 9800000,
    description: 'Proves 127.5% backing ratio across retail and institutional spot deposits.',
  },
  {
    id: 'lending-pool',
    name: 'DeFi Overcollateralized Vault',
    category: 'Lending Protocol',
    icon: Vault,
    reserves: 45000000,
    liabilities: 38200000,
    description: 'Verifies continuous debt solvency without exposing collateral liquidation limits.',
  },
  {
    id: 'dao-treasury',
    name: 'Protocol DAO Runway Reserve',
    category: 'DAO Governance',
    icon: WalletCards,
    reserves: 8200000,
    liabilities: 5100000,
    description: 'Proves multi-year operating runway without revealing active token accumulation.',
  },
];

export const SolvencyGate: React.FC<SolvencyGateProps> = ({
  contractAddress,
  isConnected,
  isProving,
  provingStep,
  txResult,
  onCallCircuit,
  onOpenCertificateModal,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('custodian-prime');
  const [customReserves, setCustomReserves] = useState<number>(12500000);
  const [customLiabilities, setCustomLiabilities] = useState<number>(9800000);
  const [copiedTx, setCopiedTx] = useState(false);

  const handlePresetSelect = (preset: ScenarioPreset) => {
    setSelectedPreset(preset.id);
    setCustomReserves(preset.reserves);
    setCustomLiabilities(preset.liabilities);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const isSolvent = customReserves >= customLiabilities;
  const reserveRatio =
    customLiabilities > 0 ? ((customReserves / customLiabilities) * 100).toFixed(1) : '100.0';

  return (
    <div className="solvency-gate-card">
      {/* Header */}
      <div className="circuit-card-header">
        <div className="flex items-center gap-3">
          <div className="icon-badge icon-badge-purple">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="circuit-heading">Confidential Solvency Gate</h3>
            <p className="circuit-subheading">
              Compact Circuit: <code className="circuit-code">verifySolvency()</code> • Midnight Preprod
            </p>
          </div>
        </div>
        <div className="badge-pill badge-pill-purple">
          <Lock className="w-3.5 h-3.5 mr-1" />
          <span>Zero-Knowledge Gate</span>
        </div>
      </div>

      {/* Target Contract Address Box */}
      <div className="contract-ref-box">
        <span className="contract-ref-label">Target Preprod Contract:</span>
        <code className="contract-address-text" title={contractAddress}>
          {contractAddress}
        </code>
      </div>

      {/* Mandatory Privacy Guarantee Label */}
      <div className="privacy-assurance-box">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="privacy-highlight-label">Proved without revealing your input</span>
        </div>
        <p className="privacy-assurance-text">
          The Compact zero-knowledge circuit enforces the mathematical constraint{' '}
          <code>assert(total_reserves &gt;= total_liabilities)</code>. All asset and liability numbers are
          evaluated strictly within browser memory via private witnesses:{' '}
          <strong>raw balances never leave this device and are never broadcast to the network.</strong>
        </p>
      </div>

      {/* Preset Scenarios (Feedback improvement: quick 1-click evaluation) */}
      <div className="presets-container mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Institution Scenario Presets</span>
          </span>
          <span className="text-xs text-slate-400">1-Click Test Scenarios</span>
        </div>

        <div className="preset-cards-grid">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`preset-select-btn ${isSelected ? 'preset-select-btn-active' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="font-semibold text-xs text-slate-200">{preset.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 text-left line-clamp-2">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client-Side Witness Formulation (Private Inputs) */}
      <div className="witness-builder-box mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
              Client-Side Witness Formulation (Private Inputs)
            </span>
          </div>
          <span className="badge-private-witness">🔒 Private Witness — Never On-Chain</span>
        </div>

        <div className="witness-inputs-grid">
          <div className="witness-input-group">
            <label className="witness-label">
              <span>Confidential Total Reserves</span>
              <span className="text-xs text-slate-400 font-mono">
                ${customReserves.toLocaleString()}
              </span>
            </label>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={customReserves}
              onChange={(e) => {
                setCustomReserves(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="witness-range-slider"
            />
          </div>

          <div className="witness-input-group">
            <label className="witness-label">
              <span>Confidential Customer Liabilities</span>
              <span className="text-xs text-slate-400 font-mono">
                ${customLiabilities.toLocaleString()}
              </span>
            </label>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={customLiabilities}
              onChange={(e) => {
                setCustomLiabilities(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="witness-range-slider"
            />
          </div>
        </div>

        {/* Real-time Constraint Evaluation Preview */}
        <div className="constraint-eval-banner mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSolvent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span className="text-xs text-slate-300">
                Mathematical Constraint:{' '}
                <code className="text-cyan-300 font-mono">
                  {customReserves} &gt;= {customLiabilities}
                </code>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Backing Ratio:</span>
              <span
                className={`text-xs font-bold font-mono ${isSolvent ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {reserveRatio}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="action-row">
        <button
          onClick={onCallCircuit}
          disabled={!isConnected || isProving || !isSolvent}
          className={`prove-btn ${!isConnected || !isSolvent ? 'prove-btn-disabled' : ''} ${isProving ? 'prove-btn-loading' : ''}`}
          id="call-circuit-btn"
        >
          {isProving ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner spinner-purple"></span>
              <span>Generating ZK Proof in Browser...</span>
            </div>
          ) : !isSolvent ? (
            <div className="flex items-center justify-center gap-2 text-rose-300">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Insolvent: Reserves Must Exceed Liabilities</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
              <span>Generate ZK Proof &amp; Submit to Preprod</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          )}
        </button>
      </div>

      {!isConnected && (
        <p className="connect-hint-text">
          ⚡ Connect Lace wallet above to enable circuit execution.
        </p>
      )}

      {/* Proving Progress State */}
      {isProving && (
        <div className="proving-progress-card mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="proving-title">Proving Zero-Knowledge Constraints</span>
            <span className="proving-tag">Halo2 Client Prover</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
          <p className="proving-step-desc">
            {provingStep || 'Computing constraint satisfaction & generating ZK-SNARK witness...'}
          </p>
          <div className="proving-note">
            <Lock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            <span>Witness privacy preserved: Private inputs are NEVER sent to the network.</span>
          </div>
        </div>
      )}

      {/* Transaction Result Display */}
      {txResult && (
        <div className="tx-result-card mt-4" id="tx-result-display">
          <div className="tx-result-header">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="tx-success-title">Proof Verified On-Chain!</span>
            </div>
            <span className="tx-time-tag">{txResult.timestamp}</span>
          </div>

          <div className="label-badge-success mb-3">
            <ShieldCheck className="w-4 h-4 mr-1 inline" />
            <span>Proved without revealing your input</span>
          </div>

          <div className="result-field-grid">
            <div className="result-field">
              <span className="field-name">On-Chain Solvency Status:</span>
              <span className="field-value font-bold text-emerald-400">
                {txResult.verifiedSolvent ? '✅ SOLVENT (VERIFIED)' : '❌ UNVERIFIED'}
              </span>
            </div>

            <div className="result-field">
              <span className="field-name">Confirmed Block Height:</span>
              <span className="field-value text-cyan-300 font-mono">
                #{txResult.blockHeight}
              </span>
            </div>

            <div className="result-field result-field-full">
              <div className="flex items-center justify-between">
                <span className="field-name">Transaction Hash:</span>
                <button
                  onClick={() => handleCopy(txResult.txHash)}
                  className="copy-mini-btn"
                  title="Copy Tx Hash"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="field-code">{txResult.txHash}</code>
            </div>

            <div className="result-field result-field-full">
              <span className="field-name">Audit Commitment Hash:</span>
              <code className="field-code text-purple-300">{txResult.commitment}</code>
            </div>
          </div>

          <div className="result-actions-row mt-3 flex items-center justify-between flex-wrap gap-2">
            <a
              href="https://indexer.preprod.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="explorer-link"
            >
              <span>View On Midnight Preprod Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            {onOpenCertificateModal && (
              <button
                type="button"
                onClick={onOpenCertificateModal}
                className="certificate-open-btn"
              >
                <FileCheck className="w-4 h-4 mr-1 text-emerald-400" />
                <span>View Verifiable Certificate</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
