import React, { useState } from 'react';
import {
  Wallet,
  Copy,
  Check,
  LogOut,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { useMidnightWallet } from '../hooks/useMidnightWallet';

export interface WalletConnectProps {
  isConnected?: boolean;
  walletAddress?: string | null;
  shieldedAddress?: string | null;
  networkId?: string;
  isConnecting?: boolean;
  error?: string | null;
  onConnect?: () => void;
  onConnectDemo?: () => void;
  onDisconnect?: () => void;
  onClearError?: () => void;
  onSwitchNetwork?: (newNetwork: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected: propIsConnected,
  walletAddress: propAddress,
  shieldedAddress,
  networkId = 'preprod',
  isConnecting: propIsConnecting,
  error: propError,
  onConnect,
  onConnectDemo,
  onDisconnect,
  onClearError,
  onSwitchNetwork,
}) => {
  const hook = useMidnightWallet();
  const [copiedUnshielded, setCopiedUnshielded] = useState(false);
  const [copiedShielded, setCopiedShielded] = useState(false);

  // Derive active states from hook with fallback to optional props (e.g. demo mode)
  const isConnected = propIsConnected !== undefined ? (propIsConnected || hook.isConnected) : hook.isConnected;
  const address = propAddress || hook.address;
  const isConnecting = propIsConnecting !== undefined ? (propIsConnecting || hook.isLoading) : hook.isLoading;
  const error = propError || hook.error;

  const handleConnect = async () => {
    if (onConnect) onConnect();
    await hook.connect();
  };

  const handleDisconnect = () => {
    if (onDisconnect) onDisconnect();
    hook.disconnect();
  };

  const handleCopy = (text: string, isShielded = false) => {
    navigator.clipboard.writeText(text);
    if (isShielded) {
      setCopiedShielded(true);
      setTimeout(() => setCopiedShielded(false), 2000);
    } else {
      setCopiedUnshielded(true);
      setTimeout(() => setCopiedUnshielded(false), 2000);
    }
  };

  const truncate = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 20) return addr;
    return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
  };

  const isNotDetected =
    error?.toLowerCase().includes('not detected') ||
    error?.toLowerCase().includes('not installed');

  return (
    <div className="wallet-card" aria-label="Wallet & Signer Configuration">
      {/* Error / Warning Alert State */}
      {error && !isConnected && (
        <div className="wallet-error-box" role="alert" aria-live="polite">
          <div className="wallet-error-header">
            <AlertCircle className="w-4 h-4 text-rose-400" aria-hidden="true" />
            <span className="wallet-error-title">
              {isNotDetected ? 'Lace Wallet Extension Not Found' : 'Wallet Connection Notice'}
            </span>
          </div>
          <p className="wallet-error-msg">
            {isNotDetected
              ? 'The Midnight Lace wallet extension was not detected on window.midnight.mnLace. Install the extension to sign with your own keys, or use Instant Demo Mode to test the client-side ZK proving circuit immediately.'
              : error}
          </p>
          <div className="wallet-error-actions">
            {isNotDetected ? (
              <a
                href="https://docs.midnight.network/relnotes/lace"
                target="_blank"
                rel="noreferrer"
                className="wallet-btn wallet-btn-primary"
              >
                <span>Install Lace Wallet</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                className="wallet-btn wallet-btn-primary"
              >
                Retry Connection
              </button>
            )}
            {onConnectDemo && (
              <button
                type="button"
                onClick={onConnectDemo}
                className="wallet-btn wallet-btn-accent"
              >
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Launch Demo Wallet (15s Test)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (onClearError) onClearError();
                hook.disconnect();
              }}
              className="wallet-btn wallet-btn-secondary"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Unconnected State */}
      {!isConnected ? (
        <div className="wallet-idle-layout">
          <div className="wallet-idle-header">
            <div className="wallet-idle-info">
              <div className="wallet-icon-badge">
                <Wallet className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="wallet-idle-title">Signer Provider Connection</h3>
                <p className="wallet-idle-desc">
                  Connect your Midnight Lace wallet to verify solvency on-chain, or test client-side ZK proving with a simulated signer.
                </p>
              </div>
            </div>

            <div className="network-selector-group">
              <span className="network-selector-label">Target Network:</span>
              <div className="network-toggle" role="group" aria-label="Midnight Network Selection">
                <button
                  type="button"
                  onClick={() => onSwitchNetwork && onSwitchNetwork('preprod')}
                  className={`network-toggle-btn ${networkId === 'preprod' ? 'active' : ''}`}
                  aria-pressed={networkId === 'preprod'}
                >
                  Preprod
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchNetwork && onSwitchNetwork('preview')}
                  className={`network-toggle-btn ${networkId === 'preview' ? 'active' : ''}`}
                  aria-pressed={networkId === 'preview'}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div className="wallet-action-row">
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="cta-button cta-button-primary wallet-connect-cta"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  <span>Connecting to Lace Wallet...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Connect Midnight Lace Wallet</span>
                </>
              )}
            </button>

            {onConnectDemo && !isConnecting && (
              <button
                type="button"
                onClick={onConnectDemo}
                className="cta-button cta-button-secondary wallet-demo-cta"
                title="Test ZK proving immediately without installing the browser extension"
              >
                <Zap className="w-4 h-4 mr-2 text-amber-400" aria-hidden="true" />
                <span>Launch Instant Demo Signer</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Connected State */
        <div className="wallet-connected-layout">
          <div className="wallet-connected-top">
            <div className="signer-status-indicator">
              <span className="pulse-dot-green" aria-hidden="true"></span>
              <span className="signer-status-text">
                Signer Active &bull; Midnight {networkId.toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDisconnect}
              className="wallet-disconnect-btn"
              title="Disconnect local wallet session"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>Disconnect</span>
            </button>
          </div>

          <div className="wallet-addresses-grid">
            <div className="address-tile">
              <div className="address-tile-header">
                <span className="address-type-label">Public Signer Address (Unshielded)</span>
                <span className="address-network-tag">{networkId}</span>
              </div>
              <div className="address-tile-content">
                <code className="address-code font-mono" title={address || ''}>
                  {truncate(address || '')}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(address || '', false)}
                  className="address-copy-btn"
                  title="Copy unshielded address"
                  aria-label="Copy unshielded address"
                >
                  {copiedUnshielded ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedUnshielded ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {shieldedAddress && (
              <div className="address-tile address-tile-shielded">
                <div className="address-tile-header">
                  <span className="address-type-label">Private ZK Address (Shielded)</span>
                  <span className="address-shielded-tag">
                    <Shield className="w-3 h-3 text-blue-400 inline mr-1" />
                    Zero Knowledge
                  </span>
                </div>
                <div className="address-tile-content">
                  <code className="address-code font-mono text-blue-300" title={shieldedAddress}>
                    {truncate(shieldedAddress)}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(shieldedAddress, true)}
                    className="address-copy-btn"
                    title="Copy shielded address"
                    aria-label="Copy shielded address"
                  >
                    {copiedShielded ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedShielded ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
