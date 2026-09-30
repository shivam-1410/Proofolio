import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2, Copy, Check } from 'lucide-react';
import { LegalModal } from './LegalModal';

interface LayoutProps {
  children: React.ReactNode;
  networkId: string;
  contractAddress: string;
  onOpenFeedback?: () => void;
  onOpenCertificate?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  networkId,
  contractAddress,
  onOpenFeedback,
  onOpenCertificate,
}) => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');
  const [copiedContract, setCopiedContract] = useState(false);

  const openLegal = (tab: 'terms' | 'privacy') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const truncate = (val: string, start = 8, end = 6) => {
    if (!val || val.length <= start + end) return val;
    return `${val.slice(0, start)}...${val.slice(-end)}`;
  };

  return (
    <div className="app-container">
      {/* Accessibility Skip Link */}
      <a href="#prover-app" className="skip-link">
        Skip to Solvency Verifier Terminal
      </a>

      {/* Modern Startup Navbar */}
      <header className="navbar">
        <div className="nav-content">
          <div className="brand-group">
            <div className="brand-logo-container">
              <img src="/logo.svg" alt="Proofolio" width={28} height={28} />
            </div>
            <span className="brand-title">Proofolio</span>
            <span className="brand-pill">Preprod</span>
          </div>

          <nav className="nav-links">
            <a href="#prover-app" className="nav-link">Verifier App</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#smart-contract" className="nav-link">Smart Contract</a>
            {onOpenCertificate && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="nav-btn"
                title="View Verifiable Audit Certificate"
              >
                Audit Certificate
              </button>
            )}
            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="nav-btn"
                title="Community & Preprod Feedback"
              >
                Feedback
              </button>
            )}
          </nav>

          <div className="nav-actions">
            <div className="network-badge">
              <span className="pulse-dot"></span>
              <span>Midnight {networkId.toUpperCase()}</span>
            </div>
            <a
              href="https://github.com/shivam-1410/Proofolio"
              target="_blank"
              rel="noreferrer"
              className="nav-btn"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="main-wrapper" id="main-content">
        {children}
      </main>

      {/* Trustworthy Financial Product Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-top-grid">
            <div className="footer-col-main">
              <div className="footer-brand-row">
                <img src="/logo.svg" alt="" width={20} height={20} aria-hidden="true" />
                <span className="footer-brand-title">Proofolio Protocol</span>
                <span className="footer-network-tag">Cardano Midnight Preprod</span>
              </div>
              <p className="footer-description">
                Proofolio is an institutional zero-knowledge solvency verification protocol. It mathematically certifies that reserve assets exceed customer deposit obligations without exposing balance sheets, reserve sizes, or individual depositor records.
              </p>
              <div className="footer-contract-callout">
                <span className="footer-contract-label">Active Contract Address:</span>
                <code className="footer-contract-code" title={contractAddress}>
                  {truncate(contractAddress, 14, 10)}
                </code>
                <button
                  type="button"
                  onClick={copyContract}
                  className="footer-copy-btn"
                  title="Copy Midnight Contract Address"
                >
                  {copiedContract ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedContract ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="footer-col-nav">
              <h4 className="footer-heading">Protocol Navigation</h4>
              <ul className="footer-list">
                <li><a href="#prover-app" className="footer-link">Solvency Verifier Terminal</a></li>
                <li><a href="#how-it-works" className="footer-link">Protocol Architecture</a></li>
                <li><a href="#privacy-model" className="footer-link">Dual-State Privacy Model</a></li>
                <li><a href="#smart-contract" className="footer-link">Compact Circuit Source</a></li>
                <li><a href="#faq" className="footer-link">Institutional FAQ</a></li>
              </ul>
            </div>

            <div className="footer-col-nav">
              <h4 className="footer-heading">Midnight Ecosystem</h4>
              <ul className="footer-list">
                <li>
                  <a href="https://midnight.network" target="_blank" rel="noreferrer" className="footer-link">
                    Midnight Network <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://indexer.preprod.midnight.network/api/v4/graphql" target="_blank" rel="noreferrer" className="footer-link">
                    Preprod Indexer API <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://indexer.preview.midnight.network/api/v4/graphql" target="_blank" rel="noreferrer" className="footer-link">
                    Preview Indexer API <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://faucet.preprod.midnight.network" target="_blank" rel="noreferrer" className="footer-link">
                    Preprod Faucet <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="footer-disclaimer">
              <span>&copy; {new Date().getFullYear()} Proofolio Protocol. Built for Cardano's Midnight Network.</span>
              <span className="footer-sub-disclaimer">
                Non-custodial zero-knowledge attestation. Balances are processed strictly within client-side WebAssembly memory.
              </span>
            </div>

            <div className="footer-legal-links">
              <button
                type="button"
                onClick={() => openLegal('terms')}
                className="footer-legal-btn"
              >
                Terms of Service
              </button>
              <span className="footer-legal-divider">&bull;</span>
              <button
                type="button"
                onClick={() => openLegal('privacy')}
                className="footer-legal-btn"
              >
                Zero-Knowledge Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Institutional Legal & Disclosures Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};

export default Layout;
