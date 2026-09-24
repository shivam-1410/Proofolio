import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Copy,
  Download,
  ExternalLink,
  X,
  QrCode,
  Building,
  Calendar,
  Layers,
} from 'lucide-react';
import type { TxResult } from '../hooks/useMidnight';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  txResult: TxResult | null;
  contractAddress: string;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  txResult,
  contractAddress,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const certificateId = txResult
    ? `CERT-PROOF-${txResult.txHash.slice(0, 10).toUpperCase()}`
    : 'CERT-PROOF-900942-PREPROD';
  const blockHeight = txResult?.blockHeight || 900942;
  const commitment =
    txResult?.commitment ||
    '0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e';
  const timestamp = txResult?.timestamp || '2026-09-24 11:45:00 UTC';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="certificate-modal-card">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close certificate modal"
        >
          <X className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>

        {/* Certificate Frame */}
        <div className="certificate-frame">
          <div className="certificate-watermark">PROOF-OF-RESERVES</div>

          {/* Header */}
          <div className="certificate-header">
            <div className="certificate-badge">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="certificate-meta-label">MIDNIGHT NETWORK ZERO-KNOWLEDGE AUDIT</span>
              <h2 className="certificate-title">Certificate of Mathematical Solvency</h2>
              <p className="certificate-subtitle">Confidential Eligibility Gate Verification</p>
            </div>
          </div>

          {/* Divider */}
          <div className="certificate-divider"></div>

          {/* Main Statement */}
          <div className="certificate-statement-box">
            <p className="certificate-statement">
              This certifies that on-chain smart contract validation has executed on the{' '}
              <strong>Midnight Network Preprod</strong> testnet. The cryptographic zero-knowledge circuit{' '}
              <code className="text-cyan-300 font-mono">verifySolvency()</code> mathematically verified that:
            </p>
            <div className="certificate-formula-box">
              <span className="text-emerald-400 font-bold font-mono text-base">
                total_reserves &gt;= total_liabilities (100% Backed)
              </span>
            </div>
            <p className="certificate-disclaimer">
              *Proved without revealing input balances: Zero private asset holdings, liability amounts, or
              customer numbers were exposed or recorded on the public ledger.
            </p>
          </div>

          {/* Verification Details Grid */}
          <div className="certificate-details-grid">
            <div className="cert-detail-item">
              <span className="cert-detail-label">Certificate ID</span>
              <span className="cert-detail-value font-mono text-amber-300">{certificateId}</span>
            </div>

            <div className="cert-detail-item">
              <span className="cert-detail-label">Verification Status</span>
              <span className="cert-detail-value text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SOLVENT (VERIFIED)</span>
              </span>
            </div>

            <div className="cert-detail-item">
              <span className="cert-detail-label">Midnight Preprod Block</span>
              <span className="cert-detail-value font-mono text-cyan-300">#{blockHeight}</span>
            </div>

            <div className="cert-detail-item">
              <span className="cert-detail-label">Verification Timestamp</span>
              <span className="cert-detail-value font-mono text-slate-300">{timestamp}</span>
            </div>

            <div className="cert-detail-item cert-detail-full">
              <span className="cert-detail-label">Preprod Contract Address</span>
              <span className="cert-detail-value font-mono text-slate-300 text-xs truncate" title={contractAddress}>
                {contractAddress}
              </span>
            </div>

            <div className="cert-detail-item cert-detail-full">
              <span className="cert-detail-label">Cryptographic Audit Commitment</span>
              <span className="cert-detail-value font-mono text-purple-300 text-xs truncate" title={commitment}>
                {commitment}
              </span>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="certificate-seal-row">
            <div className="flex items-center gap-3">
              <div className="qr-box">
                <QrCode className="w-12 h-12 text-slate-200" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-300">Cryptographically Sealed</p>
                <p className="text-[11px] text-slate-400">Midnight Compact ZK-Proof Engine</p>
                <p className="text-[11px] text-cyan-400 font-mono">Halo2 / Plonk Polynomial Commitment</p>
              </div>
            </div>

            <div className="certificate-seal-stamp">
              <ShieldCheck className="w-8 h-8 text-emerald-400 inline" />
              <span className="seal-text">VERIFIED SOLVENT</span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="certificate-actions-bar">
          <button
            type="button"
            onClick={() => handleCopy(window.location.href)}
            className="cert-action-btn"
          >
            <Copy className="w-4 h-4 mr-1.5" />
            <span>{copied ? 'Link Copied!' : 'Copy Verifier URL'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="cert-action-btn cert-action-btn-primary"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Export / Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
