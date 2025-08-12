
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useWeb3 } from './Web3Context';

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  creator: string;
  salt: string;
  customSuffix: string;
  deployedAt: string;
}

interface TokenState {
  userTokens: TokenData[];
  isLoading: boolean;
  totalTokensDeployed: number;
}

type TokenAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_TOKENS'; payload: TokenData[] }
  | { type: 'ADD_TOKEN'; payload: TokenData }
  | { type: 'SET_TOTAL_DEPLOYED'; payload: number };

interface TokenContextType {
  state: TokenState;
  refreshUserTokens: () => Promise<void>;
  addToken: (token: TokenData) => void;
}

const initialState: TokenState = {
  userTokens: [],
  isLoading: false,
  totalTokensDeployed: 0,
};

function tokenReducer(state: TokenState, action: TokenAction): TokenState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_TOKENS':
      return { ...state, userTokens: action.payload, isLoading: false };
    case 'ADD_TOKEN':
      return { 
        ...state, 
        userTokens: [action.payload, ...state.userTokens],
        totalTokensDeployed: state.totalTokensDeployed + 1
      };
    case 'SET_TOTAL_DEPLOYED':
      return { ...state, totalTokensDeployed: action.payload };
    default:
      return state;
  }
}

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tokenReducer, initialState);
  const { state: web3State } = useWeb3();

  const refreshUserTokens = async () => {
    if (!web3State.isConnected || !web3State.account) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Here we would fetch user tokens from the blockchain
      // For now, using localStorage as a mock
      const storedTokens = localStorage.getItem(`tokens_${web3State.account}`);
      const tokens = storedTokens ? JSON.parse(storedTokens) : [];
      
      dispatch({ type: 'SET_USER_TOKENS', payload: tokens });
    } catch (error) {
      console.error('Failed to fetch user tokens:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToken = (token: TokenData) => {
    dispatch({ type: 'ADD_TOKEN', payload: token });
    
    // Store in localStorage
    if (web3State.account) {
      const storedTokens = localStorage.getItem(`tokens_${web3State.account}`);
      const tokens = storedTokens ? JSON.parse(storedTokens) : [];
      tokens.unshift(token);
      localStorage.setItem(`tokens_${web3State.account}`, JSON.stringify(tokens));
    }
  };

  useEffect(() => {
    if (web3State.isConnected && web3State.account) {
      refreshUserTokens();
    } else {
      dispatch({ type: 'SET_USER_TOKENS', payload: [] });
    }
  }, [web3State.isConnected, web3State.account]);

  const contextValue: TokenContextType = {
    state,
    refreshUserTokens,
    addToken,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}
