import React, { useState } from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  walletAddress: string | null;
  shieldedAddress?: string | null;
  networkId: string;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onConnectDemo?: () => void;
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
  onConnectDemo,
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
            <span className="font-mono text-xs text-blue-400 font-bold">[W3]</span>
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
            <span className="font-mono text-xs text-rose-400 font-bold">[ERR]</span>
          </div>
          <div className="error-body">
            <div className="error-title">Connection Error</div>
            <div className="error-message" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '0.8rem' }}>{error}</div>
            
            <div className="error-action-row" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onConnect()}
                className="switch-connect-btn"
                style={{ background: '#2563eb', color: '#fff', border: '1px solid #1d4ed8', borderRadius: '3px' }}
              >
                Retry Lace Connection
              </button>
              {onConnectDemo && (
                <button
                  type="button"
                  onClick={() => onConnectDemo()}
                  className="switch-connect-btn"
                  style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '3px' }}
                >
                  Connect Demo Wallet (Test ZK Circuit)
                </button>
              )}
            </div>

            {error.toLowerCase().includes('mismatch') && (
              <div className="error-action-row" style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const alt = networkId === 'preprod' ? 'preview' : 'preprod';
                    if (onSwitchNetwork) onSwitchNetwork(alt);
                    onConnect();
                  }}
                  className="switch-connect-btn"
                  style={{ borderRadius: '3px' }}
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
                Download Midnight Lace Extension &rarr;
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
              <span className="font-mono text-xs text-slate-300 font-bold">[ZK-GATE]</span>
            </div>
            <h4 className="disconnected-title">Wallet Not Connected</h4>
            <p className="disconnected-desc">
              Connect your Midnight Lace wallet to interact with confidential solvency circuits and prove reserves in zero knowledge.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <button
              type="button"
              onClick={() => onConnect()}
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
                <span>Connect Lace Wallet</span>
              )}
            </button>

            {onConnectDemo && (
              <button
                type="button"
                onClick={onConnectDemo}
                style={{
                  background: 'transparent',
                  border: '1px dashed #334155',
                  borderRadius: '3px',
                  padding: '8px 14px',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#64748b';
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.color = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
                id="connect-demo-btn"
              >
                Connect Demo Mode (Simulated Preprod Provider) &rarr;
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="connected-state">
          <div className="connected-banner">
            <div className="flex items-center gap-2">
              <span className="status-indicator-dot dot-emerald"></span>
              <span className="connected-label">Wallet Connected</span>
            </div>
            <button
              onClick={onDisconnect}
              className="disconnect-btn"
              id="disconnect-wallet-btn"
              title="Disconnect Wallet"
            >
              <span className="font-mono text-xs mr-1">[&times;]</span>
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
                <span className="font-mono text-xs mr-1">[COPY]</span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="address-code" title={walletAddress || ''}>
              {walletAddress ? truncateAddress(walletAddress) : 'No address retrieved'}
            </div>
          </div>

          {shieldedAddress && (
            <div className="address-display-box shielded-box">
              <div className="address-label-row">
                <span className="address-type-label text-slate-400">Shielded Address (ZK):</span>
              </div>
              <div className="address-code text-slate-200" title={shieldedAddress}>
                {truncateAddress(shieldedAddress)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
