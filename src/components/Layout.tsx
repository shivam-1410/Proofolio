import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Code2,
  ExternalLink,
  MessageSquare,
  Activity,
  Award,
  Menu,
  X,
  FileText,
} from 'lucide-react';
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
              <Shield className="w-5 h-5 text-slate-200" />
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
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Audit Certificate</span>
              </button>
            )}

            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="nav-action-pill-btn"
                title="Community & Preprod Feedback Log"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden md:inline">Validation Log</span>
              </button>
            )}

            <a
              href="https://midnight.mcp.kapa.ai"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="Midnight Developer Documentation"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Docs</span>
            </a>

            <a
              href="https://github.com/shivam-1410/Proofolio"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="GitHub Repository"
            >
              <Code2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Repo</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer sm:hidden">
            <div className="mobile-nav-items">
              <div className="mobile-nav-stat">
                <Activity className="w-4 h-4 text-slate-300 inline mr-2" />
                <span>Connected: Midnight {networkId.toUpperCase()}</span>
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
                  <Award className="w-4 h-4 text-emerald-400 mr-2" />
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
                  <MessageSquare className="w-4 h-4 text-slate-300 mr-2" />
                  <span>Validation Log</span>
                </button>
              )}
              <a
                href="https://midnight.mcp.kapa.ai"
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-link"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Midnight Docs</span>
              </a>
              <a
                href="https://github.com/shivam-1410/Proofolio"
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-link"
              >
                <Code2 className="w-4 h-4 mr-2" />
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
              <Shield className="w-4 h-4 text-slate-300" />
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
                Midnight Network <ExternalLink className="w-3 h-3 inline ml-0.5" />
              </a>
              <span className="dot-divider">•</span>
              <a
                href="https://midnight.mcp.kapa.ai"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Midnight MCP &amp; Docs <ExternalLink className="w-3 h-3 inline ml-0.5" />
              </a>
              <span className="dot-divider">•</span>
              <a
                href="https://github.com/shivam-1410/Proofolio"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                GitHub <ExternalLink className="w-3 h-3 inline ml-0.5" />
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
