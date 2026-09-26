import React, { useState } from 'react';
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

  const openLegal = (tab: 'terms' | 'privacy') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="app-container">
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

      {/* Main Content */}
      <main className="main-wrapper">{children}</main>

      {/* Clean Startup Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="font-semibold text-slate-200">Proofolio Protocol</span> &bull; Confidential Solvency &amp; Eligibility Gate on Midnight Network.
          </div>

          <div className="footer-links">
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Midnight Network
            </a>
            <a
              href="https://midnight.mcp.kapa.ai"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Developer Docs
            </a>
            <button
              type="button"
              onClick={() => openLegal('terms')}
              className="footer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => openLegal('privacy')}
              className="footer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* Terms and Privacy Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};

export default Layout;
