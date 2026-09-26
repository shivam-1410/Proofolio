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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');

  const openLegal = (tab: 'terms' | 'privacy') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Institutional Top Navigation Header */}
      <header className="navbar">
        <div className="nav-content">
          <div className="brand-group">
            <div className="brand-logo-container">
              <img src="/logo.svg" alt="Proofolio" className="w-5 h-5" />
            </div>
            <div>
              <div className="brand-name-row">
                <span className="brand-title">PROOFOLIO</span>
                <span className="brand-version-tag">Mainnet-Ready L6</span>
              </div>
              <span className="brand-subtitle">Confidential Solvency &amp; Eligibility Protocol</span>
            </div>
          </div>

          {/* Desktop Navigation Actions */}
          <div className="nav-actions">
            <div className="network-status-badge">
              <span className="pulse-indicator"></span>
              <span className="network-text">Midnight {networkId.toUpperCase()}</span>
            </div>

            {onOpenCertificate && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="nav-action-pill-btn"
                title="View Verifiable Audit Certificate"
              >
                <span className="font-mono text-xs text-emerald-400 mr-1">[AUDIT]</span>
                <span className="hidden md:inline">Certificate</span>
              </button>
            )}

            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="nav-action-pill-btn"
                title="Community & Preprod Feedback Log"
              >
                <span className="font-mono text-xs text-slate-300 mr-1">[LOG]</span>
                <span className="hidden md:inline">Validation</span>
              </button>
            )}

            <a
              href="https://midnight.mcp.kapa.ai"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="Midnight Developer Documentation"
            >
              <span className="font-mono text-xs text-accent-blue mr-1">&sect;</span>
              <span className="hidden sm:inline">Docs</span>
            </a>

            <a
              href="https://github.com/shivam-1410/Proofolio"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="GitHub Repository"
            >
              <span className="font-mono text-xs text-slate-300 mr-1">&lt;/&gt;</span>
              <span className="hidden sm:inline">Repo</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn sm:hidden font-mono text-xs font-bold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '[✕]' : '[MENU]'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer sm:hidden">
            <div className="mobile-nav-items">
              <div className="mobile-nav-stat font-mono text-xs">
                <span>[NETWORK] Midnight {networkId.toUpperCase()}</span>
              </div>
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenCertificate();
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-nav-link"
                >
                  <span className="font-mono text-xs text-emerald-400 mr-2">[AUDIT]</span>
                  <span>Audit Certificate</span>
                </button>
              )}
              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenFeedback();
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-nav-link"
                >
                  <span className="font-mono text-xs text-slate-300 mr-2">[LOG]</span>
                  <span>Validation Log</span>
                </button>
              )}
              <a
                href="https://midnight.mcp.kapa.ai"
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-link"
              >
                <span className="font-mono text-xs text-accent-blue mr-2">&sect;</span>
                <span>Midnight Docs</span>
              </a>
              <a
                href="https://github.com/shivam-1410/Proofolio"
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-link"
              >
                <span className="font-mono text-xs text-slate-300 mr-2">&lt;/&gt;</span>
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="main-wrapper">{children}</main>

      {/* Institutional Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <div className="flex items-center gap-2 mb-1">
              <img src="/logo.svg" alt="Proofolio" className="w-4 h-4" />
              <span className="font-semibold text-slate-200 tracking-wide text-sm">Proofolio Protocol</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-Knowledge Proof-of-Reserves &amp; Confidential Eligibility Gate deployed on Midnight Network.
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Contract: {contractAddress.slice(0, 16)}...{contractAddress.slice(-8)} (Preprod)
            </p>
          </div>

          <div className="footer-right-col">
            <div className="footer-links">
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Midnight Network <span className="font-mono text-xs">&nearr;</span>
              </a>
              <span className="dot-divider">•</span>
              <a
                href="https://midnight.mcp.kapa.ai"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Midnight MCP &amp; Docs <span className="font-mono text-xs">&nearr;</span>
              </a>
              <span className="dot-divider">•</span>
              <a
                href="https://github.com/shivam-1410/Proofolio"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                GitHub <span className="font-mono text-xs">&nearr;</span>
              </a>
            </div>

            <div className="footer-legal-links mt-2">
              <button
                type="button"
                onClick={() => openLegal('terms')}
                className="footer-legal-btn"
              >
                Terms of Service
              </button>
              <span className="dot-divider">•</span>
              <button
                type="button"
                onClick={() => openLegal('privacy')}
                className="footer-legal-btn"
              >
                Privacy Policy &amp; ZK Disclosures
              </button>
            </div>
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

