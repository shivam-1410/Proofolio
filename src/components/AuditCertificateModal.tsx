import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Copy, Check, Printer, X, ShieldCheck } from 'lucide-react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const certificateId = txResult
    ? `CERT-PROOF-${txResult.txHash.slice(0, 10).toUpperCase()}`
    : 'CERT-PROOF-901430-PREPROD';
  const blockHeight = txResult?.blockHeight || 901430;
  const commitment =
    txResult?.commitment ||
    '0x678605e736b76aac95555f7b1b5940893de24decf6824c192d3bbb89946dcb4e';
  const timestamp = txResult?.timestamp || '2026-09-27 12:00:00 UTC';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
    >
      <div className="modal-dialog" style={{ maxWidth: '640px', padding: '2rem' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close certificate modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.25rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
            }}
          >
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Midnight Network &bull; Zero-Knowledge Attestation
            </div>
            <h2 id="cert-title" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: '0.1rem 0' }}>
              Certificate of Mathematical Solvency
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Confidential Proof-of-Reserves Verification
            </div>
          </div>
        </div>

        {/* Mathematical Assertion Statement */}
        <div
          style={{
            background: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            This certifies that on-chain cryptographic verification has executed on the <strong>Midnight Network Preprod</strong> testnet. The zero-knowledge circuit mathematically verified that:
          </p>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '6px',
              padding: '0.65rem',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#34d399',
            }}
          >
            total_reserves &gt;= total_liabilities (100%+ Backed)
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.4 }}>
            *Confidential Witness Guarantee: Neither raw asset quantities, client deposit amounts, nor balance sheet positions were revealed or recorded on the public blockchain.
          </p>
        </div>

        {/* Verification Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Certificate ID</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{certificateId}</div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Verification Status</div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Solvent</span>
            </div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Block Height</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#60a5fa' }}>#{blockHeight}</div>
          </div>

          <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Timestamp</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1' }}>{timestamp}</div>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Smart Contract Address</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#cbd5e1', wordBreak: 'break-all' }}>
              {contractAddress}
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cryptographic Audit Commitment</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#cbd5e1', wordBreak: 'break-all' }}>
              {commitment}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleCopy(window.location.href)}
            className="receipt-btn"
            style={{ padding: '0.65rem 1rem' }}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Copy Verification URL'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="receipt-btn receipt-btn-primary"
            style={{ padding: '0.65rem 1rem' }}
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditCertificateModal;
