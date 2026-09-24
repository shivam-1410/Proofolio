import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Code2,
  ExternalLink,
  MessageSquare,
  FileText,
  Activity,
  Award,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

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

  return (
    <div className="app-container">
      {/* Background ambient glowing gradients */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Startup Brand Navigation Header */}
      <header className="navbar">
        <div className="nav-content">
          <div className="brand-group">
            <div className="brand-logo-container">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="brand-name-row">
                <span className="brand-title">Proofolio</span>
                <span className="brand-version-tag">Level 6 Mainnet-Ready</span>
              </div>
              <span className="brand-subtitle">Confidential Solvency &amp; Eligibility Gate</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
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
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Audit Certificate</span>
              </button>
            )}

            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="nav-action-pill-btn"
                title="Community & User Feedback"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="hidden md:inline">Feedback (L5/L6)</span>
              </button>
            )}

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
              href="https://github.com/shivam-1410/Proofolio"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
              title="GitHub Repository"
            >
              <Code2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Repo</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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
                <Activity className="w-4 h-4 text-cyan-400 inline mr-2" />
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
                  <MessageSquare className="w-4 h-4 text-cyan-400 mr-2" />
                  <span>User Feedback</span>
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

      {/* Main Content */}
      <main className="main-wrapper">{children}</main>

      {/* Startup Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-200">Proofolio Technologies</span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Knowledge Proof-of-Reserves &amp; Confidential Eligibility Gate Protocol
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Contract: {contractAddress.slice(0, 16)}...{contractAddress.slice(-8)} (Preprod)
            </p>
          </div>

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
        </div>
      </footer>
    </div>
  );
};
