import React, { useState } from 'react';
import { Wallet, Copy, Check, LogOut, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
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
    // Note: Midnight DApp Connector API does not provide a remote disconnect() method.
    // Calling hook.disconnect() resets local connection state in application memory.
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
    if (addr.length <= 18) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const isNotDetected = error?.toLowerCase().includes('not detected') || error?.toLowerCase().includes('not installed');

  return (
    <div className="wallet-status-box mb-4">
      {/* State 4: Error State */}
      {error && !isConnected && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#fca5a5',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{isNotDetected ? 'Lace Wallet Extension Not Found' : 'Wallet Connection Notice'}</span>
          </div>
          <p style={{ lineHeight: 1.4 }}>
            {isNotDetected
              ? 'Lace wallet extension was not detected on window.midnight.mnLace. Please install or enable the extension to connect.'
              : error}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            {isNotDetected ? (
              <a
                href="https://docs.midnight.network/relnotes/lace"
                target="_blank"
                rel="noreferrer"
                className="nav-btn nav-btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Install Lace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                className="nav-btn nav-btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Retry Connection
              </button>
            )}
            {onConnectDemo && (
              <button
                type="button"
                onClick={onConnectDemo}
                className="nav-btn"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Use Demo Wallet
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (onClearError) onClearError();
                hook.disconnect();
              }}
              className="nav-btn"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* State 1 (Idle) & State 2 (Connecting) */}
      {!isConnected ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                }}
              >
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>
                  Wallet Provider
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Connect Lace via Midnight DApp Connector API
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => onSwitchNetwork && onSwitchNetwork('preprod')}
                className={`preset-chip ${networkId === 'preprod' ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                Preprod
              </button>
              <button
                type="button"
                onClick={() => onSwitchNetwork && onSwitchNetwork('preview')}
                className={`preset-chip ${networkId === 'preview' ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                Preview
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Connecting State vs Idle State Button */}
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="cta-button cta-button-primary"
              style={{ flex: 1, minWidth: '180px', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Connecting to Lace...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-1" />
                  <span>Connect Lace Wallet</span>
                </>
              )}
            </button>

            {onConnectDemo && !isConnecting && (
              <button
                type="button"
                onClick={onConnectDemo}
                className="cta-button cta-button-secondary"
                style={{ flex: 1, minWidth: '180px', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
              >
                <span>Launch Demo Wallet</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>
                Wallet Connected &bull; Midnight {networkId.toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDisconnect}
              className="nav-btn"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#f87171' }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Disconnect</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                background: '#0b1120',
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
                  Unshielded Address
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e2e8f0' }}>
                  {truncate(address || '')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(address || '', false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                title="Copy Address"
              >
                {copiedUnshielded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {shieldedAddress && (
              <div
                style={{
                  flex: 1,
                  minWidth: '200px',
                  background: '#0b1120',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
                    Shielded ZK Address
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa' }}>
                    {truncate(shieldedAddress)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(shieldedAddress, true)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  title="Copy Shielded Address"
                >
                  {copiedShielded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default WalletConnect;
