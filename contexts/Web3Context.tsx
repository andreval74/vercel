
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  isLoading: boolean;
}

type Web3Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: { account: string; provider: BrowserProvider; signer: JsonRpcSigner; chainId: number } }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_CHAIN_ID'; payload: number };

interface Web3ContextType {
  state: Web3State;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBSCTestnet: () => Promise<void>;
}

const BSC_TESTNET_CHAIN_ID = 97;
const BSC_MAINNET_CHAIN_ID = 56;

const initialState: Web3State = {
  isConnected: false,
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  isCorrectNetwork: false,
  isLoading: false,
};

function web3Reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: true,
        account: action.payload.account,
        provider: action.payload.provider,
        signer: action.payload.signer,
        chainId: action.payload.chainId,
        isCorrectNetwork: action.payload.chainId === BSC_TESTNET_CHAIN_ID || action.payload.chainId === BSC_MAINNET_CHAIN_ID,
        isLoading: false,
      };
    case 'SET_DISCONNECTED':
      return { ...initialState };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.payload,
        isCorrectNetwork: action.payload === BSC_TESTNET_CHAIN_ID || action.payload === BSC_MAINNET_CHAIN_ID,
      };
    default:
      return state;
  }
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found! Please install MetaMask.');
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      dispatch({
        type: 'SET_CONNECTED',
        payload: {
          account: accounts[0],
          provider,
          signer,
          chainId: Number(network.chainId),
        },
      });

      // Store connection in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', accounts[0]);

      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: 'SET_DISCONNECTED' });
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    toast.success('Wallet disconnected');
  };

  const switchToBSCTestnet = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: 'BSC Testnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'tBNB',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add BSC Testnet:', addError);
          toast.error('Failed to add BSC Testnet to MetaMask');
        }
      } else {
        console.error('Failed to switch to BSC Testnet:', switchError);
        toast.error('Failed to switch network');
      }
    }
  };

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.ethereum && localStorage.getItem('walletConnected') === 'true') {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            dispatch({
              type: 'SET_CONNECTED',
              payload: {
                account: accounts[0].address,
                provider,
                signer,
                chainId: Number(network.chainId),
              },
            });
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          localStorage.removeItem('walletConnected');
        }
      }
    };

    autoConnect();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== state.account) {
          // Reconnect with new account
          connectWallet();
        }
      };

      const handleChainChanged = (chainId: string) => {
        dispatch({ type: 'SET_CHAIN_ID', payload: parseInt(chainId, 16) });
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [state.account]);

  const contextValue: Web3ContextType = {
    state,
    connectWallet,
    disconnectWallet,
    switchToBSCTestnet,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
