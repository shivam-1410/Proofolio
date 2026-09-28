import { useState, useEffect, useCallback } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

export type WalletStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface UseMidnightWalletReturn {
  status: WalletStatus;
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  wallet: ConnectedAPI | null;
}

interface WalletStoreState {
  status: WalletStatus;
  address: string | null;
  error: string | null;
  wallet: ConnectedAPI | null;
}

let storeState: WalletStoreState = {
  status: 'idle',
  address: null,
  error: null,
  wallet: null,
};

const listeners = new Set<(state: WalletStoreState) => void>();

function updateStore(updates: Partial<WalletStoreState>) {
  storeState = { ...storeState, ...updates };
  listeners.forEach((listener) => listener(storeState));
}

export function useMidnightWallet(): UseMidnightWalletReturn {
  const [state, setState] = useState<WalletStoreState>(storeState);

  useEffect(() => {
    const listener = (nextState: WalletStoreState) => setState(nextState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const connect = useCallback(async () => {
    updateStore({ status: 'connecting', error: null });

    try {
      // 1. Check window.midnight?.mnLace exists
      const mnLace = (window.midnight as any)?.mnLace;
      if (!mnLace) {
        throw new Error('Lace wallet not detected');
      }

      // 2. Call isEnabled() to check prior authorization if supported
      if (typeof mnLace.isEnabled === 'function') {
        try {
          const alreadyEnabled = await mnLace.isEnabled();
          console.log('[useMidnightWallet] mnLace.isEnabled():', alreadyEnabled);
        } catch (e) {
          console.warn('[useMidnightWallet] isEnabled() check failed:', e);
        }
      }

      // 3. Call enable() to trigger Lace approval popup and get ConnectedAPI
      let connectedAPI: ConnectedAPI | null = null;
      if (typeof mnLace.enable === 'function') {
        connectedAPI = await mnLace.enable();
      } else if (typeof mnLace.connect === 'function') {
        // Fallback for connector variants providing connect()
        connectedAPI = await mnLace.connect('preprod');
      } else {
        throw new Error('Lace wallet connector does not support enable()');
      }

      if (!connectedAPI) {
        throw new Error('Failed to obtain connected wallet API instance');
      }

      // 4. Call state() or get address from connectedAPI
      let resolvedAddress: string | null = null;

      if (typeof (connectedAPI as any).state === 'function') {
        const walletState = await (connectedAPI as any).state();
        resolvedAddress =
          walletState?.address ||
          walletState?.unshieldedAddress ||
          walletState?.shieldedAddress ||
          (Array.isArray(walletState?.addresses) ? walletState.addresses[0] : null);
      }

      if (!resolvedAddress && typeof connectedAPI.getUnshieldedAddress === 'function') {
        const unshielded = await connectedAPI.getUnshieldedAddress();
        resolvedAddress = unshielded?.unshieldedAddress || null;
      }

      if (!resolvedAddress && typeof connectedAPI.getShieldedAddresses === 'function') {
        const shielded = await connectedAPI.getShieldedAddresses();
        resolvedAddress = shielded?.shieldedAddress || null;
      }

      if (!resolvedAddress) {
        throw new Error('Wallet connected, but failed to retrieve account address');
      }

      updateStore({
        wallet: connectedAPI,
        address: resolvedAddress,
        status: 'connected',
        error: null,
      });
    } catch (err: any) {
      console.error('[useMidnightWallet] connect error:', err);

      let errorMessage = err?.message || String(err);

      // Surface specific failures as required
      if (errorMessage.toLowerCase().includes('not detected') || errorMessage.toLowerCase().includes('not installed')) {
        errorMessage = 'Lace wallet not detected';
      } else if (
        errorMessage.toLowerCase().includes('reject') ||
        errorMessage.toLowerCase().includes('cancel') ||
        errorMessage.toLowerCase().includes('denied') ||
        errorMessage.toLowerCase().includes('declined') ||
        err?.code === 4001
      ) {
        errorMessage = 'Connection request rejected';
      }

      updateStore({
        error: errorMessage,
        status: 'error',
      });
    }
  }, []);

  // Affordance to reset local connection state (since DApp Connector API provides no remote disconnect method)
  const disconnect = useCallback(() => {
    updateStore({
      status: 'idle',
      address: null,
      wallet: null,
      error: null,
    });
  }, []);

  return {
    status: state.status,
    isConnected: state.status === 'connected',
    address: state.address,
    isLoading: state.status === 'connecting',
    error: state.error,
    connect,
    disconnect,
    wallet: state.wallet,
  };
}

export default useMidnightWallet;
