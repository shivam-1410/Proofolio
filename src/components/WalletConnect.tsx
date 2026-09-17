import React, { useState } from 'react';
import { Wallet, LogOut, CheckCircle2, AlertTriangle, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

interface WalletConnectProps {
  isConnected: boolean;
  walletAddress: string | null;
  shieldedAddress?: string | null;
  networkId: string;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearError: () => void;
  onSwitchNetwork?: (newNetwork: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  walletAddress,
  shieldedAddress,
  networkId,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
  onClearError,
  onSwitchNetwork,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 14)}...${addr.slice(-8)}`;
  };

  return (
    <div className="wallet-card">
      <div className="wallet-card-header">
        <div className="wallet-title-row">
          <div className="icon-badge">
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="wallet-heading">Midnight Lace Wallet</h3>
            <p className="wallet-subheading">Network: {networkId.toUpperCase()}</p>
          </div>
        </div>

        <div className="network-selector-pill">
          <button
            type="button"
            onClick={() => onSwitchNetwork && onSwitchNetwork('preprod')}
            className={`net-tab ${networkId === 'preprod' ? 'net-tab-active' : ''}`}
          >
            Preprod
          </button>
          <button
            type="button"
            onClick={() => onSwitchNetwork && onSwitchNetwork('preview')}
            className={`net-tab ${networkId === 'preview' ? 'net-tab-active' : ''}`}
          >
            Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <div className="error-icon-wrapper">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="error-body">
            <div className="error-title">Connection Error</div>
            <div className="error-message">{error}</div>
            {error.toLowerCase().includes('mismatch') && (
              <div className="error-action-row">
                <button
                  type="button"
                  onClick={() => {
                    const alt = networkId === 'preprod' ? 'preview' : 'preprod';
                    if (onSwitchNetwork) onSwitchNetwork(alt);
                    onConnect();
                  }}
                  className="switch-connect-btn"
                >
                  Switch to {networkId === 'preprod' ? 'Preview' : 'Preprod'} &amp; Reconnect
                </button>
                <p className="error-tip-text">
                  Tip: Open Lace Extension &rarr; Settings &rarr; Network to match your active network.
                </p>
              </div>
            )}
            {error.includes('not installed') && (
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="error-link"
              >
                Download Midnight Lace Extension <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
              </a>
            )}
          </div>
          <button onClick={onClearError} className="error-dismiss-btn" title="Dismiss">
            ✕
          </button>
        </div>
      )}

      {!isConnected ? (
        <div className="disconnected-state">
          <div className="disconnected-hero">
            <div className="disconnected-icon-ring">
              <ShieldCheck className="w-8 h-8 text-cyan-400 opacity-80" />
            </div>
            <h4 className="disconnected-title">Wallet Not Connected</h4>
            <p className="disconnected-desc">
              Connect your Midnight Lace wallet to interact with confidential solvency circuits and prove reserves in zero knowledge.
            </p>
          </div>

          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="connect-btn"
            id="connect-wallet-btn"
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                <span>Connecting to Lace...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                <span>Connect Lace Wallet</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="connected-state">
          <div className="connected-banner">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="connected-label">Wallet Connected</span>
            </div>
            <button
              onClick={onDisconnect}
              className="disconnect-btn"
              id="disconnect-wallet-btn"
              title="Disconnect Wallet"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span>Disconnect</span>
            </button>
          </div>

          <div className="address-display-box">
            <div className="address-label-row">
              <span className="address-type-label">Public / Unshielded Address:</span>
              <button
                onClick={() => walletAddress && handleCopy(walletAddress)}
                className="copy-btn"
                title="Copy Address"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="address-code" title={walletAddress || ''}>
              {walletAddress ? truncateAddress(walletAddress) : 'No address retrieved'}
            </div>
          </div>

          {shieldedAddress && (
            <div className="address-display-box shielded-box">
              <div className="address-label-row">
                <span className="address-type-label text-purple-400">Shielded Address (ZK):</span>
              </div>
              <div className="address-code text-purple-200" title={shieldedAddress}>
                {truncateAddress(shieldedAddress)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
